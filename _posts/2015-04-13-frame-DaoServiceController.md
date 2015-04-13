---
layout: default_nocomments
title: FRAME - 个人参与SpringMVC框架项目的心得
comments: false
---


框架不是我搭的 T.T

# 项目结构

## 公共包
项目大致分为公共包、核心、前端三个工程。

### common-utils
全系统（包括其它模块）公用的部分：

* 异常处理
<p>
	根据业务逻辑分成：系统异常`SystemException`、业务异常`BusinessException`两大类。<br>
	1) 业务异常<br>
		通常指业务处理中可能出现的异常情况，通常是违反业务正常进行规则出现的异常，而不是系统错误。应该给前台反馈适当的异常信息。而不是单纯的错误代码。
		且一般是业务逻辑判断后主动抛出的异常，而不是程序错误抛出的异常。<br>
	2) 系统异常<br>
		一般是程序错误，或者违规操作造成程序无法继续运行的状况。为了提高用户体验，通常捕捉到程序异常`Exception`后记录日志系统，
		然后将其包装成系统异常`BusinessException`抛给前台。这样反馈给用户的时异常的概述，而不是冗长的异常代码。同时也不影响查询日志获得更详细的错误信息。
</p>


* 工具库
<p>
	可以从网络上获取：引入MAVEN依赖，或者导入java。并可以适当的进行继承与扩展。对于提高编程效率很有帮助。尽量用T、E等，扩大适用范围。
</p>

* 公共接口
<p>
	1) 数据层 `GenericDao`, `GenericDaoImpl`<br>
		所有项目的公共实现，如：增、删、改、查...。
	2) 服务层 `GenericService`, `GenericServiceImpl`<br>
		所有项目的业务实现。
</p>

## 项目工程

### core
具体模块的核心工程

* 公共库
<p>
	包括工具库、静态参数类、配置类<br>
	1) 工具库<br>
		可以从网络上获取：引入MAVEN依赖，或者导入java。并可以适当的进行继承与扩展。对于提高编程效率很有帮助。<br>
	2) 静态参数类<br>
		避免在代码中直接写入参数，而是将参数提取出来放进参数类中。<br>
	3) 配置类`config`<br>
		将一些允许在项目发布后进行设置的参数暴露出来，以`.property`或者`.xml`方式保存。
</p>

* 数据层 `Dao` Extends `GenericDao`
<p>
	1) 接口 `Dao`<br>
		针对某个表`Entity`实现对其数据基本的处理。<br>
	2) 实现 `DaoImpl`<br>
		针对某个表`Entity`实现对其数据基本的处理。
</p>

* 业务逻辑层 `Service` Extends `GenericService`
<p>
	1) 接口 `Service`<br>
		针对某一项业务的接口，可能涉及多个表`Entity`，因此在`Service`层可以调用多个`Dao`。<br>
	2) 实现 `ServiceImpl`<br> 
		针对某一项业务的具体实现。<br>
		<strong>为实现数据库的事务处理，在`Service`的实现上，应加上事务标签`@Transactional`</strong>。
</p>



### web

* 控制器 `Controller`

* 资源 `webapp`

## 包的命名规范

# Controller - Service - Dao 的三层结构

# 异常处理

# 日志系统

# 系统参数设置

