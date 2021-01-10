const express = require("express");
<<<<<<< HEAD
const fs = require("fs");
//var spawn = require("child_process").spawn;
const path = require("path");
const router = express.Router();
const PORT = 3000;
const app = express();
const session = require('express-session')

//Buffer.concat([buf1, buf2, buf3], totalLength);
var data_name1 = "soccer";
var data_name2 = "gaming";
var data_name3 = "gaming";
var curr_video = 1;

const { exec } = require('child_process');
const child1 = exec('python ./test_nas_video_process_modify.py --quality ultra --data_name ' + data_name1 + ' --use_cuda  --load_on_memory',{maxBuffer: 10**9, encoding: 'buffer'}, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log("inside exec callback");
 // console.log(`stdout: ${stdout}`);
  //console.error(`stderr: ${stderr}`);
});


child1.stdin.setEncoding('utf-8');
child1.stdin.write("1\n");
//child1.stdin.end();

/*
const child2 = exec('python ./test_nas_video_process_modify.py --quality ultra --data_name ' + data_name2 + ' --use_cuda  --load_on_memory',{maxBuffer: 10**9, encoding: 'buffer'}, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log("inside exec callback");
 // console.log(`stdout: ${stdout}`);
  //console.error(`stderr: ${stderr}`);
});


child2.stdin.setEncoding('utf-8');
child2.stdin.write("1\n");
child2.stdin.end();
*/
/*
const child3 = exec('python ./test_nas_video_process_modify.py --quality ultra --data_name ' + data_name3 + ' --use_cuda  --load_on_memory',{maxBuffer: 10**9, encoding: 'buffer'}, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log("inside exec callback");
 // console.log(`stdout: ${stdout}`);
  //console.error(`stderr: ${stderr}`);
});


child3.stdin.setEncoding('utf-8');
child3.stdin.write("1\n");
child3.stdin.end();
*/


//process.stdin.pipe(child.stdin);
//child.stdin.write("2\n");
//child.stdin.end();
//child.stdout.pipe(process.stdout);
var listOfSegs1 = [];
var listOfBufs1 = [];
var listOfSegs2 = [];
var listOfBufs2 = [];
var listOfSegs3 = [];
var listOfBufs3 = [];

//var mapOfSegs = new Map();
var segCount1 = 0;
var segCount2 = 0;
var segCount3 = 0;
var totalSegs = 0;
var serverOn = false;
var initialBufferDone = false;
var lastSegList1 = 20, lastSegList2 = 20, lastSegList3 = 20;

child1.stdout.on('data', function(data) {
  //console.log("inside event on");
  //console.log(data.length);
  var dataStr = data.toString('ascii'); 
  //console.log(dataStr);
  var last3 = dataStr[dataStr.length - 3] + dataStr[dataStr.length - 2] + dataStr[dataStr.length - 1];
   
  //console.log(last3);
  if (curr_video == 1) {
  	if (last3 == "end") {
		let len = data.length;
		let newData = data.slice(0, len - 3);
		//listOfBufs.push(data);
		segCount1++;
		totalSegs++;
		console.log("vid " + curr_video + " " + segCount1);
		listOfBufs1.push(newData);
		//mapOfSegs.set(segCount, Buffer.concat(listOfBufs));
		listOfSegs1.push(Buffer.concat(listOfBufs1));
		listOfBufs1 = [];

		if (!initialBufferDone) {
			++curr_video;
		}
  	} else {
  		//console.log(data.length);
  		listOfBufs1.push(data);
  	}
   } else if (curr_video == 2) {
	if (last3 == "end") {
                let len = data.length;
                let newData = data.slice(0, len - 3);
                //listOfBufs.push(data);
                segCount2++;
                totalSegs++;
                console.log("vid " + curr_video + " " + segCount2);
                listOfBufs2.push(newData);
                //mapOfSegs.set(segCount, Buffer.concat(listOfBufs));
                listOfSegs2.push(Buffer.concat(listOfBufs2));
                listOfBufs2 = [];
                
                if (!initialBufferDone) {
                        ++curr_video;
                }
        } else {
                //console.log(data.length);
                listOfBufs2.push(data);
        }
    } else if (curr_video == 3) {
	if (last3 == "end") {
                let len = data.length;
                let newData = data.slice(0, len - 3);
                //listOfBufs.push(data);
                segCount3++;
                totalSegs++;
                console.log("vid " + curr_video + " " + segCount3);
                listOfBufs3.push(newData);
                //mapOfSegs.set(segCount, Buffer.concat(listOfBufs));
                listOfSegs3.push(Buffer.concat(listOfBufs3));
                listOfBufs3 = [];
               
                if (!initialBufferDone) {
                	curr_video = 1;
                }
        } else {
                //console.log(data.length);
                listOfBufs3.push(data);
        }


    }    

    if (totalSegs == 60 && !serverOn) {
    	serverOn = true;
	initialBufferDone = true;
	startApp();
    }
});

