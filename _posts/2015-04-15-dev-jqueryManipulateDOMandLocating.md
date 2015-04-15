---
layout: default
title: jquery的DOM遍历以及元素定位
comments: true
category: javascript
---


适用于在

```HTML
	
	<ul>
		<li>
			<input></input>
			<p class = "pclass"></p>
			<a id="a"></a>
		</li>
		
		<li>
			<input></input>
			<p class = "pclass"></p>
			<a id="a"></a>
		</li>
	</ul>

```

的场合进行遍历，并找到其中的元素。

```javascript

	//注意这里的.each 效率的问题，如果可以用for最好

	$("li").each(function(i, item){
		
		var inputObj = $(item).children("input");
		var pObj = $(item).children(".pclass");
		var aObj = $(item).children("#a");
	
		//注意.children() 仅找下一级元素。
			.find() 可以跨级查找。
	
	});

```


参考来源 : <a href="http://www.cnblogs.com/qiuyan/archive/2012/11/01/2749754.html">Jquery中children、find区别</a>