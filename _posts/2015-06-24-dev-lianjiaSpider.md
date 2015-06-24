---
layout: default
title: 链家地产爬虫实验以及二手房信息统计概览
comments: true
category: java
---


项目参考：[LianJiaSpider](https://github.com/WengShengyuan/LianJiaSpider)

原本该练习项目是想用来搜索购物网站某商品的降价抢购信息的，比如《什么值得买》。
但是那个网站貌似有防爬虫机制，因此转移目标，改搜搜二手房信息，想想应该会有人有这种需求的，呵呵。。。。。正好链家地产的页面
可以顺利抓取，而且该网站的房源信息查询条件是直接拼接在URL中的，拼接规则极其简单。所以就拿这个网站下手了=。=


## 涉及工具

主要还是用MAVEN构建项目，引入了几个基础包：

*1. apache httpclient - 用于处理HTML请求

*2. jsoup - 用于处理HTML页面文档

*3. mysql-connector-java + c3p0 - 用于连接数据库


## 项目主要设计

### 单例模式URL管理

由于在查询某一搜索条件的结果页的时候，往往遇到分页的情况，所以需要动态添加更多的URL，需要将URL设计成一个公共的资源。

目前该项目爬虫为单一线程，但是为了后期扩展成多线程模式，要让所有爬虫能访问URL列表资源，并且能动态添加URL记录，就应该考虑
到同步的问题。因此，将URL资源设计成单例模式管理。代码如下（核心是stack，同步锁暂未添加）：


```java

public class URLPool {

	private static URLPool Instance;
	private Stack<String> stack;
	
	private URLPool(){
		stack = new Stack<String>();
	}
	
	public static URLPool getInstance(){
		if(Instance == null){
			Instance = new URLPool();
		}
		return Instance;
	}
	
	public void batchPush(List<String> URLS){
		for(String URL : URLS){
			if(!stack.contains(URL)){
				stack.push(URL);
			}
		}
	}
	
	public void pushURL(String URL){
		if(!stack.contains(URL)){
			stack.push(URL);
		}
	}
	
	public boolean hasNext(){
		return !(stack.isEmpty());
	}
	
	public String popURL(){
		if(hasNext()){
			return stack.pop();
		} else {
			return null;
		}
	}
}

```

