---
layout: default
title: 宿舍内网入侵试验
comments: true
category: hack
---


由于学院宿舍内网开始免费，于是申请开通了学院内网。前一段一直在做WEB开发，因此对网络安全较为敏感，便对宿舍网络的安全网关进行了观察，发现问题不少，最终竟然获取了所有内网用户的登陆用户名和密码（包括管理员）。

以下是发现和探索的过程。

【仅研究用， 并没有做什么坏事，问题已向老师汇报，并在确认问题解决后才发表日志】

## 过程

### 1-网关拦截指向统一IP,端口

在未登陆时候，打开任意网站均会跳转至统一的登陆页面，该页面并没有对IP进行隐藏，因此我轻易得到了服务器的IP和端口。http://192.168.100.253:7755/

![]({{site.baseurl}}/images/post_images/2015-05-18-hack-breakgate/login.jpg)

但是对于对方的网络设备和环境还是不了解，因此我就尝试查找端口为7755的网络管理设备有什么。很幸运，只有一个：天融信的topGate系列。

### 2-查找设备手册

通过查找topGate系列用户手册，发现其提供SSH管理服务，默认密码是admin; lsrplsrp。于是我就尝试了一下，很顺利的登陆进去了。。。。。。

因此我现在就可以以admin的身份在服务器中随意游荡。

![]({{site.baseurl}}/images/post_images/2015-05-18-hack-breakgate/console.jpg)


### 3-查找日志

一般来说从日志中可以找到很多用户登陆的信息。经过一番搜索，我很顺利的找到了log文件夹所在的位置，里边就少数几个日志文件。通过大致浏览以及关键词搜索，很轻易的就找到了用户登陆的日志字符串:

'/login.cgi?act=login&user_name=xxx&user_pwd=xxx&xxxxxx....' 

从字符串中就能找到管理员登陆的页面地址。

![]({{site.baseurl}}/images/post_images/2015-05-18-hack-breakgate/log.jpg)

可是日志中的用户名和密码并不能使用，一看日志时间发现是2011年的。因此最近的日志可能被人关掉了。只能从别的地方想办法。

### 4-备份文件中寻找

在其它文件夹中浏览的时候，发现了一堆类似备份文件的tar包.

![]({{site.baseurl}}/images/post_images/2015-05-18-hack-breakgate/back.jpg)

因此下载下来看看，里边是一堆发现完全没有加密的文本文件，而且文件名写的清清楚楚：txt\_user\_info.tar，打开后分别出现了t\_sys\_admin.txt和t\_sys\_user.txt

所有用户的用户名和密码就整齐的展现在我的面前了。

![]({{site.baseurl}}/images/post_images/2015-05-18-hack-breakgate/password.jpg)

最后我尝试了超级管理员用户的账号和密码，轻易就登上了。。。。。。

![]({{site.baseurl}}/images/post_images/2015-05-18-hack-breakgate/success.jpg)


## 总结

这次尝试可以说是毫无技术含量，只是管理员的一些疏忽让我可以侥幸入侵成功。

总结如下：

* 配置好网关或其他设备后一定要修改默认密码

* 藏好配置文件，或者设置权限让其他人不能轻易阅读

* 备份文件要加密，或者及时从服务器中移除

* 做好日志记录，以便在入侵发生时候容易追踪





