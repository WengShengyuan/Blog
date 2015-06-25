---
layout: default
title: Dcloud H5+ API调用实例
comments: true
category: HTML5+
---


项目参考[H5PlusApp](https://github.com/WengShengyuan/H5PlusApp)

由于API调用已经封装成工具js， 因此直接在这里贴出来，并附上使用方法

主要还是存储(Storage)、对话框(Dialogs)、相机二维码(barcode)为主。

## 存储

[key, value]结构，因此可以作为一些参数存储用，在应用程序退出后仍然保存。

```javascript

function muiSet(keyStr, valueStr){
	plus.storage.setItem(keyStr, valueStr);
}

function muiGet(keyStr) {
	return plus.storage.getItem(keyStr);
}

function muiRemove(keyStr){
	plus.storage.removeItem(keyStr);
}

function muiRemoveAll() {
	var length = getLength();
	for(var i=0; i<length; i++){
		var keyStr = plus.storage.key(i);
		plus.storage.removeItem(keyStr);
	}
}

function muiGetLength() {
	return plus.storage.getLength();
}

function muiGetKey(id){
	return plus.storage.key(id);
}


```

调用例子

```HTML

	<button class="mui-btn" onclick="muiSet('key','value')">set</button>
	<button class="mui-btn" onclick="muiRemove('key')">remove</button>
	<button class="mui-btn" onclick="console.log(muiGetLength())">getLength</button>
	
	<button class="mui-btn" onclick="showPrompt('输入查询key','Storage验证','key',function(e){
		console.log(muiGet(e))
		})">select</button>

```


## 对话框

调用原生对话框元素，用于交互界面，摆脱了麻烦的WEB方式对话框，速度快，风格也更为统一。

```javascript

var loadingWindow;
function toast(str) {
	plus.nativeUI.toast(str,{duration:"long"});
}
function showLoading(str) {
	loadingWindow = plus.nativeUI.showWaiting(str);
}

function closeLoading(){
	loadingWindow.close();
}

function showAlert(message, title, func) {
	plus.nativeUI.alert(message, func, title,'确认');
}

function showConfirm(message, title, confirmFunc, cancelFunc){
	var buttons=['确认','取消'];
	plus.nativeUI.confirm(message,function(e){
		var i = e.index;
		if(i>=0){
			if(i==0){
				//确认
				confirmFunc(); 
			} else {
				//取消
				cancelFunc();
			}
			
		} else {
			//后退键
			cancelFunc();
		}
	},title,buttons);
}
function showPrompt(message, title, placeholder, func) {
	var bts=["确认","取消"];
	plus.nativeUI.prompt(message,function(e){
		var i=e.index;
		if(i==0){
			func(e.value);
		}
	},title,placeholder,bts);
}


```

其中有一些方法可以将函数作为参数传入使用， 即可以自定义用户按下按钮后执行的操作，比如如下调用例子:

```HTML

	<button class="mui-btn" onclick="showAlert('message','title',function(){console.log('callback')});">alert</button>
	<button class="mui-btn" onclick="showLoading('loading...')">loading</button>
	<button class="mui-btn" onclick="toast('message')">toast</button>
	<button class="mui-btn" onclick="showConfirm('message','title',function(){console.log('confirm')}, function(){console.log('cancel')})">confirm</button>
	<button class="mui-btn" onclick="showPrompt('message','title','placeholder', function(e){console.log(e)})">prompt</button>

```


## 二维码

为了方便直接使用了样例(Hello H5+)的代码

主要是调用 common.js 中的 clicked 函数打开二维码扫描页面。
扫描页面中自动启动二维码扫描，并在识别成功后返回原页面。

在原页面中有一个scaned函数，用于处理扫码返回的结果。

代码详见：

* 扫描调用页面 [account.html](https://github.com/WengShengyuan/H5PlusApp/blob/master/pages/account.html)
* 扫描页面[barcode-scan.html](https://github.com/WengShengyuan/H5PlusApp/blob/master/pages/actionpage/barcode_scan.html)