/*
child2.stdout.on('data', function(data) {
  //console.log("inside event on");
  //console.log(data.length);
  var dataStr = data.toString('ascii');
  //console.log(dataStr);
  var last3 = dataStr[dataStr.length - 3] + dataStr[dataStr.length - 2] + dataStr[dataStr.length - 1];

  //console.log(last3);

  if (last3 == "end") {
        let len = data.length;
        let newData = data.slice(0, len - 3);
        //listOfBufs.push(data);
        segCount2++;
	totalSegs++;
        console.log(segCount2);
        listOfBufs2.push(newData);
        //mapOfSegs.set(segCount, Buffer.concat(listOfBufs));
        listOfSegs2.push(Buffer.concat(listOfBufs2));
        listOfBufs2 = [];

	if (totalSegs >= 40) {
		console.log("40 total");
	}

  } else {
        //console.log(data.length);
        listOfBufs2.push(data);
  }
});
*/

/*
child3.stdout.on('data', function(data) {
  //console.log("inside event on");
  //console.log(data.length);
  var dataStr = data.toString('ascii');
  //console.log(dataStr);
  var last3 = dataStr[dataStr.length - 3] + dataStr[dataStr.length - 2] + dataStr[dataStr.length - 1];

  //console.log(last3);

  if (last3 == "end") {
        let len = data.length;
        let newData = data.slice(0, len - 3);
        //listOfBufs.push(data);
        segCount3++;
        totalSegs++;
        console.log(segCount3);
        listOfBufs3.push(newData);
        //mapOfSegs.set(segCount, Buffer.concat(listOfBufs));
        listOfSegs3.push(Buffer.concat(listOfBufs3));
        listOfBufs3 = [];

        if (totalSegs >= 40) {
                console.log("40 total");
        }

  } else {
        //console.log(data.length);
        listOfBufs3.push(data);
  }
});
*/




//var childProcess = spawn('python',["./python*/test_nas_video_process_modify.py", "--quality", "ultra", "--use_cuda", "--load_on_memory"], {shell: true});
  /*                          
childProcess.on('exit', function() {
  process.exit()
})  
     
childProcess.stdout.on('data', function(data) { 
    console.log("isn");
} )*/


/*
app.get('/videos/segments240p', function(req, res) {
  const segment = req.query.segment;
  //const path = 'assets/sample.mp4'
  const stat = fs.statSync("./videos/segments240p/fragSegments240p/" + segment);
  const segmentSize = stat.size;
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream("./videos/segments240p/fragSegments240p/" + segment, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${segmentSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    console.log("insdie");
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Range': `bytes 0-100/${segmentSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': 101,
      'Content-Type': 'video/mp4',
    }
    const file = fs.createReadStream("./videos/segments240p/fragSegments240p/" +  segment, {start:0, end:100});
    //console.log("inside else");

    res.writeHead(206, head);
    file.pipe(res);
  }
});*/

var num = 0;
=======
const path = require("path");
const router = express.Router();
const PORT = process.env.PORT || 5000;
const app = express();
>>>>>>> 89e1649faabe9d5d0bd563e1c099033d7981e22a

router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
  //__dirname : It will resolve to your project folder.
});

<<<<<<< HEAD
router.get("/videoRequest.js", function (req, res) {
  res.sendFile(path.join(__dirname + "/videoRequest.js"));
});


