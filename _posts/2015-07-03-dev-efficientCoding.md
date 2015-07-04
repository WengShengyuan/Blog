---
layout: default
title: 如何在需求不断改变的情况下愉快的写代码
comments: true
category: dev
---


*子曰 ： 随手一写，有错正常=。=*

有时候~工期紧，任务重。PM或者开发汪自己都还没把需求弄清楚的时候，开发就已经开始了。于是就会遇到如下情况：

* - 小W正敲着代码唱着歌， 天边飘来一段话：“XXX表要改，XXX表要改，这里要增加XX字段，这里不能有这个！”

* - 小W正敲着代码流着泪， 天边飘来一段话：“我觉得这个流程应该放在这个流程前边，然后这里的XXX过程就不要了叭！”

* - 在那山的那边海的那边有一群小美工，他们就要重画界面，他们画完不给脚本。

遇到上述这些情况，我想返工是必须的，开发汪们的内心也一定是崩溃的。因此在闷头写代码的同时，是不是改为自己的幸胡人生考虑考虑，花点时间想想怎么在需求改变的时候，尽量减少自己的返工量。
说不定节省下来的时间还能用来找个妹纸呢，呵呵呵呵呵呵呵呵呵。。。。。

以下仅为个人粗浅总结，经验不足，肯定会有错误，大家看看就好。

## 前端页面与数据分离

以前刚接触Thymeleaf标签的是否，感觉这货还是挺牛逼的，于是神马页面都用Thymeleaf解决了，JS神马的都不要写。写出来的HTML和JAVA是这样的：


![]({{site.baseurl}}/images/post_images/2015-07-03-dev-efficientCoding/thymeleaf.jpg)

![]({{site.baseurl}}/images/post_images/2015-07-03-dev-efficientCoding/javamodel.jpg)


但是后来慢慢就感觉到这货的局限性太强：

* 不能动态获取数据；

* 不能异步加载，给人感觉网页跳转有延迟，后台业务逻辑复杂的时候，页面就得等到后台服务器执行完毕返回结果的时候才会加载。

* 不能做到局部刷新，每次都得全页面刷新才行。

* 对页面数据的获取最终还是得写JS。

* 美工该页面了，就得在美工新页面的基础上重新填上Thymeleaf标签。

将页面与数据的处理分离，可以解决部分问题。
前端页面与数据分离的主要做法：在用户发起HTTP请求后，并不需要等待业务、数据处理结束后才将数据与页面一同返回回来。而是立即返回静态，或仅包含少量必要数据的页面，然后再由AJAX请求复杂业务处理请求，异步方式加载到页面中。

这样做的好处在于：

* 页面反馈迅速，用户体验良好。

* 提前将业务逻辑与页面分离，便于后期APP数据接口的开发。

* 方便的对页面内容进行模块划分，达到灵活配置不同规格的页面组合而不修改代码的效果。



## 前端MVC框架

在上文页面与数据分离的基础上，利用*AngularJS*实现前端MVC(或MVVM)框架，实现页面(View)与数据(Model)的进一步分离。我目前还是刚刚接触并尝试AngularJS，但已经被深深折服，这货绝对称得上“优雅”。
且不说它目前应用于好多HybridAPP开发框架以及牛逼的前端路由。就说数据与页面的双向绑定这个特性就能让我们省下好多的时间。以下是我从中受益的地方。

以前用Javascript获取后台数据，然后动态填充页面的时候是这样的：

![]({{site.baseurl}}/images/post_images/2015-07-03-dev-efficientCoding/jsDOM.jpg)

从复杂的页面结构中提取数据的时候脚本是这样的：

![]({{site.baseurl}}/images/post_images/2015-07-03-dev-efficientCoding/jsGetParam.jpg)

有时页面操作逻辑多，函数没有归类分割到不同js时，函数堆积如山时，找一个函数都得费半天劲。

![]({{site.baseurl}}/images/post_images/2015-07-03-dev-efficientCoding/functionPile.jpg)

所以一旦美工把页面改了，那这些代码几乎就要废了重写，有种想把美工按在水里的赶脚！

现在用AngularJS，声明Module、声明Service、声明Controller足矣。

于是，页面只需一次加工，做好标记，如下：

![]({{site.baseurl}}/images/post_images/2015-07-03-dev-efficientCoding/ng-x.jpg)

将数据获取、处理的逻辑写在Service中：

![]({{site.baseurl}}/images/post_images/2015-07-03-dev-efficientCoding/jsserver.jpg)

将页面操作函数写在Controller中：

![]({{site.baseurl}}/images/post_images/2015-07-03-dev-efficientCoding/jsctrl.jpg)

经过以上三步，页面函数的定义、数据的获取、数据与页面的绑定已经完成。修改数据，页面会跟着改变；修改页面数据的值，后台数据也会跟着改变，简直完美有木有！完全不需要声明事件，然后再去HTML中找值有木有！！
而且合理用好MVC结构，可以将同类业务的Service单独分离出来，在可能调用的地方单独引入，完美的代码复用有木有！AngularJS的Directive也十分牛逼，但是我赶脚上边的几个特性已经足够满足目前的开发需求了。

有了AngularJS，无论美工怎么改页面，从ul列表改成table，再改成div，甚至改成ui嵌套div再嵌套table，我都不需要改变后边的JS，工作量一下少了不少有木有。

## 需求模糊时候的处理

### 参数笼统一点

需求不确定的时候，有时候给人的感觉就是摸索着写代码。可能知道应该有这个函数，但是不确定参数有哪些。一般这里是写成接口形式的，如果直接就具体到某个参数了，以后再改比较麻烦。
如果函数涉及哪些数据实体可以知道，就可以将整个实体作为参数传进来，具体用哪些参数可以在实现方法中提取。这样，及时后期参数有一些增减，由于接口本身未变，代码的修改量也会少很多。

比如：


```JAVA


//具体参数
public void doSomething(String userName, String userGender, String email) throws Exception;

//可以改成
public void doSomething(User user) throws Exception;


//假设User 包含变量： userName, userGender, email 。。。

```


### 尝试在数据实体POJO中实现一些逻辑处理

比如 Article 代表文章的数据实体中有有效的起止日期属性。有些页面需要根据当前日期确定该文章是否有效的时候，若将判断代码写在POJO外边，则每一个需要判断的地方都得写几行日期比较代码，比较麻烦。但若封装在POJO中的话，
日期的有效性就可以被视为 Article 实体本身的一个属性被直接调用读取了。伪代码如下：

```JAVA

@Entity
public class Article{

	private Date startDate;
	private Date endDate;
	
	public isTimeValid(){
	
		Date now = new Date();
		return ((now.getTime() > startDate.getTime()  &&  (now.getTime() < endDate.getTime())));
	
	}
}

```

这样，就可以直接使用`Article.isTimeValid()`直接获取该文章是否在有效期内了。

