---
layout: default_nocomments
title: 如何将JAVA工程转为MAVEN工程
comments: false
---


本文内容出自 <a href = "http://www.cnblogs.com/rushoooooo/p/3558499.html">Java工程转换为Maven工程</a>
用于<a href = "http://github.com/WengShengyuan/CustomUtils">CustomUtils</a>项目的转换

## 创建一个JAVA工程
创建一个Java工程。

## 转换为MAVEN工程
选中此工程 -> 右键 -> Configure -> Convert to Maven project。 直接选择finish。

## 配置pom.xml文件
加入自己的依赖包

<dependencies>
  	<dependency>
  		<groupId>net.lingala.zip4j</groupId>
  		<artifactId>zip4j</artifactId>
  		<version>1.3.1</version>
  	</dependency>
</dependencies>

## 删除工程目录下多余文件
* 打开这个工程的目录，删除除了src和pom.xml的所有文件。
* 在src下建立main和test两个目录，然后在这两个目录下面分别建立java目录。在src/main下面建立resources目录。

## 重新导入MAVEN工程
在Eclipse中重新导入该工程，使用Maven -> Existing Maven Module的方式导入。
