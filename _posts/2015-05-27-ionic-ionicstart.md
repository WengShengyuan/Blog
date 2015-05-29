---
layout: default
title: ionic框架学习
comments: true
category: ionic
---


该博文的实际练习项目请见： [ionicApp](https://github.com/WengShengyuan/ionicApp) 


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

这里以camera, barcodescanner为例。

*注意！：如果是想拷贝项目文件夹出来另外导入android工程进行开发的话，最好在真正开始开发前就引用好插件，因为引用插件会对java, js,配置文件等进行多处修改，所以不建议中途增加插件。除非用node.js直接在工作工程目录中自动添加插件*

命令行方式添加插件：

`cordova plugin add cordova-plugin-camera`

`cordova plugin add https://github.com/wildabeast/BarcodeScanner.git`

*附：barcodescanner 插件通过Git下载，需要系统中有git插件*

Git的安装步骤如下:

1. `npm install -g git`

2. 安装Git软件， 并设置PATH环境变量 `C://Program Files//Git//bin` (假设)

## 开发

### 原始项目结构

如下图所示：

![folder]({{site.baseurl}}/images/post_images/2015-05-27-ionic-ionicstart/folder.jpg)

其中：

* src/com（org） 下边是java相关原声Android代码（Activity，以及插件的配合Activity），无需自己写，node.js自动导入。

* assets/www 文件夹下是本地WEB工程（已加入cordova特性），因此不能直接用来作为WEB服务。

* assets/www/lib 文件夹用于存放公共库文件，ionic为自动加入；ng-cordova为后期导入(注意：ng-cordova的引用应该在cordova之前)。

* assets/www/templates 文件夹用于存放html页面片段

### 关键js脚本

#### 1、app.js

整个APP的主模块，其余的controller, services模块在这里注入。同时，该模块声明了前端路由。


#### 2、controllers.js 以及  services.js

可以自行声明，并根据后期模块的增加继续拆封。合理的声明与设计controllers, services的代码是AngularJs 作为MVC框架的精髓。写得好的话可以极大的精简代码以及实现更好的代码复用。


## 常用插件以及注意事项

### camera

`cordova plugin add cordova-plugin-camera`

[plugins/camera](ngcordova.com/docs/plugins/camera)


### barcode

`cordova plugin add https://github.com/wildabeast/BarcodeScanner.git`

[plugins/barcode scanner](ngcordova.com/docs/plugins/barcodeScanner)

*注意需要配置Git*

### Dialogs

`cordova plugin add cordova-plugin-dialogs`

[plugins/Dialogs](ngcordova.com/docs/plugins/dialogs)

*注意，打包成服务使用有问题，会跳过询问窗口，直接执行下一条语句。因此目前先直接在需要用的地方调用$cordovaDialogs比较好*

### file

`cordova plugin add cordova-plugin-file`

*注意一些常用的常数*

1. 错误代码: cordova-plugin-file / www / android / FileErrors.js

2. 文件位置: cordova-plugin-file / www / android / fileSystemPaths.js(一般使用外置存储中对应APP目录下的data文件夹比较好.*externalDataDirectory* 对应目录/sdcard/Android/appName/files)


## 参考资料

[ionic doc](http://www.ionicframework.com/docs/) <- 官方

[ionic 中文社区](http://ionichina.com/) 

[ionic优酷视频教程实例](http://v.youku.com/v_show/id_XOTM3MDMzOTY0.html?from=s1.8-1-1.2)