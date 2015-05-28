---
layout: default
title: ionic框架学习
comments: true
category: ionic
---


## 安装ionic相关环境

### 1、安装node.js

进入[node.js官网](https://nodejs.org/) 找到相应的安装包安装。

配置环境变量：NODE_PATH 到 `~/nodejs/node_modules`

### 2、安装ionic 与 cordova

进入控制台，npm安装：

`npm install -g cordova ionic`

### 3、安装sass

命令行安装： 

`ionic setup sass`

## 新建一个工程


### 1、下载工程模板(sidemenu为例)

命令行安装： 

`ionic start myApp sidemenu`

会生成一个myApp目录。里边是原始工程文件。另外www文件夹下有可以直接作为web使用的工程文件夹。直接放入tomcat就可以运行了。


### 2、加入开发平台(Android)

进入目录

`cd myApp`

加入平台，android 或者 ios

`ionic platform add android`

此时platforms文件夹下多出对应平台的项目文件夹了。

### 3、添加cordova插件

这里已camera, barcodescanner为例。

*注意！：如果是想拷贝项目文件夹出来另外导入android工程进行开发的话，最好在真正开始开发前就引用好插件，因为引用插件会对java, js,配置文件等进行多处修改，所以不建议中途增加插件。除非用node.js直接在工作工程目录中自动添加插件*

命令行方式添加插件：

`cordova plugin add cordova-plugin-camera`

`cordova plugin add https://github.com/wildabeast/BarcodeScanner.git`

*附：barcodescanner 插件通过Git下载，需要系统中有git插件*

Git的安装步骤如下:

1. `npm install -g git`

2. 安装Git软件， 并设置PATH环境变量 `C://Program Files//Git//bin` (假设)

## 开发





## 参考资料

[ionic doc](http://www.ionicframework.com/docs/) <- 官方

[ionic 中文社区](http://ionichina.com/) 

[ionic优酷视频教程实例](http://v.youku.com/v_show/id_XOTM3MDMzOTY0.html?from=s1.8-1-1.2)