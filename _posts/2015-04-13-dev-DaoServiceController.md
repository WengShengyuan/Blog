---
layout: default
title: 个人使用SpringMVC框架项目的心得
comments: true
category: SpringMVC
---


首先SpringMVC框架不是我搭的 T.T，我只是用了这个框架在开发，同时在开发过程中总结了写小经验分享分享。

# 项目结构

项目大致分为公共包(common-utils)、核心(core)、前端(web)三个工程。<br>
大致目录:<br>
Worksapce<br>
 |-common-utils<br>
 |-core<br>
 |-web<br>


## 公共包 

### common-utils
全系统（包括其它模块）公用的部分:<br>
common-utils<br>
 |-exception<br>
 |-utils<br>
 |-Generic<br>
 &nbsp;&nbsp;|-GenericDao<br>
 &nbsp;&nbsp;|-GenericService<br>


* 异常处理
<p>
	根据业务逻辑分成：系统异常`SystemException`、业务异常`BusinessException`两大类。
	
	1. 业务异常
		通常指业务处理中可能出现的异常情况，通常是违反业务正常进行规则出现的异常，而不是系统错误。应该给前台反馈适当的异常信息。而不是单纯的错误代码。
		且一般是业务逻辑判断后主动抛出的异常，而不是程序错误抛出的异常。

	2. 系统异常
		一般是程序错误，或者违规操作造成程序无法继续运行的状况。为了提高用户体验，通常捕捉到程序异常`Exception`后记录日志系统，
		然后将其包装成系统异常`BusinessException`抛给前台。这样反馈给用户的时异常的概述，而不是冗长的异常代码。同时也不影响查询日志获得更详细的错误信息。
</p>


* 工具库
<p>
	可以从网络上获取：引入MAVEN依赖，或者导入java。并可以适当的进行继承与扩展。对于提高编程效率很有帮助。尽量用T、E等，扩大适用范围。
</p>