var srOn = false;
app.use("/videos", function(req, res) {
	var dataName = req.query.dataName;
	var segmentName = req.query.segmentName;
	var segmentNum = parseInt(req.query.segmentNum);
	console.log("srSegs " + segCount1);
	console.log("currSeg " + segmentNum);

	var srSegment = null;

	if (dataName == "news") {
		let numOfSrSegs = listOfSegs1.length;
		segmentNum <= numOfSrSegs ? srSegment = listOfSegs1[segmentNum - 1] : srSegment = null; 
		child1.stdin.setEncoding('utf-8');
		next_segnum_vid = (lastSegList1 + 1).toString() + "-" + "0\n";
		lastSegList1 += 1;
		child1.stdin.write(next_segnum_vid);
		//child1.stdin.end();
		curr_video = 1;		
	} else if (dataName == "soccer") {
		let numOfSrSegs = listOfSegs2.length;
		segmentNum <= numOfSrSegs ? srSegment = listOfSegs2[segmentNum - 1] : srSegment = null;
                child1.stdin.setEncoding('utf-8');
                next_segnum_vid = (lastSegList2 + 1).toString() + "-" + "1\n";
		lastSegList2 += 1;
                child1.stdin.write(next_segnum_vid);
                //child1.stdin.end();
                curr_video = 2;	
	} else if (dataName == "gaming") {
		let numOfSrSegs = listOfSegs3.length;
		segmentNum <= numOfSrSegs ? srSegment = listOfSegs3[segmentNum - 1] : srSegment = null;
                child1.stdin.setEncoding('utf-8');
                next_segnum_vid = (lastSegList3 + 1).toString() + "-" + "2\n";
		lastSegList3 += 1;
                child1.stdin.write(next_segnum_vid);
                //child1.stdin.end();
                curr_video = 3;

	}
        const head = {
		'Content-Type': 'video/mp4',
        }
	
	if (req.query.srOn === "false") {
	//express.static(path.join(__dirname, "/videos/segments240p/fragSegments240p/" + segmentName)));
	
		const file = fs.createReadStream("./videos/" + dataName + "/240p/" + segmentName);
		res.writeHead(200, head);
    		file.pipe(res);	
	} else {
	
	
		if (srSegment) {
				//console.log("inside");
				//console.log(listOfSegs);	
			res.writeHead(200, {'Content-Type': 'video/mp4'});
			
       			//res.write(listOfSegs[0]);
			if (dataName == "news") {
        			res.write(listOfSegs1[segmentNum - 1]);
			} else if (dataName == "soccer") {
				res.write(listOfSegs2[segmentNum - 1]);
			} else if (dataName == "gaming") {
				res.write(listOfSegs3[segmentNum - 1]);
			}
			res.end();
				
		} else {
			const file = fs.createReadStream("./videos/" + dataName + "/240p/" + segmentName);
           		res.writeHead(200, head);
    			file.pipe(res);
		}
	

	}
}); 

app.get("/diskinfo", (req, res) => {

	exec('df --output=used,pcent -k /', (err, stdout, stderr) => {
  		if (err) {
    		// node couldn't execute the command
    		return;
  		}

  		// the *entire* stdout and stderr (buffered)
  		
		res.send(stdout.toString());
		res.end();
	}); 
});



app.get("/", router);
app.get("/videoRequest.js", router);
//app.use("/videos/segments240p/fragSegments240p/news_240p_segment_1.mp4", express.static(path.join(__dirname, "/videos/segments240p/fragSegments240p/news_240p_segment_1.mp4")));
//app.use("/videos/segments240p/fragSegments240p/testoutput.mp4", express.static(path.join(__dirname, "/videos/segments240p/fragSegments240p/testoutput.mp4")));
app.get("/shaka_player", express.static(path.join(__dirname, "shaka_player")));





function startApp() {

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`);
}); 
}
=======
app.use("/", router);
app.use("/videos", express.static(path.join(__dirname, "videos")));
app.use("/", express.static(path.join(__dirname, "")));
app.use("/shaka_player", express.static(path.join(__dirname, "shaka_player")));

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`);
});
>>>>>>> 89e1649faabe9d5d0bd563e1c099033d7981e22a
