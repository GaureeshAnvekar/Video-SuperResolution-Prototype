const videoTag = document.getElementById("video");
const myMediaSource = new MediaSource();
const url = URL.createObjectURL(myMediaSource);
videoTag.src = url;

myMediaSource.addEventListener('sourceopen', sourceOpen);



async function  sourceOpen(_) {

var myMediaSource = this;

if (myMediaSource.sourceBuffers.length == 0) {
const videoSourceBuffer = myMediaSource
  .addSourceBuffer('video/mp4; codecs="avc1.640028"');







function fetchSegment(url) {
  return fetch(url).then(function(response) {
    return response.arrayBuffer();
  });
}

var totalSegs = 18;
var timeStamp = 0;

for (i = 1; i <= totalSegs; i++) {
	await fetchSegment("http://35.204.201.33:3000/videos/segments240p/fragSegments240p/news_240p_segment_" + i + ".mp4")
	      .then(function(videoSegment) {
			videoSourceBuffer.timestampOffset = timeStamp;
			videoSourceBuffer.appendBuffer(videoSegment);
			timeStamp += 4;
	           });

} 

videoTag.play();
/*
fetchSegment("http://35.204.201.33:3000/videos/segments240p/fragSegments240p/out1.mp4")
  .then( function(videoSegment0) {
    videoSourceBuffer.addEventListener('updateend', function (_) {
//     myMediaSource.endOfStream();
      videoTag.play();
      //console.log(mediaSource.readyState); // ended
    });
    return videoSourceBuffer.appendBuffer(videoSegment0)
  })

  .then(function() {
    return  fetchSegment("http://35.204.201.33:3000/videos/segments240p/fragSegments240p/out2.mp4")
  })

  .then(async function(videoSegment1) {

    videoSourceBuffer.timestampOffset = 4;   
    await videoSourceBuffer.appendBuffer(videoSegment1);
    videoTag.play();
  })*/ 
}
}

