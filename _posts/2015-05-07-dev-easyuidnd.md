---
layout: default
title: easyui的dnd插件实现datagrid行拖拽
comments: true
category: easyui
---


项目中出现一种需求：对某列表中元素进行手动排序，若使用按钮单击来向上或者向下效率低下，若直接手动输入序号更不科学=.=。

因此最好的方式就是能够实现手动拖动某个行到想要的位置。因此首先需要实现datagrid的拖拽操作。其次就是后端的数据处理了。

## dnd插件的实现

超简单。。。。引入datagrid-dnd.js，然后enable之即可。

```HTML

	<script src="./datagrid-dnd.js"></script>

```

```javascript

	//载入后的触发事件
	onLoadSuccess(data){
		//启用dnd支持
		$('#table').datagrid('enableDnd');
		
		//可选-绑定dnd的触发事件
		$('#table').datagrid({
			onDrop:function(targetRow, sourceRow, point) {
				//拖拽某行到指定位置后触发
				doSomething();
			}
		})
		
	}

```


## 前端数据的获取

主要涉及对datagrid的数据遍历，获取id以及序号

```javascript

 //获取表格的数据
 var data = $('#table').datagrid('getRows');
 //遍历每行
 $.each(data, function(i ,row){
 	doSomething(); 
 });
 

```