---
layout: default
title: easyui的datagrid使用以及分页
comments: true
category: easyui
---


easyui对于开发桌面级的WEB应用界面确实十分方便，而且美观。这里着重记录一下datagrid的使用，以及通过前后端配合实现的超简单的数据分页查询方式。

easyui支持直接从后端获取json串并解析成数据。不需要手动处理。十分方便。

## 前端

### 对列的声明

用于声明每列的属性

```javascript

	var columns = [[
	{
		field : 'fieldToBind',
		width : 100,
		title : 'titleInColumn',
		formatter :
			function(value, row, index){
				//这里根据每列的数据进行处理，返回的串即单元格中显示的内容。也可以拼html来编程<a> 或者<button> 等样式
				return row.title;
			}
	},
	{
		field:....
		....
	}
	
	]]

```

### datagrid生成

这里正是初始化并生成表格。

首先html页面中应预留位置

```HTML

	<div class:"easyui-layout" data-option="fit:true">
		<div data-option:"region:'center'">
			<table id="table" toolbar="#earchbar"></table>
		</div>
	</div>

```

直接调用datagrid比较麻烦，因此做一个包装js

```javascript

	$(function (){
	
	 	var url;
	 	var param;
	 	var tableid;
	 	var initPageSize=10; 
	 	var initPageNum=1;
	 	var singleSelect;
	 	/*参数说明
	 	 *arg.initPageNum :起始页数,当initPageNum=""时，取默认值initPageNum=1
	 	 *arg.initPageSize:每页的初始行数，如果initPageSize="",则取默认值 initPageSize=10
	 	 *arg.url     :查询的url，不带参数
	 	 *arg.param   :参数串deviceCode=deviceCode&deviceType=deviceType
	 	 *arg.tableid :表格的id，如表格的id="tbquery",则arg.tableid="#tbquery"
	 	 *arg.toolbarid :工具栏的id，如表格的id="toolbar",则arg.toolbarid="#toolbar"
	 	 * */
	  	$.WifiPage = function (arg) {
	  		 //初始化页面
	         this.init = function () {     //this.init方法，加上了this，就是公有方法了，外部可以访问。
	             
	        	url = arg.url;
	        	param = arg.param;
	        	tableid=arg.tableid;
	        	
	        	if(arg.singleSelect!=undefined){
	        		singleSelect = false;
 				}else{
 					singleSelect = true;
 				}
	        	
	           //初始化页面查询数据
	        	if(arg.initPageSize=="")
	        		arg.initPageSize=initPageSize;
	        	if(arg.initPageNum=="")
	        		arg.initPageNum=initPageNum;
	        	requestDataInPagination(initPageNum,arg.initPageSize,arg.url,arg.param,arg.tableid);
	             
	           //构建表格所有属性
	     	  	$(arg.tableid).datagrid({
	     	  	 toolbar:arg.toolbarid,
	     	  	 singleSelect : singleSelect,
				 collapsible : true,
				 fitColumns : true,
				 fit:true,
				 remoteSort : false,
				 nowrap : false,
				 striped : true,
				 pagination: true,
				 //rownumbers:true,
	     		 method:'get',
	     		 loadMsg:'数据努力加载中...',
	     		 pageSize: arg.initPageSize,
	     		 pageList: [arg.initPageSize, arg.initPageSize*2, arg.initPageSize*4],
	     		 columns : arg.columns,
	     		 height:  "100%",
	     	     width:  "100%",
		     	    onSelect:function (rowIndex, rowData){ //用户选择一行的时候触发
	     				if(arg.onSelect!=undefined){
	     					onSelect(rowIndex,rowData);
	     				}
	     			},
	     			onUnselect:function (rowIndex, rowData){ //用户取消选择一行的时候触发
	     				if(arg.onUnselect!=undefined){
	     					onUnselect(rowIndex,rowData);
	     				}
	     			},
	     			onSelectAll:function (rows){ //在用户选择所有行的时候触发
	     				if(arg.onSelectAll!=undefined){
	     					onSelectAll(rows);
	     				}
	     			},
	     			onUnselectAll:function (rows){//在用户取消选择所有行的时候触发
	     				if(arg.onUnselectAll!=undefined){
	     					onUnselectAll(rows);
	     				}
	     			},
	     			onCheck:function (rowIndex, rowData){ //用户选择一行的时候触发
	     				if(arg.onCheck!=undefined){
	     					onCheck(rowIndex,rowData);
	     				}
	     			},
	     			onUncheck:function(rowIndex, rowData){
	     				if(arg.onUncheck!=undefined){
	     					onUncheck(rowIndex, rowData);
	     				}
	     			},
	     			onLoadSuccess:function(data){ 
	     				if(arg.onLoadSuccess!=undefined){
	     					onLoadSuccess(data);
	     				}
	     			} 
	     	  	});
	         };
	         
	         this.requestDataInPagination = function(){
	        	 requestDataInPagination(arg.initPageNum,arg.initPageSize,arg.url,arg.param);
	         };
	         this.requestData = function(newpageNum,newpageSize,newurl,newparam,newtableid){
	        	 requestData(newpageNum,newpageSize,newurl,newparam,newtableid);
	         };
	         
	        
	    };
	    
	  	
	  	//分页方法
	  	function pagerFilter(data) {

			if (typeof data.length == 'number' && typeof data.splice == 'function') { // is array
				data = {
					total: data.length,
					rows: data
				};
			}
			var dg = $(this);
			var opts = dg.datagrid('options');
			var pager = dg.datagrid('getPager');
			var currNum = opts.pageNumber;
			var currSize = opts.pageSize;
			if (currNum>1&&data.rows.length==0)
				requestDataInPagination(currNum-1,currSize,url,param);
//				pager.pagination('select',currNum-1);

			pager.pagination({
				showRefresh: false,
				beforePageText: '第', //页数文本框前显示的汉字  
				afterPageText: '页    共 {pages} 页',
				displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
				onSelectPage: function(pageNum, pageSize) {
					
//					var currSize=dg.datagrid("getRows").length;//当前分页记录数
//					if (currSize==1)
//						pageNum-=1;
					if(pageNum<=0)
						pageNum=1;
					
					requestDataInPagination(pageNum,pageSize,url,param);
					opts.pageNumber = pageNum;
					opts.pageSize = pageSize;
					pager.pagination('refresh', {
						pageNumber: pageNum,
						pageSize: pageSize
					});
					
				}
			});
		
			
			if (data.d){
				return data.d;
			} else {
				return data;
			}
			
		}
	  	
	  	
	  	//分页控件以及页面初始化时获取请求数据
	  	function requestDataInPagination(pageNum,pageSize,url,param) {
				
		        var baseData;
		        if(pageSize=="")
		        	pageSize=initPageSize;
				var paramVar = "pageNum="+pageNum+"&pageSize="+pageSize;
				if(param!=""){
					paramVar =  param+"&pageNum="+pageNum+"&pageSize="+pageSize;
				}
				else{
					paramVar = "pageNum="+pageNum+"&pageSize="+pageSize;
				}
				
				 $.post(url, paramVar,function(data) {
					 if(url=="")
						 data = new Array();
					 $(tableid).datagrid({  
							loadFilter: pagerFilter
						}).datagrid("loadData",data);  
				         });


		}
	  //点击查询按钮根据页面指定查询条件查询时，调用此函数
	  //默认单页行数：newpageSize==""时，此值等于全局变量initPageSize=10
	  //默认起始页数：newpageNum==""时，此值等于全局变量initPageNum=1
	  /*	function requestData(newpageNum,newpageSize,newurl,newparam) {
			
	        var baseData;
	        url = newurl;
        	param = newparam;
        	var dg = $(tableid);
//			var pager = dg.datagrid('getPager');

//			pager.pagination('select', 1);
			if(newpageSize=="")
				newpageSize=initPageSize;
			if(newpageNum=="")
				newpageNum=initPageNum;
			requestDataInPagination(newpageNum,newpageSize,newurl,newparam);
			var opts = dg.datagrid('options');
			
			opts.pageNumber = newpageNum;
			opts.pageSize = newpageSize;
			
	}*/
    
	  //点击查询按钮根据页面指定查询条件查询时，调用此函数
		  //默认单页行数：newpageSize==""时，此值等于全局变量initPageSize=10
		  //默认起始页数：newpageNum==""时，此值等于全局变量initPageNum=1
		  	function requestData(newpageNum,newpageSize,newurl,newparam,newtableid) {
				
		        var baseData;
		        url = newurl;
	        	param = newparam;
	        	if(newtableid!=undefined)
	        	tableid=newtableid;
	        	var dg = $(tableid);
//				var pager = dg.datagrid('getPager');

//				pager.pagination('select', 1);
				if(newpageSize=="")
					newpageSize=initPageSize;
				if(newpageNum=="")
					newpageNum=initPageNum;
				requestDataInPagination(newpageNum,newpageSize,newurl,newparam);
				var opts = dg.datagrid('options');
				
				opts.pageNumber = newpageNum;
				opts.pageSize = newpageSize;
				
		}
	 });

$(function (){
	
	 	var url;
	 	var param;
	 	var tableid;
	 	var initPageSize=10; 
	 	var initPageNum=1;
	 	var singleSelect;
	 	/*参数说明
	 	 *arg.initPageNum :起始页数,当initPageNum=""时，取默认值initPageNum=1
	 	 *arg.initPageSize:每页的初始行数，如果initPageSize="",则取默认值 initPageSize=10
	 	 *arg.url     :查询的url，不带参数
	 	 *arg.param   :参数串deviceCode=deviceCode&deviceType=deviceType
	 	 *arg.tableid :表格的id，如表格的id="tbquery",则arg.tableid="#tbquery"
	 	 *arg.toolbarid :工具栏的id，如表格的id="toolbar",则arg.toolbarid="#toolbar"
	 	 * */
	  	$.WifiPage = function (arg) {
	  		 //初始化页面
	         this.init = function () {     //this.init方法，加上了this，就是公有方法了，外部可以访问。
	             
	        	url = arg.url;
	        	param = arg.param;
	        	tableid=arg.tableid;
	        	
	        	if(arg.singleSelect!=undefined){
	        		singleSelect = false;
 				}else{
 					singleSelect = true;
 				}
	        	
	           //初始化页面查询数据
	        	if(arg.initPageSize=="")
	        		arg.initPageSize=initPageSize;
	        	if(arg.initPageNum=="")
	        		arg.initPageNum=initPageNum;
	        	requestDataInPagination(initPageNum,arg.initPageSize,arg.url,arg.param,arg.tableid);
	             
	           //构建表格所有属性
	     	  	$(arg.tableid).datagrid({
	     	  	 toolbar:arg.toolbarid,
	     	  	 singleSelect : singleSelect,
				 collapsible : true,
				 fitColumns : true,
				 fit:true,
				 remoteSort : false,
				 nowrap : false,
				 striped : true,
				 pagination: true,
				 //rownumbers:true,
	     		 method:'get',
	     		 loadMsg:'数据努力加载中...',
	     		 pageSize: arg.initPageSize,
	     		 pageList: [arg.initPageSize, arg.initPageSize*2, arg.initPageSize*4],
	     		 columns : arg.columns,
	     		 height:  "100%",
	     	     width:  "100%",
		     	    onSelect:function (rowIndex, rowData){ //用户选择一行的时候触发
	     				if(arg.onSelect!=undefined){
	     					onSelect(rowIndex,rowData);
	     				}
	     			},
	     			onUnselect:function (rowIndex, rowData){ //用户取消选择一行的时候触发
	     				if(arg.onUnselect!=undefined){
	     					onUnselect(rowIndex,rowData);
	     				}
	     			},
	     			onSelectAll:function (rows){ //在用户选择所有行的时候触发
	     				if(arg.onSelectAll!=undefined){
	     					onSelectAll(rows);
	     				}
	     			},
	     			onUnselectAll:function (rows){//在用户取消选择所有行的时候触发
	     				if(arg.onUnselectAll!=undefined){
	     					onUnselectAll(rows);
	     				}
	     			},
	     			onCheck:function (rowIndex, rowData){ //用户选择一行的时候触发
	     				if(arg.onCheck!=undefined){
	     					onCheck(rowIndex,rowData);
	     				}
	     			},
	     			onUncheck:function(rowIndex, rowData){
	     				if(arg.onUncheck!=undefined){
	     					onUncheck(rowIndex, rowData);
	     				}
	     			},
	     			onLoadSuccess:function(data){ 
	     				if(arg.onLoadSuccess!=undefined){
	     					onLoadSuccess(data);
	     				}
	     			} 
	     	  	});
	         };
	         
	         this.requestDataInPagination = function(){
	        	 requestDataInPagination(arg.initPageNum,arg.initPageSize,arg.url,arg.param);
	         };
	         this.requestData = function(newpageNum,newpageSize,newurl,newparam,newtableid){
	        	 requestData(newpageNum,newpageSize,newurl,newparam,newtableid);
	         };
	         
	        
	    };
	    
	  	
	  	//分页方法
	  	function pagerFilter(data) {

			if (typeof data.length == 'number' && typeof data.splice == 'function') { // is array
				data = {
					total: data.length,
					rows: data
				};
			}
			var dg = $(this);
			var opts = dg.datagrid('options');
			var pager = dg.datagrid('getPager');
			var currNum = opts.pageNumber;
			var currSize = opts.pageSize;
			if (currNum>1&&data.rows.length==0)
				requestDataInPagination(currNum-1,currSize,url,param);
//				pager.pagination('select',currNum-1);

			pager.pagination({
				showRefresh: false,
				beforePageText: '第', //页数文本框前显示的汉字  
				afterPageText: '页    共 {pages} 页',
				displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
				onSelectPage: function(pageNum, pageSize) {
					
//					var currSize=dg.datagrid("getRows").length;//当前分页记录数
//					if (currSize==1)
//						pageNum-=1;
					if(pageNum<=0)
						pageNum=1;
					
					requestDataInPagination(pageNum,pageSize,url,param);
					opts.pageNumber = pageNum;
					opts.pageSize = pageSize;
					pager.pagination('refresh', {
						pageNumber: pageNum,
						pageSize: pageSize
					});
					
				}
			});
		
			
			if (data.d){
				return data.d;
			} else {
				return data;
			}
			
		}
	  	
	  	
	  	//分页控件以及页面初始化时获取请求数据
	  	function requestDataInPagination(pageNum,pageSize,url,param) {
				
		        var baseData;
		        if(pageSize=="")
		        	pageSize=initPageSize;
				var paramVar = "pageNum="+pageNum+"&pageSize="+pageSize;
				if(param!=""){
					paramVar =  param+"&pageNum="+pageNum+"&pageSize="+pageSize;
				}
				else{
					paramVar = "pageNum="+pageNum+"&pageSize="+pageSize;
				}
				
				 $.post(url, paramVar,function(data) {
					 if(url=="")
						 data = new Array();
					 $(tableid).datagrid({  
							loadFilter: pagerFilter
						}).datagrid("loadData",data);  
				         });


		}
	  //点击查询按钮根据页面指定查询条件查询时，调用此函数
	  //默认单页行数：newpageSize==""时，此值等于全局变量initPageSize=10
	  //默认起始页数：newpageNum==""时，此值等于全局变量initPageNum=1
	  /*	function requestData(newpageNum,newpageSize,newurl,newparam) {
			
	        var baseData;
	        url = newurl;
        	param = newparam;
        	var dg = $(tableid);
//			var pager = dg.datagrid('getPager');

//			pager.pagination('select', 1);
			if(newpageSize=="")
				newpageSize=initPageSize;
			if(newpageNum=="")
				newpageNum=initPageNum;
			requestDataInPagination(newpageNum,newpageSize,newurl,newparam);
			var opts = dg.datagrid('options');
			
			opts.pageNumber = newpageNum;
			opts.pageSize = newpageSize;
			
	}*/
    
	  //点击查询按钮根据页面指定查询条件查询时，调用此函数
		  //默认单页行数：newpageSize==""时，此值等于全局变量initPageSize=10
		  //默认起始页数：newpageNum==""时，此值等于全局变量initPageNum=1
		  	function requestData(newpageNum,newpageSize,newurl,newparam,newtableid) {
				
		        var baseData;
		        url = newurl;
	        	param = newparam;
	        	if(newtableid!=undefined)
	        	tableid=newtableid;
	        	var dg = $(tableid);
//				var pager = dg.datagrid('getPager');

//				pager.pagination('select', 1);
				if(newpageSize=="")
					newpageSize=initPageSize;
				if(newpageNum=="")
					newpageNum=initPageNum;
				requestDataInPagination(newpageNum,newpageSize,newurl,newparam);
				var opts = dg.datagrid('options');
				
				opts.pageNumber = newpageNum;
				opts.pageSize = newpageSize;
				
		}
	 });



```


