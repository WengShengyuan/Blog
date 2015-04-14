---
layout: default
title: javascript以及衍生框架自学笔记
comments: true
category: javascript
---


开发遇到的一些小记录，基础知识写的可能不全。

# javascript 入门

## 变态的函数声明

### 方法1

```javascript

	function functionName(parameters) {
		doSomething;
	}

```

### 方法2

```javascript

	var x = function (a, b) {return a * b};
	var z = x(4, 3);

```

### 方法3

```javascript

	(function () {
    	var x = "Hello!!";      // 我将调用自己
	})();

```

### 方法4

```javascript

	var myObject = {
	    firstName:"John",
	    lastName: "Doe",
	    fullName: function () {
	        return this.firstName + " " + this.lastName;
	    }
	}
	myObject.fullName();         // 返回 "John Doe"

```

## 使用心得

### 构造函数

```javascript

	// 构造函数:
	function myFunction(arg1, arg2) {
	    this.firstName = arg1;
	    this.lastName  = arg2;
	}
	
	// This creates a new object
	var x = new myFunction("John","Doe");
	x.firstName; 

```

### 操作cookie

* 调用jquery 的 $.cookie

1 - 引入jquery.cookie.js<br>

使用方式如下：<br>

首先引入jquery.cookie.js

```HTML

<script src = "../js/jquery.cookie.js"></script>

```

在`javascript`中使用

```javascript

	//读取
	var value = $.cookie('key');
	
	//写入
	$.cookie('key', 'value', { expires: 7, path: '/' });

```

* 直接实现

```javascript

	function setCookie(name, value, expires, path, domain) {
		if (!expires) expires = -1;
		if (!path) path = "/";
		var d = "" + name + "=" + value;
		var e;
		if (expires < 0) {
	    	e = "";
		}
		else if (expires == 0) {
	   		var f = new Date(1970, 1, 1);
	    	e = ";expires=" + f.toUTCString();
		}
		else {
	    	var now = new Date();
	    	var f = new Date(now.getTime() + expires * 1000);
	    	e = ";expires=" + f.toUTCString();
		}
		var dm;
		if (!domain) {
	    	dm = "";
		}
		else {
	    	dm = ";domain=" + domain;
		}
		document.cookie = name + "=" + value + ";path=" + path + e + dm;
	}
	
	
	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
	    	var c = ca[i];
	    	while (c.charAt(0) == ' ') c = c.substring(1, c.length);
	    		if (c.indexOf(nameEQ) == 0) {
	       			return decodeURIComponent(c.substring(nameEQ.length, c.length))
	    		}
			} 
		return null
	}
	

```

### cookie 读取与保存 Object

* 带完善

### 搜索DOM

* id

	* $("#id") <strong>jquery的搜索方式</strong>
	
	* document.getElementById("demo") <strong>该方法直接调用javascript，速度更快</strong>
	
* 待补充。。。。

### 循环

* jquery 比较方便

```javascript 

	$.each(list, function(i, item){
		doSomething;
	})

```

### ajax

<a href="http://www.w3school.com.cn/jquery/ajax_ajax.asp">W3School教程<a>

* jquery 比较防弊[待补充]

```javascript

	$.ajax(){
	
		type: "POST",
        url: "api/getdata",
        timeout : 2000,
        data: {	param1 : value1, 
        		param2 : value2
        		},
        success: function(data){
        
        	console.log(data);
		},
		error: function(){
			console.log("fail");
		}
	}

```


# jquery-mobile

## api

<a href = "http://api.jquerymobile.com/">API</a>

## 页面载入特性

在jqeury-mobile框架中进行页面跳转时候出现第二页面的js脚本不执行的情况。

* 特性与解决

卸载jquery-mobile页面的<head>中的js引用只会在打开第一个页面时候载入，之后的页面跳转仅载入<page>内的内容，所以第二页面的<head>实际没有起作用。<br>
解决方式:<br>
在第二页需要继续引入的包放在<page>中。

# bootstrap

## 可视化构建

页面框架构建臂jquery-mobile方便。有可视化构建工具<br>
<a href="http://www.layoutit.com/">layoutIt!</a>

# 提高javascript性能的技巧

## 待补充



