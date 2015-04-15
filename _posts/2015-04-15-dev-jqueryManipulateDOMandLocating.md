---
layout: default
title: jquery的DOM定位与操作
comments: true
category: javascript
---


## jquery对DOM的遍历，以及循环内定位

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

## jquery操作checkbox

* 注意：jquery新版本 `$("checkbox").attr("checked")` 不好用了。一律改用 `$("checkbox").prop("checked")`

获取checkbox值

```javascript

	var checked = $("checkbox").prop("checked");

```

为checkbox赋值

```javascript

	//选中
	$("checkbox").prop("checked", true);
	
	//撤销
	$("checkbox").prop("checked", false);

```