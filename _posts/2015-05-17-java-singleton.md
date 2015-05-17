---
layout: default
title: 单件模式的经典代码
comments: true
category: java
---


部分组件在程序中只允许存在一个实例，比如一些管理共享资源的类，可以使用单件模式创建。

用例包括：缓存管理器，线程池、连接器等等。。。。。

## 代码实现依据

### 将构造函数私有化

这样就避免了外部实例化该类。

```java

public class Singleton() {
	
	private Singleton() {
		// init method
	}
}

```

### 通过静态方式获取实例

```java

	public static Singleton getInstance() {
		return instance;
	}

```

## 具体实现例子

综上部分代码片段，可以组合出如下经典结构。

```java


public class Singleton() {

	private static Singleton instance;
	
	private Singleton() {
		//init method
	}
	
	public static getInstance() {
		if(instance == null){
			instance = new Singleton();
		}
		return instance;
	}
}

```

## 单件模式的多线程问题

如果第一个线程访问这个类时，`instance == null` 为true，那么他要new一个Singleton的对象，恰巧第二个线程也访问这个类，又会new 一个对象，从而出现问题。
解决方式有一下几种：

### 方式1：使用synchronized 方法同步getInstance过程

```java

	public staic synchronized Singleton getInstance(){
		if(instance == null){
			instance  = new Singleton();
		}
	}

```

* 问题：不管是否创建实例，每次调用`getInstance`时候都是同步的，可能降低性能。


### 方式2：提前创建实例

在加载类时就创建实例

```java

public class Singleton {
	private static Singleton instance = new Singleton();
	
	private Singleton() {
		//init method
	}
	
	public static getInstance() {
		return instance;
	}
}

```

### 方法3：双重加锁，减少使用同步

尽在要创建的时候使用同步方法

```java

public class Singleton {
	private volatile static Singleton instance;
	
	private Singleton() {
		//init method
	}
	
	public static getInstance() {
		if(instance == null){
			synchronized (Singleton.class) {
				if (instance == null ){
					instance = new Singleton();
				}
			}
		}
		return instance;	
	}
	
}

```



