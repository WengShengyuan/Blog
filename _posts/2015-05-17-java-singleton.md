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