---
layout: default
title: 尝试使用枚举类存储静态变量
comments: true
category: dev
---


一般在项目中会有一组或者几组数据用来表示公用变量，这样在散布各处的业务代码中就已变量名本身代替变量的具体值，
这样避免了当公用变量的含义和值改变的时候可能引起的各种问题。

一般，在看前辈代码的时候，他们一般将这些变量存在一个统一的静态类中，使用'public static XXX'的方式进行保存。这样仅能做到变量名与值的关联，
而该值的具体描述只能写在代码备注中，若需要在程序中获取该变量的描述文本，则只能另写一个变量了。否则输出的变量只有"0","1"神马的可读性很差。

JDK1.5以后多了一个枚举类，是一个不可被继承的final class，其枚举值都是public static final的。枚举类可以定义构造器，可以自定义方法，
因此可以对变量加入更复杂的逻辑处理方法，另代码更简洁，更易于阅读，用于存储变量更加灵活。

## 枚举类的一般使用


定义一个枚举类：EnumClass，其中 变量包含 : code 和 description 两种属性。
*注意：枚举类的构造函数是private， 避免被外部影响。*

```java

public enum EnumClass {
	
	EMU_1(1,"1Str"), EMU_2(2,"2Str"), EMU_3(3,"3Str");
	
	private int code;
	private String description;
	
	private EmuClass(int code, String description){
		this.code = code;
		this.description = description;
	}
	
	@Override
	public String toString(){
		return "["+String.valueOf(this.code) + ","+ this.description + "]";
	}
	
	public int getCode(){
		return this.code;
	}
	
	public String getDescription(){
		return this.description;
	}

}

```

测试代码如下:

```java

	public static void main(String[] args){
		System.out.println(TestEmu.EMU_1);
		System.out.println(TestEmu.EMU_1.getCode());
		System.out.println(TestEmu.EMU_1.getDescription());
	}

```

即可得到`EMU_1`的toString、code、description值。

## 枚举类的进阶使用

参考博客： [Java枚举类型的使用](http://xyiyy.iteye.com/blog/359663/)

### 枚举类型的单独声明

上章仅仅使用了枚举类的取值方法，并且仅能使用同一的返回数据类型，比如：`code`是`int`型的。
若有些`code`是`double`或者`String`型的就不能放在一起了【PS:其实感觉这样挺好】

枚举类还有另一种声明方法，参考博客采用*因值而异的类实现*命名，及每一个枚举值都可以看做单独的类，有单独的方法来实现。

```java

	public interface IDescription  
	{  
	    public String getDescription();  
	}  
  
public enum MoreAction implements IDescription  
{  
    TURN_LEFT  
    {  
         //实现接口上的方法  
      public String getString() {return "向左转"}  
    },  //注意这里的枚举值分隔使用,  
     
    TURN_RIGHT  
    {  
         //实现接口上的方法  
      public String getString() {return "向右转"}  
    },  //注意这里的枚举值分隔使用,  
  
    SHOOT  
    {  
         //实现接口上的方法  
      public String getString() {return "射击"}  
    }; //注意这里的枚举值结束使用;  
}  

```

这样的好处例如：SHOOT值和TURN_RIGHT的toString()方法我就可以单独声明，以及针对某些方法使用特殊声明的函数等等。

### 枚举的排序

枚举对象支持compareTo()，因此在静态变量间存在先后关系，或者大小关系的时候就可以直接排序。

在枚举类声明过程中，会自动附上ordinal属性，从0开始...

因此：

```java

EMU_1(1,"1Str"), EMU_2(2,"2Str"), EMU_3(3,"3Str");

```

`EMU_1.ordinal()`的值就是0. `EMU_1.compareTo(EMU_2)`的值就是-1(因为EMU_1在EMU_2之前)。
