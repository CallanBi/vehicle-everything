/*
* @Author: Moltemort
* @Date:   2018-10-14 09:51:32
* @Last Modified by:   Moltemort
* @Last Modified time: 2018-11-21 17:19:52
*/

cv = require("opencv.js");
require("./index.css");
// console.log("hello index.js");

var body = document.getElementsByTagName("body")[0];
var videoElement = document.getElementById("video-element");
var inputElement = document.getElementById("fileInput");
var vehicleNum = -1;
const FPS = 25;


// 电子警察应用场景下的参数
var plice = {
    gaussianBlurPar : [13, 13, 2,2],
    backgroundSubPar : [0.2],
    binaryProcessPar : [30, 255],
    dilatedPar : [11, 30, 1],
    corrodedPar : [11, 30, 1],
    boundRectSizeThreshold : [50, 50]
};

// 高点监控场景下的参数
var highSpot = {
    gaussianBlurPar : [13, 13, 2,2],
    backgroundSubPar : [0.2],
    binaryProcessPar : [30, 255],
    dilatedPar : [11, 30, 1],
    corrodedPar : [11, 30, 1],
    boundRectSizeThreshold : [10, 10]
 };

function processVideo(src, dst, cap, fgbg, parObj) {
    gaussianBlurPar = parObj.gaussianBlurPar;
    backgroundSubPar = parObj.backgroundSubPar;
    binaryProcessPar = parObj.binaryProcessPar;
    dilatedPar = parObj.dilatedPar;
    corrodedPar = parObj.corrodedPar;
    boundRectSizeThreshold = parObj.boundRectSizeThreshold;

    let begin = Date.now();
    cap.read(src);

    // 高斯平滑处理
    let ksize = new cv.Size(gaussianBlurPar[0], gaussianBlurPar[1]);
    cv.GaussianBlur(src, dst, ksize, gaussianBlurPar[2], gaussianBlurPar[3], cv.BORDER_DEFAULT);
    // cv.imshow("canvasOutput", dst);

    // 灰度处理
    cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY);
    // cv.imshow("canvasOutput", dst);


    // 背景差法处理
    fgbg.apply(dst, dst, backgroundSubPar[0]);
    // cv.imshow("canvasOutput", dst);

    // 二值化处理
    cv.threshold(dst, dst, binaryProcessPar[0], binaryProcessPar[1], cv.THRESH_BINARY);
    // cv.imshow("canvasOutput", dst);

    // 膨胀处理
    let Md = cv.Mat.ones(dilatedPar[0], dilatedPar[1], cv.CV_8U);
    let anchor = new cv.Point(-1, -1);
    cv.dilate(dst, dst, Md, anchor, dilatedPar[2], cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
    // cv.imshow("canvasOutput", dst);

    // 腐蚀处理
    let Me = cv.Mat.ones(corrodedPar[0], corrodedPar[1], cv.CV_8U);
    cv.erode(dst, dst, Me, anchor, corrodedPar[2], cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());

    //绘制轮廓
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(dst, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE);
    var boundRects = [];
    let rectangleColor = new cv.Scalar(255, 0, 0);
    for (let i = 0; i < contours.size(); ++i) {
        let cnt = contours.get(i);
        boundRects.push(cv.boundingRect(cnt));
        if(boundRects[i].width>boundRectSizeThreshold[0] && boundRects[i].height>boundRectSizeThreshold[1]) {
            let point1 = new cv.Point(boundRects[i].x, boundRects[i].y);
            let point2 = new cv.Point(boundRects[i].x + boundRects[i].width, boundRects[i].y + boundRects[i].height);
            cv.rectangle(src, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);
            document.getElementById("count").innerText = ++vehicleNum;
        }
    }

    // 输出
    cv.imshow("canvasOutput", src);

    // schedule next one.
    let delay = 1000/FPS - (Date.now() - begin);
    setTimeout(processVideo, delay, src, dst, cap, fgbg, parObj);
}




inputElement.addEventListener("change", function (e) {
    /*
    *使用Canvas 2D API的CanvasRenderingContext2D.drawImage()方法将视频绘制到画布上
    *可以使用图像入门中的方法来读取和显示画布中的图像。对于播放视频，应在每延迟毫秒执行cv.imshow()
    *如果视频是30fps，延迟毫秒应该是（1000/30 - processing_time）
    */
    videoElement.src = URL.createObjectURL(e.target.files[0]);
    videoElement.width = 640;
    videoElement.height = 480;
    let src = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC4);
    let dst = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC1);
    let cap = new cv.VideoCapture(videoElement);
    let fgbg = new cv.BackgroundSubtractorMOG2(500, 20, false);

    // 如果选中的是电子警察
    if (document.getElementById("context").selectedIndex === 0 ) {
        // console.log("plice");
        setTimeout(processVideo, 0, src, dst, cap, fgbg, plice);
    }
    // 如果选中的是高点监控
    else {
        // console.log("highSpot");
        setTimeout(processVideo, 0, src, dst, cap, fgbg, highSpot);
    }
});
 