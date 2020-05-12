const express = require("express");
const path = require("path");
const router = express.Router();
const PORT = process.env.PORT || 5000;
const app = express();

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
