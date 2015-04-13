---
layout: default_comments
title: 关于CMUSphinx的一些整理
comments: true
---


# 平台搭建

## PC平台

* 通过MAVEN构建

```xml

<project>
    <repositories>
        <repository>
            <id>snapshots-repo</id>
            <url>https://oss.sonatype.org/content/repositories/snapshots</url>
            <releases><enabled>false</enabled></releases>
        <snapshots><enabled>true</enabled></snapshots>
        </repository>
    </repositories>
</project>

//dependency

dependency>
  <groupId>edu.cmu.sphinx</groupId>
  <artifactId>sphinx4-core</artifactId>
  <version>1.0-SNAPSHOT</version>
</dependency>

<dependency>
  <groupId>edu.cmu.sphinx</groupId>
  <artifactId>sphinx4-data</artifactId>
  <version>1.0-SNAPSHOT</version>
</dependency>

```

## Android平台

不需要网上繁琐的Ant编译教程，直接从别人的项目中找到jar包比较方便。


# API的使用及代码

## 配置器

## 实时识别

## 音频文件识别




# 训练过程

# 配置分析