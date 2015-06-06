---
layout: default
title: controller与scope的关系
comments: true
category: angularjs
---


* 声明一个controller即创建一个scope对象

ng-app指令导致$rootScope对象的创建

div元素通过ng-controller指令定义了一个新的scope对象，这个对象的原型是$rootScope。

如图所示：

![scope]({{site.baseurl}}/images/post_images/2015-05-27-angularjs-scopeAndController/scope.png)