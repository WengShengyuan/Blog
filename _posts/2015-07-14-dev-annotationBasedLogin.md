---
layout: default
title: Spring基于自定义注解的用户认证
comments: true
category: java
---


在编写网站后台的时候，往往在很多地方需要加入用户权限验证，若在每个权限验证的地方均加入验证判断代码，会显得代码较为冗余。大概的(伪)代码示例如下：

```java

@Controller
public class MyController {

  @RequestMapping(value = "/home")
  public ModelAndView home(HttpServletRequest request) {
  
    if(config.needValidate()){
      if(userService.validate(request)){
        // continue process
      } else {
        // redirect to login
      }
    }
  }
  
}

```

在每个需要验证的地方都写上这一段挺烦的。借助于Spring MVC中的action拦截器我们可以实现注解式的权限验证。代码量大大减少，同时支持整个Controller的验证注解，大概的(伪)代码如下：

```java

@Controller
public class MyController {

  @AuthPassport
  @RequestMapping(value = "/home")
  public ModelAndView home(HttpServletRequest request) {
    //continue process
  }
  
}

```

## 1 具体实现

### 1.1 定义注解

定义一个 `@interface` 这样就可以在编辑器中进行注解识别。

```java

@Documented
@Inherited
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AuthPassport {
    boolean validate() default true; //true表示需要进行验证
}

```

### 1.2 拦截器

拦截器用于实现用户权限认证的具体方法，扩展`HandlerInterceptorAdapter`，该拦截器的具体说明见最后。

```java

public class AuthInterceptor extends HandlerInterceptorAdapter {

	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {

		if (handler.getClass().isAssignableFrom(HandlerMethod.class)) {
			AuthPassport authPassport = ((HandlerMethod) handler)
					.getMethodAnnotation(AuthPassport.class);

			// 没有声明需要权限,或者声明不验证权限
			if (authPassport == null || authPassport.validate() == false)
				return true;
			else {
				// 这里写自己的验证方法，验证失败则返回false;
				System.out.println("validating");
				
				if(validate(request)){
				  //验证成功则返回true，继续页面处理
				  return true;
				} else {
				  //验证失败则重定向地址到登陆页面，返回false中断原有的页面处理
				  response.sendRedirect("account/login");
				  return false;
				}
			}
		} else
			return true;
	}

}


```

### 1.3 配置拦截器

参考博客:[SpringMVC中使用Interceptor拦截器](http://haohaoxuexi.iteye.com/blog/1750680)

在`springContext-servlet.xml`中插入拦截器包配置

```xml

	<!-- 第一种拦截属于全局拦截，即在mvc:interceptors下直接声明bean -->

	<!-- 拦截权限验证 -->
	<mvc:interceptors>  
	    <!-- 如果不定义 mvc:mapping path 将拦截所有的URL请求 -->
	    <bean class="org.company.core.custominterceptor.AuthInterceptor"></bean>
	</mvc:interceptors>
	
	
	<!-- 第二种拦截是带路径信息的拦截，即在mvc:interceptors下单独声明interceptor并加上mvc:mapping，bean参数 -->
	<!-- 拦截权限验证 -->
	<mvc:interceptors>  
	    <mvc:interceptor>  
        	<mvc:mapping path="/test/number.do"/>  
        	<!-- 定义在mvc:interceptor下面的表示是对特定的请求才进行拦截的 -->  
        	<bean class="com.host.app.web.interceptor.LoginInterceptor"/>  
	    </mvc:interceptor>  
	</mvc:interceptors>

```

### 1.4 在需要验证的位置进行注解

在方法或者`Controller`类中加入注解`@AuthPassport`即可。

## 2附录

### 2.1 参考博客(主要以第一篇为主)： 

[SpringMVC学习系列（9） 之 实现注解式权限验证](http://www.cnblogs.com/liukemng/p/3751338.html)

[Spring Security Custom Login Form Annotation Example](http://www.mkyong.com/spring-security/spring-security-custom-login-form-annotation-example/)

### 2.2 `HandlerInterceptorAdapter`说明

HandlerInterceptor是Spring MVC为我们提供的拦截器接口，来让我们实现自己的处理逻辑，HandlerInterceptor 的内容如下：

```java

public interface HandlerInterceptor {  
    boolean preHandle(  
            HttpServletRequest request, HttpServletResponse response,   
            Object handler)   
            throws Exception;  
  
    void postHandle(  
            HttpServletRequest request, HttpServletResponse response,   
            Object handler, ModelAndView modelAndView)   
            throws Exception;  
  
    void afterCompletion(  
            HttpServletRequest request, HttpServletResponse response,   
            Object handler, Exception ex)  
            throws Exception;  
}

```

可以看到接口有3个方法，其含义如下：

preHandle：在执行action里面的处理逻辑之前执行，它返回的是boolean，这里如果我们返回true在接着执行postHandle和afterCompletion，如果我们返回false则中断执行。

postHandle：在执行action里面的逻辑后返回视图之前执行。

afterCompletion：在action返回视图后执行。

HandlerInterceptorAdapter适配器是Spring MVC为了方便我们使用HandlerInterceptor而对HandlerInterceptor 的默认实现，里面的3个方法没有做任何处理，在preHandle方法直接返回true，这样我们继承HandlerInterceptorAdapter后只需要实现3个方法中我们需要的方法即可，而不像继承HandlerInterceptor一样不管是否需要3个方法都要实现。

当然借助于HandlerInterceptor我们可以实现很多其它功能，比如日志记录、请求处理时间分析等，权限验证只是其中之一。


