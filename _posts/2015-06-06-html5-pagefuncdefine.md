---
layout: default
title: H5+App的页面事件定义，以及页面传值
comments: true
category: HTML5+
---



## 预载入页面的WebView间传参以及事件触发

如在新闻类APP中，新闻列表是一个WebView，新闻详情页是另一个WebView。均预载完毕，用户点击列表某一条新闻，需要在详情页触发填充
新闻详情的事件，可以使用自定义事件的办法。

* 1、在详情页添加自定义事件

```javascript

//添加newId自定义事件监听
window.addEventListener('newsId',function(event){
  //获得事件参数
  var id = event.detail.id;
  //根据id向服务器请求新闻详情
});

```

* 2、列表页触发

```javascript

var detailPage = null;
//添加列表项的点击事件
mui('.mui-content').on('tap', 'a', function(e) {
  var id = this.getAttribute('id');
  //获得详情页面
  if(!detailPage){
    detailPage = plus.webview.getWebviewById('detail.html');
  }
  //触发详情页面的newsId事件
  mui.fire(detailPage,'newsId',{
    id:id
  });
//打开详情页面          
  mui.openWindow({
    id:'detail.html'
  });
});

```