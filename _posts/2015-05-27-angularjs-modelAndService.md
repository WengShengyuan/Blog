---
layout: default
title: 如何模块化引入service
comments: true
category: angularjs
---




模块中声明provider

在引用的外部函数中注入

声明如下：

```javascript

/**
* 注意:
* 第一步必须先声明模块moduel
*/
angular.module("ezstuff",[])
	.provider("ezCalculator",function(){
		this.$get = function(){
			return {
				add : function(a,b){return a+b;},
				subtract : function(a,b){return a-b;},
				multiply : function(a,b){return a*b;},
				divide: function(a,b){return a/b;}
			}
		};
	})

```

外部函数注入如下

```javascript

var injector = angular.injector(["ezstuff"]),
		mycalculator = injector.get("ezCalculator"),
		ret = mycalculator.add(3,4);
		
		console.log('result: '+ ret);

```

同时，前台页面仅需要引入angularjs包即可。

```HTML

<html>
<head>
	<script src="http://lib.sinaapp.com/js/angular.js/angular-1.2.19/angular.min.js"></script>
</head>
<body>
	<button onclick="doCalc();">3+4=?</button>
	<div id="result"></div>
</body>
</html>

```