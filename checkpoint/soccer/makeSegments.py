import os
import subprocess

start = 0;

for i in range(216):
	subprocess.call(['ffmpeg', '-i', './fragSegments240p/output_400k.mp4', '-ss', str(start) , '-t', '4' , './fragSegments240p/out' + str((i + 1)) + '.mp4']);
	subprocess.call(['mp4fragment', './fragSegments240p/out' + str((i + 1)) + '.mp4' , './fragSegments240p/news_240p_segment_' + str((i + 1)) + '.mp4']);
	start = start + 4;
