---
layout: default
title: 提高页面性能
comments: true
category: javascript
---


在一些移动设备或者在HybridApp中，有时候设备的javascript效率并不高，导致页面卡顿，体验下降。因此需要尽量优化javascript的执行效率。以下是一些搜集的经验。
另CSS也可以起到提高性能的作用。

## 使用最新版本的库

## 精简脚本

* 压缩自定义脚本
uglify等工具，去掉空行。减小js文件体积。

* 引入min脚本
如
 
```HTML

<script src = "jquery.min.js"></script>

```

## 尽量减少使用$.each()

可以改用

```javascript

	for (var i=0; i<array.length; i++) {
	    array[i] = 0;
	}

```

## DOM操作

* 尽量使用id，而不是class搜索。

* 多次使用的DOM元素要缓存起来。

```javascript

	var item = $('#item');
	item.css ('color', '#123456');
	item.html ('hello');
	item.css ('background-color', '#ffffff');

``` 


* 尽量少的DOM写入操作

```javascript

	//这样操作了1000次
	for (var i=0; i<1000; i++) {
    	var list = '<li>'+i+'</li>';
    	$('#list').append(list);
	}

	//这样比较快，只操作了一次
	for (var i=0; i<1000; i++) {
    	list += '<li>'+i+'</li>';
	}
	 
	$('#list').html (list);

```


## 函数执行

* return flase

放置函数向上冒泡。。。

```javascript

	//这样比较慢
	$('#item').click (function () {
	    // stuff here
	});
	
	//这样效率高
	$('#item').click (function () {
	    // stuff here
	    return false;
	});


```

## 利用CSS调用硬件加速

比如调用CSS3 的3D 接口。

```HTML

<style>
.page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
}

<style>

```




