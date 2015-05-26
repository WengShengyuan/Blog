---
layout: default
title: service与controller注入
comments: true
category: angularjs
---



相关项目:[AngularJsPractice](https://github.com/WengShengyuan/angularjsPractice)

对于angularjs的MVC结构主要依赖注入。下文已controller以及service注入为例说明。

代码中的$scope, $http本身也是注入形式引入的。它们是AngularJs自身封装的对象。

## controller

相比于网上常常看到的教程，新版AngularJs(1.3.x)以后对于controller声明有一些限制。

```javascript

function IndexController($scope) {
	//controller code
}

```

这种方法已经不允许，取而代之的是如下声明方法：

```javascript

//声明模块
var indexApp = angular.module('indexApp', []);

// 声明controller
indexApp.controller('IndexController', function($scope, listService) {
	//controller code
}

```

大致流程：

* 1、声明模块(module)。

* 2、声明controller(注入)。

* 3、声明数据、函数。

## service的注入与使用

对service的合理利用可以实现前台数据与页面(model and view)的分离，进而可以实现js代码的充分复用，不需要专门写DOM处理的脚本。因此前期设计`<ul>`后期突然
编程`<table>`的蛋疼情形就无需担心了。

使用一个简单例子：

前台有个<ul>列表绑定$scope中的list，现声明一个service实现对list的新增操作。

### 1、前台绑定

```HTML

<ul>
	<li ng-repeat="item in list">hello `{{item.name}}` you are \{\{item.gender}} and \{\{item.age}} years old</li>
</ul>

```

### 2、声明service

```javascript

//声明模块
var indexApp = angular.module('indexApp', []);

// 声明service
indexApp.service('listService', function() {
	this.addOneRecord = function(list) {
		console.log(list);
		var one = eval("[{name:'new',gender:'male',age:1}]");
		console.log(one);
		list.push(one[0]);
		console.log('after:' + list);
	};
});

```

### 3、将service注入controller

```javascript

// 声明controller
indexApp.controller('IndexController', function($scope, listService){
	//controller code
}

```


### 4、对service调用

```javascript

//声明了一个函数来调用service
$scope.addOneServiceTrigger = function() {
		console.log($scope);
		listService.addOneRecord($scope.list);
};

```

调用方法如上所示。

## 将service模块化

将某些特定功能的service集合归纳集中入一个js文件中，作为模块引入。（待完成。）