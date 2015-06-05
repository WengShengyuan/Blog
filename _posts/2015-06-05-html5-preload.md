---
layout: default
title: H5+App的页面预载优化
comments: true
category: HTML5+
---



一般移动App的页面形式为：导航栏加页面(Tab+View)形式，或者菜单加内容(Menu+Content)形式，主要特点就是，可以由很少的几个模板页面组成
辅助Ajax动态填充页面内容即可.因此，为页面载入、切换优化提供了可能。

H5+App以WebView方式呈现内容。为加速页面切换速度，可以将页面拆分成不同的WebView进行预加载，在需要的时候直接展示出来。

一般的实现可以参考： Hello Mui、   Hello 5+ 这两个App。对子页面的使用和预加载均有体现。特别是是Hello Mui，官方有其预加载
方式的说明文档。

## 载入

将需要预载入的页面放进WebView中，如tab页的几个主页面。

```javascript

	//预载入
	var preloadPage = mui.preload({
		url : URL,
		id : ID,
		styles : {},
		extras : {}
		
	});
	
	//显示
	preloadPage.show();

```

## 主页启动直接预载

在mui.init函数中声明

```javascript

mui.init({

	preloadPages:[
	    {
	      url:prelaod-page-url,
	      id:preload-page-id,
	      styles:{},//窗口参数
	      extras:{},//自定义扩展参数
	      subpages:[]//预加载页面的子页面
	    }
	]
	
});

```

## 延迟载入

如果需要展示的页面与用户操作相关，则可以采取延迟载入的策略(Hello Mui)就是这种策略。即：第二页面分为两个WebView。底层页面模板先用预载方式
载入，在用户点击后立即显示，具体的页面在通过子WebView载入。这样可以使用户感觉操作的延迟降低。