const express = require("express");
var spawn = require("child_process").spawn;
const path = require("path");
const router = express.Router();
const PORT = process.env.PORT || 3000;
const app = express();




var process = spawn('python',["./pythonUpscaleScripts/test_nas_video_process_modify.py", "--quality", "ultra", "--use_cuda", "--load_on_memory"]);
                            
  
     
process.stdout.on('data', function(data) { 
    console.log(data);
} )



router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
  //__dirname : It will resolve to your project folder.
});

app.use("/", router);
app.use("/videos", express.static(path.join(__dirname, "videos")));
app.use("/", express.static(path.join(__dirname, "")));
app.use("/shaka_player", express.static(path.join(__dirname, "shaka_player")));

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`);
});
