/*
* @Author: Moltemort
* @Date:   2018-10-14 09:51:32
* @Last Modified by:   Moltemort
* @Last Modified time: 2018-10-31 10:36:43
*/

cv = require("opencv.js");
require("./index.css");
// console.log("hello index.js");

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
     let fgbg = new cv.BackgroundSubtractorMOG2(500, 20, false);

     const FPS = 25;

     function processVideo() {      
        let begin = Date.now();
        cap.read(src);

        // 高斯平滑处理
        let ksize = new cv.Size(13, 13);
        cv.GaussianBlur(src, dst, ksize, 2, 2, cv.BORDER_DEFAULT);
        // cv.imshow("canvasOutput", dst);

        // 灰度处理
        cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY);
        // cv.imshow("canvasOutput", dst);


        // 背景差法处理
        fgbg.apply(dst, dst, 0.2);
        // cv.imshow("canvasOutput", dst);

        // 二值化处理
        cv.threshold(dst, dst, 30, 255, cv.THRESH_BINARY);
        // cv.imshow("canvasOutput", dst);

        // 膨胀处理
        let Md = cv.Mat.ones(11, 30, cv.CV_8U);
        let anchor = new cv.Point(-1, -1);
        cv.dilate(dst, dst, Md, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
        // cv.imshow("canvasOutput", dst);

        // 腐蚀处理
        let Me = cv.Mat.ones(11, 30, cv.CV_8U);
        cv.erode(dst, dst, Me, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());



        //绘制轮廓
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.findContours(dst, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE);
        var boundRects = [];
        let rectangleColor = new cv.Scalar(255, 0, 0);
        for (let i = 0; i < contours.size(); ++i) {
            let cnt = contours.get(i);
            boundRects.push(cv.boundingRect(cnt));
            let point1 = new cv.Point(boundRects[i].x, boundRects[i].y);
            let point2 = new cv.Point(boundRects[i].x + boundRects[i].width, boundRects[i].y + boundRects[i].height);
            cv.rectangle(src, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);
        }

        // 输出
        cv.imshow("canvasOutput", src);

        // schedule next one.
        let delay = 1000/FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
     }
     // schedule first one.
     setTimeout(processVideo, 0);
 });
 