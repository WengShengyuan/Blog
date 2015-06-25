---
layout: default
title: AngularJs的前端路由
comments: true
category: angularjs
---

该博文的实际练习项目请见：  [ionicApp](https://github.com/WengShengyuan/ionicApp) 

其中的 assets/www/app.js 中定义了路由。

部分代码片段如下：

```javascript


//声明模块
angular.module('starter', ['ionic','ngCordova','starter.controllers', 'starter.services'])


//在项目启动前的配置
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

//定义路由
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  })
  
  ;
  // 默认路由
  $urlRouterProvider.otherwise('/app/playlists');
});


```

实际使用

```HTML

	<ion-list>
      <ion-item ng-repeat="playlist in playlists" href="#/app/playlists/{{playlist.id}}">
        {{playlist.title}}
      </ion-item>
    </ion-list>

```

可以看到通过URL可以传递参数，参数在controller 中捕捉(需要注入$stateParams)

```javascript

.controller('PlaylistCtrl', function($scope, $stateParams) {

	console.log($stateParams.apiId);

})

```


路由可以看作一个总控制器，它会根据页面的不同状态来填充页面的内容，这就是路由的主要用处。前端路由能极大地减少对服务器资源的请求数量，因此在前端做路由显得尤为重要。

因此如果应用到HybridApp上，可以将部分页面资源放在本地， 服务器专门负责数据处理，减少服务器和带宽压力。

## 参考资料

[AngularJS路由介绍](http://blog.csdn.net/violet_day/article/details/16974467) - 简单直白

[路由与多视图](http://www.ituring.com.cn/article/15767) - 多视图应用

[AngularJs学习心得-路由](http://www.imooc.com/wenda/detail/236998) - ui-router

