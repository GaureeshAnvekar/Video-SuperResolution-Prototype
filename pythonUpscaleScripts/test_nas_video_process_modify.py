import argparse, os, sys, logging, random, time, queue, signal, copy
import numpy as np
import torch
import torch.multiprocessing as mp

import faulthandler; faulthandler.enable();

from option_modify import opt
#import process as proc
import process_modify as proc
import os

if __name__ == "__main__":

	MAX_FPS =  30
	MAX_SEGMENT_LENGTH = 4
	SHARED_QUEUE_LEN = MAX_FPS * MAX_SEGMENT_LENGTH #Regulate GPU memory usage (> 3 would be fine)

	mp.set_start_method('spawn', force=True)
	torch.multiprocessing.set_sharing_strategy('file_descriptor')

               
	#create Queue, Pipe
	decode_queue = mp.Queue()
	dnn_queue = mp.JoinableQueue()
	data_queue = mp.JoinableQueue()
	encode_queue = mp.JoinableQueue()
	output_output, output_input = mp.Pipe(duplex=False)

	#create shared tensor
	shared_tensor_list = {}
	res_list = [(270, 480), (360, 640), (540, 960), (1080, 1920)]
	for res in res_list:
		shared_tensor_list[res[0]] = []
		for _ in range(SHARED_QUEUE_LEN):
			shared_tensor_list[res[0]].append(torch.ByteTensor(res[0], res[1], 3).cuda().share_memory_())

	#create processes
	decode_process = mp.Process(target=proc.decode, args=(decode_queue, encode_queue, data_queue, shared_tensor_list))
	sr_process = mp.Process(target=proc.super_resolution, args=(encode_queue, dnn_queue, data_queue, shared_tensor_list))
	encode_process = mp.Process(target=proc.encode, args=(encode_queue, shared_tensor_list))

	#start processes
	sr_process.start()
	decode_process.start()
	encode_process.start()

	
	#load a model and its weights
	pretrained_path = os.path.join(opt.checkpoint_dir, 'epoch_{}.pth'.format(opt.test_num_epoch))
	dnn_queue.put(('load_model', pretrained_path))
	dnn_queue.join()

	#caution: fps and (segment) duration should be given correctly
	segment_fps = 24
	segment_size = 4

	#create request processes
	chunk_idxs = range(1, 2)
	request_process_list = []
	for idx in chunk_idxs:
		dnn_queue.put(('set_inference_idx_max',)) #output = 0,1,2,3,4 - 4 is a full model
		dnn_queue.join() # wait for done
		request_process_list.append(mp.Process(target=proc.request, args=(decode_queue, 240, idx, segment_fps, segment_size, output_input)))
		#request_process_list.append(mp.Process(target=proc.request, args=(decode_queue, 360, idx, segment_fps, segment_size)))
		#request_process_list.append(mp.Process(target=proc.request, args=(decode_queue, 480, idx, segment_fps, segment_size)))
		#request_process_list.append(mp.Process(target=proc.request, args=(decode_queue, 720, idx, segment_fps, segment_size)))

	print(os.getcwd())
	#start processing video chunks
	for request_process in request_process_list:
		request_process.start()
		print(output_output.recv())
		sys.stdout.flush()
		request_process.join()

	#terminate processes
	sr_process.terminate()
	decode_process.terminate()
	encode_process.terminate()
