---
layout: default
title: Dcloud开发套件初学
comments: true
category: HTML5+
---

## 组件介绍

Dcloud HTML5+App开发套件分为三个部分： HBuilderIDE， 5+App， MUI框架三个部分。

### HBuilder

HBuilder为基于Eclipse改造的专为HTML开发工作提供的IDE，其优点在于：

* 更方便的与手机设备实时调试
* 与HTML,MUI深度集成
* 集成代码块自动补全功能

### 5+APP

与HBuilder集成， 通过HBuilder包装的APP框架。实现纯JS调用硬件API的特性。性能较Cordva更好。

### MUI

移动CSS框架，与大部分js框架不冲突。体积小，精简，运行效率高。
可以明显感觉比Ionic以及phoneGap、jQueryMobile快。

## 基本开发

### 文档

* [Dcloud文档](http://ask.dcloud.net.cn/docs#http://ask.dcloud.net.cn/article/93)

* [H5+硬件API](http://www.html5plus.org/doc/zh_cn/io.html)

* [MUI](http://dcloudio.github.io/mui/javascript/#plugin-offcanvas)

### HBuilder开发基本步骤

#### 1、新建项目

选择APP项目即可，项目结构很明了，不做详细说明。

#### 2、新建页面

若需要带上MUI特性，就新建MUI页面即可，会自动引入包与样式。

其中一些特殊代码需要重视：

```HTML

<!-- MUI页面初始化 -->
<script>
	mui.init();
</script>

<!-- MUI页面载入完毕的触发函数 -->
<script>
	document.addEventListener('plusready',plusReady,false);
	  	function plusReady(){
			
			// Android处理返回键
			plus.key.addEventListener('backbutton',function(){
				if(confirm('确认退出？')){
					plus.runtime.quit();
				}
			},false);
		}
</script>

```

#### 3、调试

安卓只需选择 ‘运行 -> 手机运行 -> 在xxxx设备上运行’ 既可。是所见即得的方式，十分方便迅速。*有时候出现即时刷新无效的情况，可以关闭程序后再打开*

#### 4、打包

支持安卓IOS的云端以及本地打包，待研究。

### 特性

#### 1、页面结构

对于一般APP形式（上下栏固定，中间为显示内容）可以使用一个单一页面加子页面的形式。如下：

![]({{site.baseurl}}/images/post_images/2015-06-03-html5-HTML5AppDevelop/subpage.jpg)

子页面在mui.init()时载入

```javascript

		mui.init({
		    subpages:[{
		      url:homeUrl,//子页面HTML地址，支持本地地址和网络地址
		      id:'home',//子页面标志
		      styles:{
		        top:'9%',//子页面顶部位置
		        bottom:'10%',//子页面底部位置
		        render:'onscreen'
//				width:100%//子页面宽度，默认为100%
			//height:subpage-height,//子页面高度，默认为100%
			
		      },
		      extras:{}//额外扩展参数
		    }]
      	});

```

这样中间的子页面有单独的webView资源，因此性能较高。

####　2、页面跳转

页面跳转有两种方式，本质都是一样的。

* 1、利用样板项目中common.js的clicked函数

```javascript

//使用
clicked('actionpage/barcode_scan.html',true,true);


//函数源码
/**
 * 打开新窗口
 * @param {URIString} id : 要打开页面url
 * @param {boolean} wa : 是否显示等待框
 * @param {boolean} ns : 是否不自动显示
 */
w.clicked=function(id,wa,ns){
	if(openw){//避免多次打开同一个页面
		return null;
	}
	if(w.plus){
		wa&&(waiting=plus.nativeUI.showWaiting());
		var pre='';
		openw=plus.webview.create(pre+id,id,{scrollIndicator:'none',scalable:false});
		ns||openw.addEventListener('loaded',function(){//页面加载完成后才显示
//		setTimeout(function(){//延后显示可避免低端机上动画时白屏
			openw.show(as);
			closeWaiting();
//		},200);
		},false);
		openw.addEventListener('close',function(){//页面关闭后可再次打开
			openw=null;
		},false);
		return openw;
	}else{
		w.open(id);
	}
	return null;
};

```

* 2、自己封装页面跳转函数

即利用mui.openWindow()函数

```javascript

		function loadPage(targeturl){
      		mui.openWindow({
			    url:targeturl,
			    id:targeturl,
			    styles:{
			      top:'9%',//新页面顶部位置
			      bottom:'10%',//新页面底部位置
			      width:'100%'//新页面宽度，默认为100%
//			      height:newpage-height,//新页面高度，默认为100%
			    },
			    extras:{
			    },
			    show:{
			      autoShow:true,//页面loaded事件发生后自动显示，默认为true
			      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
			      duration:200//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
			    },
			    waiting:{
			      autoShow:true,//自动显示等待框，默认为true
			      title:'正在加载...',//等待对话框上显示的提示内容
			      options:{
//			        width:waiting-dialog-widht,//等待框背景区域宽度，默认根据内容自动计算合适宽度
//			        height:waiting-dialog-height,//等待框背景区域高度，默认根据内容自动计算合适高度
			      }
			    }
			})
      	}

```


#### 3、页面跳转的优化

推荐阅读:[DCloud文档](http://ask.dcloud.net.cn/docs/) 左侧目录下的“提升HTML5的性能体验系列”

