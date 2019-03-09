# vehicle-everything

## ve-1.0

实现视频车辆检测与跟踪功能的网页应用

### 简介

一个运行于网页端的车辆检测项目，技术栈为webpack+原生JavaScript+opencv.js。主要适用于两种场景：电子警察和高点监控。

### 依赖环境搭建与项目部署

#### 依赖环境搭建

依次安装如下依赖环境：

- git版本控制工具： [git官网](https://git-scm.com/)
- node环境: [node.js中文官网](https://nodejs.org/zh-cn/)
  - 经测试可以安装最新稳定版，如果出现问题请切换到@6.x.x版本或@4.x.x版本

#### 项目部署

- 进入项目根目录, 全局安装webpack@1.15.0:

  ```
  npm install webpack@1.15.0 -g
  ```
  
- 安装所有项目所需的package，生成`./node_modules`目录:

  ```
  npm install
  ```

- 打包所有处于src中的源文件（源代码都储存在`./src`目录下）,生成`./dist`目录：

  ```
  webpack
  ```

- 通过webpack-dev-server使项目在本地服务器运行：

  Windows系统：

  ```
  npm run dev_win
  ```

  Mac系统：

  ```
  npm run dev
  ```

- 在`http://localhost:8099/dist/view`中查看应用。可以上传本地任意的车辆视频文件来检测。

### 说明

- 本项目托管于github（ [项目首页](https://github.com/Moltemort/vehicle-everything) ）。

- 在Google Chrome和Microsoft Edge浏览器经测试可以运行，其他浏览器没测试过，最好不要在IE10以下浏览器运行。
- 使用`./resource/myElePliceTestVideo.mp4`的检测结果较好。需求中给出的电子警察和高点监控视频存放在`./src/testVideo/`中(未上传到github)。
- 原需求说明文档和应用效果图位于根目录。
- webpack是个打包工具，打包后的Html，CSS和JavaScript文件都位于`./dist/`中；几乎所有的逻辑都位于`./src/page/index/`下，可以进一步完善这个代码。
- 上传视频的大小最好不要超过100M,且以AVC H264编码的mp4文件为宜。如果出现视频不能显示的情况，请先将文件转换为该格式。
- 开发进度和现有问题
  - 实现了在电子警察场景下车辆的bounding-box标注。业务逻辑方面只开发了电子警察和高点监控两种场景的选择和车辆计数的逻辑。
  - 问题
    - 车辆计数的逻辑存在很严重的bug
    - 高点监控的参数没调优，导致高点监控的鲁棒性不高。两个场景用的是同一套opencv的参数。
    - 不能识别重叠的车辆

