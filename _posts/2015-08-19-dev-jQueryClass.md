---
layout: default
title: jQuery自执行函数以及封装工具类的方法
comments: true
category: java
---


## 自执行函数

javaScript的自执行函数主要用于保护内部变量不被外部声明污染，自执行函数的结构大致如下：`(function(){})();`其中，第一个括号使编译器编译该函数体，第二个括号另函数执行。这种用法在jQuery的类库中十分常见。

jQuery的自执行函数声明：`(function($){})(jQuery)`。因此其封装特性也可以用于作为自定义工具类库的声明。`$`是jQuery的别名。

## 封装实例(正则验证工具)

### 封装
在自执行函数体中创建一个类，并声明变量与函数方法。

```javascript

(function($){
$.validator = function(){
var reg_CHS = /^[\u0391-\uFFE5]+$/;
var etc..
this.is_CHS = function(str){
return reg_CHS.test(str);
}
this.is_etc.....
}
})(jQuery);

```

### 使用

使用的时候仅需实例化工具类，并调用函数即可。

```javascript

var t = '123';
var result = new $.validator().is_CHS(t);

```
