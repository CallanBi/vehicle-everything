/*
* @Author: Moltemort
* @Date:   2018-10-14 09:51:32
* @Last Modified by:   Moltemort
* @Last Modified time: 2018-10-15 19:39:38
*/

cv = require("opencv.js");
require("./index.css");
console.log("hello index.js");

 var body = document.getElementsByTagName("body")[0];
 var videoElement = document.getElementById("video-element");
 var inputElement = document.getElementById("fileInput");

 inputElement.addEventListener("change", function (e) {
     videoElement.src = URL.createObjectURL(e.target.files[0]);
     videoElement.width = 640;
     videoElement.height = 480;

     //使用Canvas 2D API的CanvasRenderingContext2D.drawImage（）方法将视频绘制到画布上。最后，我们可以使用图像入门中的方法来读取和显示画布中的图像。对于播放视频，应在每延迟毫秒执行cv.imshow（）。我们建议使用setTimeout（）方法。如果视频是30fps，延迟毫秒应该是（1000/30 - processing_time）。
     let src = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC4);
     let dst = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC1);
     let cap = new cv.VideoCapture(videoElement);
     const FPS = 30;
     function processVideo() {
         let begin = Date.now();
         cap.read(src);
         cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
         cv.imshow("canvasOutput", dst);
         // schedule next one.
         let delay = 1000/FPS - (Date.now() - begin);
         setTimeout(processVideo, delay);
     }
     // schedule first one.
     setTimeout(processVideo, 0);
 });
 