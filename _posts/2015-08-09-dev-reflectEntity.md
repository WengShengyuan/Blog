---
layout: default
title: 反射方式获取JPA Entity的属性和值
comments: true
category: java
---

在记录日志或者调试的时候，往往需要输出数据库查询或者写入的值，或者在接口交互的时候，可能需要将实体转成JSON串传递出去。
在JPA中是以Entity的示例方式传递的。但是如果直接使用`Entity.toString()`
方法的话，输出的结果是`entity@内存地址`的形式，无法得知Entity的内部具体的属性和值。

以下描述采用反射方式获取Entity的字段和值的方法：

## 反射工具类

以将实体转为JSON串为例：

```java

public class ReflectEntity{

	public static String toStr(Object o){
		
		try{
			StringBuilder sb = new StringBuilder();
			sb.append("{");
			Class cls = o.getClass();
			Field[] fields = cls.getDeclaredFields();
			for(Field f : fields){
				f.setAccessible(true);
				sb.append("\"").append(f.getName()).append("\":\"").append(f.get(o)).append("\",");
			}
			return String.format("%s}",sb.subString(0,sb.length()-1));
		} catch(Exception e){
			return null;
		}
		
	}
	
}

```

## 重写toString方法

假设有个JPA Entity：

```java

@Entity
public class E{

	private String colA;
	private String colB;
	
	//getter, setter 略
	
	//在此处使用反射方法即可
	@Override
	public String toString(){
		return ReflectEntity.toStr(this);
	}
}

```

通过以上改造后，记录或者通过网络接口调用传输`Entity`或者`List<Entity>`都能顺利转为JSON串。
