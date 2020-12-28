var videoTag1 = document.getElementById("video1");
var videoTag2 = document.getElementById("video2");
var myMediaSource1 = new MediaSource();
var myMediaSource2 = new MediaSource();
var url1 = URL.createObjectURL(myMediaSource1);
var url2 = URL.createObjectURL(myMediaSource2);
videoTag1.src = url1;
videoTag2.src = url2;


myMediaSource1.addEventListener('sourceopen', sourceOpen1);
myMediaSource2.addEventListener('sourceopen', sourceOpen2);


var dataName = "news";

var srOn1 = false;
var srOn2 = false;
var waitTime1 = 1;
var waitTime2 = 1;
var ipaddr = "35.243.187.3";

function sronClick1() {
	console.log("sr1");
        if (srOn1 == true) {
                srOn1 = false;
                waitTime1 = 2;
        } else {
                srOn1 = true;
                waitTime1 = 3;
        }
}

function sronClick2() {
  console.log("sr2");
  if (srOn2 == true) {
          srOn2 = false;
          waitTime2 = 2;
  } else {
          srOn2 = true;
          waitTime2 = 3;
  }
}






async function  sourceOpen1(_) {

  var myMediaSource1 = this;




  if (myMediaSource1.sourceBuffers.length == 0) {
    const videoSourceBuffer1 = myMediaSource1.addSourceBuffer('video/mp4; codecs="avc1.640028"');







    function fetchSegment1(url, start, end) {
      return fetch(url).then(function(response) {
        return response.arrayBuffer();
      });
    }

    var totalSegs = 18;
    var timeStamp = 0;
    let segNum = 1;
	



	  //videoSourceBuffer.timestampOffset = 4;
	  for ( ;segNum <= 2; segNum++) {
		  segName = dataName + "_240p_segment_" + segNum + ".mp4";
	 
		  await fetchSegment1("http://" + ipaddr + ":3000/videos/?dataName=" + dataName + "&segmentName=" + segName + "&segmentNum=" + segNum + "&srOn=" + srOn1)
	      		.then(function(videoSegment) {
				videoSourceBuffer1.timestampOffset = timeStamp;
				videoSourceBuffer1.appendBuffer(videoSegment);
				timeStamp += 4;
				
	           	});
		//start = end + 1;
		//end = start + 100;
	  }

	  videoTag1.play();

	  window.interval1 = window.setInterval(function() {
	  	if (videoTag1.buffered.end(0) - videoTag1.currentTime <= waitTime1) {
			clearInterval(window.interval1);
			getMoreSegs1();

		}
	  }, 1000);
	
	  //timeStamp += 4;
	

 
    async function getMoreSegs1() {
	    console.log(videoTag1.buffered.end(0));
	    console.log(videoTag1.currentTime);
	    
	   
            if (videoTag1.buffered.end(0) - videoTag1.currentTime <= waitTime1) {
                       
                        if (segNum > 47) clearInterval();
                        segName = dataName + "_240p_segment_" + segNum + ".mp4";
                        await fetchSegment1("http://" + ipaddr + ":3000/videos/?dataName=" + dataName + "&segmentName=" + segName + "&segmentNum=" + segNum + "&srOn=" + srOn1)
                                .then(function(videoSegment) {
                                        videoSourceBuffer1.timestampOffset = timeStamp;
                                        videoSourceBuffer1.appendBuffer(videoSegment);
                                        timeStamp += 4;
                                	 
				});
			++segNum;	
      	    		await getMoreSegs1();
	    } else {
	
			window.interval1 = window.setInterval(function() {
				if (videoTag1.buffered.end(0) - videoTag1.currentTime <= waitTime1) {
				
					clearInterval(window.interval1);
					getMoreSegs1();
				}
			}, 1000);
            }


    }
  }
}


async function  sourceOpen2(_) {

  var myMediaSource2 = this;




  if (myMediaSource2.sourceBuffers.length == 0) {
    const videoSourceBuffer2 = myMediaSource2.addSourceBuffer('video/mp4; codecs="avc1.640028"');







    function fetchSegment2(url, start, end) {
      return fetch(url).then(function(response) {
        return response.arrayBuffer();
      });
    }

    var totalSegs = 18;
    var timeStamp = 0;
    let segNum = 1;
	



	  //videoSourceBuffer.timestampOffset = 4;
	  for ( ;segNum <= 2; segNum++) {
		  segName = dataName + "_240p_segment_" + segNum + ".mp4";
	 
		  await fetchSegment2("http://" + ipaddr + ":3000/videos/?dataName=" + dataName + "&segmentName=" + segName + "&segmentNum=" + segNum + "&srOn=" + srOn2)
	      		.then(function(videoSegment) {
				videoSourceBuffer2.timestampOffset = timeStamp;
				videoSourceBuffer2.appendBuffer(videoSegment);
				timeStamp += 4;
				
	           	});
		//start = end + 1;
		//end = start + 100;
	  }

	  //videoTag2.play();

          window.interval2 = window.setInterval(function() {
                if (videoTag2.buffered.end(0) - videoTag2.currentTime <= waitTime2) {
                        clearInterval(window.interval2);
                        getMoreSegs2();
                }
          }, 1000);
	
	  //timeStamp += 4;
	

 
    async function getMoreSegs2() {
	    console.log(videoTag2.buffered.end(0));
	    console.log(videoTag2.currentTime);
	    
	   
            if (videoTag2.buffered.end(0) - videoTag2.currentTime <= waitTime2) {
                       
                        if (segNum > 47) clearInterval();
                        segName = dataName + "_240p_segment_" + segNum + ".mp4";
                        await fetchSegment2("http://" + ipaddr + ":3000/videos/?dataName=" + dataName + "&segmentName=" + segName + "&segmentNum=" + segNum + "&srOn=" + srOn2)
                                .then(function(videoSegment) {
                                        videoSourceBuffer2.timestampOffset = timeStamp;
                                        videoSourceBuffer2.appendBuffer(videoSegment);
                                        timeStamp += 4;
                                });
            
			++segNum;
			await getMoreSegs2();
	    } else {
			window.interval2 = window.setInterval(function() {
						if (videoTag2.buffered.end(0) - videoTag2.currentTime <= waitTime2) {
							clearInterval(window.interval2);
							getMoreSegs2();

						}

					}, 1000);
	
	    }



    }
  }
}



// To get disk storage info
window.setInterval(function() {
	fetch("http://" + ipaddr + ":3000/diskinfo").then((diskinfo) => diskinfo.text()).then(info => {
		let infoArr = info.split("\n")[1];
		let usage = infoArr.split(/[ ]+/);
		
		$("#used").text(usage[0] + "B");
		$("#usedP").text(usage[1]);
	});


}, 2000);
