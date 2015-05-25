---
layout: default
title: angularjs初学笔记
comments: true
category: angularjs
---


## 前言

### 需求

在第一次尝试开发WEB应用的时候，由于缺乏经验，同时任务时间紧迫，边学习边开发，错过了angularjs这样一个优秀的MVC前端框架。
(当时甚至还不懂MVC事神马=.=)

后来第一次接触javascript, jquery学会了基本的javascript语法，并解除了jquery-modile, easyui等等优秀的框架，
大大减轻了前端开发的痛苦，但是无论使用什么框架，本质的对DOM的直接操作是避免不了的。于是出现了这样的情况：

* 1、开发时美工没有就位，因此我苦逼的即写后台，前端HTML, CSS, JS全由我一人承包。。。好不容易做出个模型来，美工过来了(尼玛=.=)
美工开发了一套界面，于是原来的`<ul>`列表变成了`<table>`; `<input>`变成了`<div>`。。。。等等
由于JS直接和DOM绑定了，因此界面DOM一变，脚本也得跟着改，又写循环脚本甚至得重写。十分麻烦。

* 2、很多页面的输入组件并没有很好的模块化，导致当很多页面都出现同样功能时候，这些代码得复制好几遍，修改的时候也得在好几个地方修改。有时候一不小心
忘记修改了某个地方就呵呵了。。。。

由上可以看出，即使是前端，逻辑与界面的解耦已经十分必要了。angularjs框架正好满足了这些需要。同时它的一些数据绑定特性也能帮助开发者减少很大一部分DOM和数据处理的代码。

为了便于实践，我打算开一个SpringMVC项目，实际做一个WEB应用出来。可能并不是一个有实际意义的网站，但是尽量能把我认为常用的angularjs特性展示出来。

项目地址：[augularjsPractice](https://github.com/WengShengyuan/angularjsPractice).边学习边尝试开发。

这篇日志也会随时更新，或者开辟新的专题博文。

### angularjs的特点

* 将应用逻辑与对DOM的操作解耦。这会提高代码的可测试性。

* Angular遵循软件工程的MVC模式,并鼓励展现，数据，和逻辑组件之间的松耦合.通过依赖注入（dependency injection），Angular为客户端的Web应用带来了传统服务端的服务，例如独立于视图的控制。 

* 双向数据绑定.

## 入门

### 在WEB中引入AngularJs

最简单的页面如下：

```HTML

<!DOCTYPE HTML>
<html>
	<head>
		<title>测试页 </title>
		<meta charset="utf-8">
		<script src="http://www.hubwiz.com/scripts/angular.min.js"></script>
	</head>
	<body>
		<div ng-app="" ng-init="name='World'">
		   Hello {{ name }}！
		</div>	
	</body>
</html>

```

必要步骤:

* 1、标注AngularJs处理的区域，加上`ng-app`

* 2、引入angularjs包`http://code.angularjs.org/angular-1.0.1.min.js`

页面处理流程：

* 1、载入HTML，JS

* 2、js脚本寻找到`ng-app`便签，启动AngularJs进行编译与处理。

### 数据绑定特性

AngularJs的数据绑定特性， 减少了大量DOM与数据源的处理代码，十分方便。DOM和数据源(scope)中任意一方数据改变，均可以使另一方跟着变化。

#### 方法1：`ng-model  + {{"{{}}"}} `

```HTML

<!DOCTYPE HTML>
<html>
	<head>
		<title> 测试页 </title>
		<meta charset="utf-8">
		<script src="http://www.hubwiz.com/scripts/angular.min.js"></script>
	</head>
	<body>
		<div ng-app="">
	  		<p>请输入任意值：<input type="text" ng-model="name"></p>
	  		<p>你输入的为： {{ name }}</p>
		</div>
	</body>
</html>

```

#### 方法2：`ng-model + ng-bind`

效果与方法1相同，但是后者是渲染过后呈现，免去了源代码被看到的风险。

```HTML

<!DOCTYPE HTML>
<html>
	<head>
		<title> 测试页 </title>
		<meta charset="utf-8">
		<script src="http://www.hubwiz.com/scripts/angular.min.js"></script>
	</head>
	<body>
		<div ng-app="">
		   <p>请输入一个名字：<input type="text" ng-model="name"></p>
		   <p>Hello <span ng-bind="name"></span></p>
		</div>
	</body>
</html>

```

## 学习参考

[AngularJs中文网](http://www.apjs.net/)

[AngularJs实战](http://www.imooc.com/learn/156)

[AngularJs中文社区](http://angularjs.cn/T008)

[汇智网自学教程](http://www.hubwiz.com/coursecenter)