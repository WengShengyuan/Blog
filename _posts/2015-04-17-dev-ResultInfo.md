---
layout: default
title: 远程部署tomcat工程到Linux服务器
comments: true
category: java
---


基本linux命令略， 可以借助SecureCRT，以及SecureCRT FX 进行辅助。比命令高效得多=.=


## 生成发布包

	1、MAVEN工程项目可以使用 `maven install` 生成，后在项目的target文件下下有WAR包。
	
	2、选择EXPORT 成 WAR文件亦可。
	

## 上传包

默认上传到  tomcat\\webapps 下即可。一般tomcat服务器会自动Deploy，并启动。

如果没有，可以手动启动

```BASH

	cd tomcat/webapp
	unzip web.war -d web
	

```

解压完成后，重启tomcat

```BASH

	cd tomcat/bin
	sh ./startup.sh

```

## 监控tomcat输出

```BASH

	tail -f tomcat/log/catalina.log

```