* 公共接口
<p>
	1。 数据层 `GenericDao`, `GenericDaoImpl`
	
		所有项目的公共实现，如：增、删、改、查...。
		
	2。 服务层 `GenericService`, `GenericServiceImpl

		所有项目的业务实现。
		
</p>

## 核心

### core

具体模块的核心工程:

core<br>
 |-commons<br>
 &nbsp;&nbsp;|-utils<br>
 &nbsp;&nbsp;|-comstatic<br>
 &nbsp;&nbsp;|-config<br>
 |-Module_1<br>
 &nbsp;&nbsp;|-Dao<br>
 &nbsp;&nbsp;|-Domain<br>
 &nbsp;&nbsp;|-Service<br>
 |-Module_2<br>
 &nbsp;&nbsp;|-Dao<br>
 &nbsp;&nbsp;|-Domain<br>
 &nbsp;&nbsp;|-Service<br>
 。。。。<br>

* 公共库
<p>
	包括工具库、静态参数类、配置类

	1. 工具库

		可以从网络上获取：引入MAVEN依赖，或者导入java。并可以适当的进行继承与扩展。对于提高编程效率很有帮助。

	2. 静态参数类

		避免在代码中直接写入参数，而是将参数提取出来放进参数类中。
		
	3. 配置类`config`

		将一些允许在项目发布后进行设置的参数暴露出来，以`.property`或者`.xml`方式保存。
</p>

* 数据层 `Dao` Extends `GenericDao`

<p>
	在`common-utils`的`GenericDao`基础上添加个性化的方法。

	比如：

	清空整张表、从JSON文件导入数据、针对该表个性化数据查询、处理等。

		
	1. 接口 `Dao`<br>
		针对某个表`Entity`实现对其数据基本的处理。

	2. 实现 `DaoImpl`<br>
		针对某个表`Entity`实现对其数据基本的处理。
		
</p>

* 业务逻辑层 `Service` Extends `GenericService`
<p>
	1. 接口 `Service`

		针对某一项业务的接口，可能涉及多个表`Entity`，因此在`Service`层可以调用多个`Dao`。

	2. 实现 `ServiceImpl`

		针对某一项业务的具体实现。
	
		<strong>为实现数据库的事务处理，在`Service`的实现上，应加上事务标签`@Transactional`</strong>。
		
</p>


## 前端

### web
前端工程:<br>
web<br>
|-controller<br>
&nbsp;&nbsp;|-Module_1<br>
&nbsp;&nbsp;&nbsp;&nbsp;|-ModuleController<br>
|-webapp<br>
&nbsp;&nbsp;|-WEB-INF<br>
&nbsp;&nbsp;|-resource<br>


* 控制器 `Controller`
<p>
用来控制页面跳转

	1. 返回页面与数据 `ModelAndView`。

	使用 `RequestMapping` 标签。

	2. 返回数据实体

	使用 `ResponseBody`+`RequestMapping` 标签。

	一般Mapping时候在路径上加上`/api/`比较好。这样有利于明显标志数据与页面的分离。

	3. 在`Controller`上方也可以加入统一的`Mapping`路径，这样可以用于在有用户认证拦截的框架中(如:`Shiro`)实现统一的免密连接。多用于`api`或者后台调试页面。 
	
</p>

* 资源 `webapp`
<p>
	用于一般资源文件的放置。<br>
	一般`resource`可以放置`images`,`css`,`javascript`等文件。`WEB-INF`中放置`html`文件。
</p>

# Controller - Service - Dao 的三层结构

## 阐述

* `Controller`用于与用户直接交互，浏览器，`HTTP`请求等。

* `Service`用于业务逻辑处理。<strong>注意接口输入输出的规范</strong>，这样有利于接口复用。

* `Dao`用于直接与数据实体交互，实现数据的简单提取与处理。<strong>避免在`Dao`层出现跨表操作现象</strong>.

## 结构

结构示意图如下：<br>
<img src = "{{site.baseurl}}/images/post_images/2015-04-13-frame-DaoServiceController/frame.jpg" /><br>

* 一般`Controller`只与`Service`交互。 `Service`只与`Dao`交互。



# 异常处理

## 抛出与捕获

* Controller-Service-Dao 三层架构
<p>
	* `Dao` 中不涉及业务，一般错误都是系统异常，不做处理，直接抛出`Exception`， 在`Service`中做进一步处理。
	
	```java
		public void doSomething() throws Exception {
			try{
				someFunction();
			} catch(Exception e){
				throw e;
			}
	
		}
	```
	
	* `Service` 中涉及复杂业务，一般错误处理在这里处理完成后抛出。
	
	```java
		public void doSomething() throws Exception {
			
			logger.debug();
			
			try{
				someFunction();
				
				if(BusinessError){
					logger.info();
					throw new BusinessException();
				}
				
			} catch (Exception e){
				logger.error();
				throw new SystemException();
			}
			
		}
	```
	
	* `Controller`中捕获系统抛出的异常，并交予用户处理。
	
	```java
		public void doSomething() throws Exception {
			
			/*为保证系统正常运行，一般进行try-catch操作，不管正常与否均能返回结果*/
			boolean statusFlag;
			String ErrMsg;
			try{
				service.doSomething();
				statusFlag = true;
			} catch (SystemException e) {
				statusFlag = false;
				ErrMsg = e.getMessage();
			} catch (BusinessException e) {
				statusFlag = false;
				ErrMsg = e.getMessage();
			} catch (Exception e) {
				statusFlag = false;
				//系统内未捕获的错误，应该记录日志
				logger.error();
				ErrMsg = e.toString();
			} 
			//最终判断是否成功执行
			if(statusFlag) {
				return success;
			} else {
				return ErrMsg;
			}
			
		}
	```
	
</p>


# 日志系统

## 埋点

埋点工作最好在项目进行中时就留意进行。初期可以先写个日志工具`logger`，并加上空方法，甚至简单的`System.out.println()`都行。

<strong>避免在日志点直接写入日志实现方法，这样对于后期统一的修改有好处。</strong>

## 不同级别的日志

如上文的异常处理为例，代码中可以看到日志埋点中可以使用`debug`,`info`,`error`三个级别的日志处理。这样就可以方便地区分日志类别。同时不同的日志级别区分，可以为以后实现控制日志记录级别，减少日志量打下基础。

## 可配置的统一调度

* 为日志专门创建一个`logger`，其中加入个性化的设置，日志器`log4jLogger`,`customLogger`等等。通过统一的方法调用各个`logger`。

* 通过`config`在外部`.property`文件中实现不同`logger`的调度开关。

* 通过`config`在外部实现日志级别的处理

设置日志级别	<strong>DEBUG(3) > INFO(2) > ERROR(1) > NONE(0)</strong>

则当设置`logLevel = 3 `时，会记录所有日志； 当`logLevel = 1`时，就只会记录系统错误日志了。

伪代码如下:

```java

	public void error(String className, String functionName, String logInfo) {
		try {
			if(onfig.getLOG_LEVEL() >= Static.LOG_LEVEL_ERROR) {
				if(config.isUSE_LOGGER()) {
					logger.errorLog(className, functionName, logInfo);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

```

* 最终效果如下

<img src = "{{site.baseurl}}/images/post_images/2015-04-13-frame-DaoServiceController/logView.jpg" /><br>