具体的使用方式:

* 要引入上方的js

```javascript

page = new $.Wifipage({
	url:"/web/getSomething?arg="+arg,
	initPageNum:"",
	initPageSize:"",
	columns: columns,
	tableid:"#table",
	toolbarid:"#toolbar"
});

page.init();


```


## 后端

后端需要PageBean实体来配合。

```java

	public class PageBean {
	
	private String total; //数据总行数
	private String success; //返回获取状态
	private List rows; //返回结果
	private String totalPage;//总页数
	private String pageNow;//当前页
	private String pageSize;//每页多少条数据
	
	public String getPageSize() {
		return pageSize;
	}
	public void setPageSize(String pageSize) {
		this.pageSize = pageSize;
	}
	public String getPageNow() {
		return pageNow;
	}
	public void setPageNow(String pageNow) {
		this.pageNow = pageNow;
	}
	public String getTotalPage() {
		return totalPage;
	}
	public void setTotalPage(String totalPage) {
		this.totalPage = totalPage;
	}
	public String getTotal() {
		return total;
	}
	public void setTotal(String total) {
		this.total = total;
	}
	public String getSuccess() {
		return success;
	}
	public void setSuccess(String success) {
		this.success = success;
	}
	public List getRows() {
		return rows;
	}
	public void setRows(List rows) {
		this.rows = rows;
	}

}

```

使用时候：

```java

	PageBean page = new PageBean();
	List<T> list = service.getList();
	int resultCount = service.getResultCount();
	page.setTotal(resultCount);
	page.setRows(list);
	page.setSuccess("success");

```

