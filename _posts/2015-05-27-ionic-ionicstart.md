---
layout: default
title: ionic框架学习
comments: true
category: ionic
---


##安装ionic相关环境

### 1、安装node.js

进入[node.js官网](https://nodejs.org/) 找到相应的安装包安装。

配置环境变量：NODE_PATH 到 `~/nodejs/node_modules`

### 2、安装ionic 与 cordova

进入控制台，npm安装：

`npm install -g cordova ionic`

### 3、安装sass

命令行安装： 

`ionic setup sass`

### 4、下载模板生成工程

命令行安装： 

`ionic start myApp sidemenu`

进入目录

`cd myApp`

加入平台，android 或者 ios

`ionic platform add android`

此时platforms文件夹下多出对应平台的项目文件夹了。

另外www文件夹下有可以直接作为web使用的工程文件夹。直接放入tomcat就可以运行了。



## 参考资料

[ionic doc](http://www.ionicframework.com/docs/) <- 官方

[ionic 中文社区](http://ionichina.com/) 

[ionic优酷视频教程实例](http://v.youku.com/v_show/id_XOTM3MDMzOTY0.html?from=s1.8-1-1.2)