---
layout: default
title: 搭建SpringMVC框架
comments: true
category: MVC
---


框架项目请跳转到: [springMVC](https://github.com/WengShengyuan/springMVC)

本文在他人框架配置文件的基础上，学习Spring框架的知识，同时也结合多篇博文对框架进行改进与增加工鞥，比如缓存、多数据源以及AOP实现缓存处理等内容。仅供交流。

*感谢ZBB， 老乡就是给力!*

# 基本配置

项目分为两个子项目:

* 父项目:project


* 子项目:web + core

## MAVEN 依赖

* pom.xml配置

首先父项目配置了底层的一些工具包依赖，以及定义了一些主要类库的版本，并声明了子模块。

子模块则标记了父模块，同时引入了自身的一些依赖库。声明了自身的封装方式:core(jar)、web(war)。

同时，web又引入了core。

因此生成整个项目时候，应该先生成core，再生成web.



** project -> pom.xml

```xml

<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.rails</groupId>
	<artifactId>vehicle</artifactId>
	<version>1.0</version>
	<packaging>pom</packaging>
	<properties>
		<java.version>1.6</java.version>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<postgresql.version>9.1-901.jdbc4</postgresql.version>
		<mysql.version>5.1.18</mysql.version>
		<slf4j.version>1.6.2</slf4j.version>
		<spring.version>3.2.2.RELEASE</spring.version>
		 <shiro.version>1.2.3</shiro.version>
		<thymeleaf.version>2.0.16</thymeleaf.version>
		<thymeleaf-spring.version>2.0.16</thymeleaf-spring.version>

		<!-- Java EE / Java SE dependencies -->
		<jsp.version>2.2</jsp.version>
		<jstl.version>1.2</jstl.version>
		<servlet.version>2.5</servlet.version>
		<javax-el.version>2.2</javax-el.version>
		<jaxb-impl.version>2.2.7-b63</jaxb-impl.version>
		<aspectj.version>1.7.2</aspectj.version>
		<webappDirectory>${project.build.directory}/${project.build.finalName}</webappDirectory>
	</properties>
	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>com.rails</groupId>
				<artifactId>core</artifactId>
				<version>1.0</version>
				<type>jar</type>
				<scope>compile</scope>
			</dependency>
			<dependency>
				<groupId>junit</groupId>
				<artifactId>junit</artifactId>
				<version>3.8.1</version>
				<scope>test</scope>
			</dependency>
			<dependency>
				<groupId>postgresql</groupId>
				<artifactId>postgresql</artifactId>
				<version>${postgresql.version}</version>
			</dependency>
			<dependency>
				<groupId>mysql</groupId>
				<artifactId>mysql-connector-java</artifactId>
				<version>${mysql.version}</version>
			</dependency>
		</dependencies>
	</dependencyManagement>
	<modules>
		<module>core</module>
		<module>web</module>
	</modules>
</project>

```


** core -> pom.xml

```xml

<?xml version="1.0"?>
<project
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"
	xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>com.rails</groupId>
		<artifactId>vehicle</artifactId>
		<version>1.0</version>
	</parent>
	<artifactId>core</artifactId>
	<name>core</name>
	<url>http://maven.apache.org</url>
	<dependencies>
		
		<!-- commons-collections -->
		<dependency>
			<groupId>commons-collections</groupId>
			<artifactId>commons-collections</artifactId>
			<version>3.2.1</version>
		</dependency>
		<dependency>
			<groupId>junit</groupId>
			<artifactId>junit</artifactId>
		</dependency>
		<dependency>
			<groupId>log4j</groupId>
			<artifactId>log4j</artifactId>
			<version>1.2.16</version>
		</dependency>
		<dependency>
			<groupId>org.slf4j</groupId>
			<artifactId>slf4j-api</artifactId>
			<version>${slf4j.version}</version>
		</dependency>
		<dependency>
			<groupId>org.slf4j</groupId>
			<artifactId>jcl-over-slf4j</artifactId>
			<version>${slf4j.version}</version>
		</dependency>
		<dependency>
			<groupId>org.slf4j</groupId>
			<artifactId>slf4j-log4j12</artifactId>
			<version>${slf4j.version}</version>
		</dependency>
		<dependency>
			<groupId>com.sun.xml.bind</groupId>
			<artifactId>jaxb-impl</artifactId>
			<version>${jaxb-impl.version}</version>
			<scope>provided</scope>
		</dependency>
		<dependency>
			<groupId>org.apache.commons</groupId>
			<artifactId>commons-lang3</artifactId>
			<version>3.0.1</version>
		</dependency>
		<!-- servlet -->
		<dependency>
			<groupId>javax.servlet</groupId>
			<artifactId>servlet-api</artifactId>
			<version>${servlet.version}</version>
			<scope>provided</scope>
		</dependency>
		<!-- jstl -->
		<dependency>
			<groupId>javax.servlet</groupId>
			<artifactId>jstl</artifactId>
			<version>${jstl.version}</version>
		</dependency>
		<dependency>
			<groupId>javax.servlet.jsp</groupId>
			<artifactId>jsp-api</artifactId>
			<version>${jsp.version}</version>
			<scope>provided</scope>
		</dependency>


		<!-- Spring dependencies -->
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-core</artifactId>
			<version>${spring.version}</version>
			<exclusions>
				<exclusion>
					<groupId>commons-logging</groupId>
					<artifactId>commons-logging</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-context</artifactId>
			<version>${spring.version}</version>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-jdbc</artifactId>
			<version>${spring.version}</version>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-beans</artifactId>
			<version>${spring.version}</version>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-web</artifactId>
			<version>${spring.version}</version>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-expression</artifactId>
			<version>${spring.version}</version>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-orm</artifactId>
			<version>${spring.version}</version>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-test</artifactId>
			<version>${spring.version}</version>
			<scope>provided</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-aop</artifactId>
			<version>${spring.version}</version>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-aspects</artifactId>
			<version>${spring.version}</version>
		</dependency>

		<dependency>
			<groupId>javax.validation</groupId>
			<artifactId>validation-api</artifactId>
			<version>1.0.0.GA</version>
		</dependency>
		<dependency>
			<groupId>cglib</groupId>
			<artifactId>cglib-nodep</artifactId>
			<version>2.2.2</version>
		</dependency>
		<dependency>
			<groupId>org.aspectj</groupId>
			<artifactId>aspectjrt</artifactId>
			<version>${aspectj.version}</version>
		</dependency>
		<dependency>
			<groupId>org.aspectj</groupId>
			<artifactId>aspectjweaver</artifactId>
			<version>${aspectj.version}</version>
		</dependency>
		<dependency>
			<groupId>javax.transaction</groupId>
			<artifactId>jta</artifactId>
			<version>1.1</version>
		</dependency>

		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-webmvc</artifactId>
			<version>${spring.version}</version>
		</dependency>

		<dependency>
			<groupId>commons-digester</groupId>
			<artifactId>commons-digester</artifactId>
			<version>2.1</version>
			<exclusions>
				<exclusion>
					<groupId>commons-logging</groupId>
					<artifactId>commons-logging</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
		<dependency>
			<groupId>commons-fileupload</groupId>
			<artifactId>commons-fileupload</artifactId>
			<version>1.2.2</version>
		</dependency>
		<dependency>
			<groupId>org.apache.commons</groupId>
			<artifactId>commons-io</artifactId>
			<version>1.3.2</version>
		</dependency>
		<dependency>
			<groupId>javax.servlet.jsp.jstl</groupId>
			<artifactId>jstl-api</artifactId>
			<version>1.2</version>
		</dependency>
		<dependency>
			<groupId>org.glassfish.web</groupId>
			<artifactId>jstl-impl</artifactId>
			<version>1.2</version>
		</dependency>
		<dependency>
			<groupId>javax.el</groupId>
			<artifactId>el-api</artifactId>
			<version>1.0</version>
			<scope>provided</scope>
		</dependency>
		<dependency>
			<groupId>commons-codec</groupId>
			<artifactId>commons-codec</artifactId>
			<version>1.5</version>
		</dependency>

		<!-- JAX-RS Libraries -->
		<dependency>
			<groupId>com.sun.jersey</groupId>
			<artifactId>jersey-json</artifactId>
			<version>1.11</version>
			<type>jar</type>
			<scope>compile</scope>
		</dependency>
		<dependency>
			<groupId>com.sun.jersey.contribs</groupId>
			<artifactId>jersey-spring</artifactId>
			<version>1.11</version>
			<type>jar</type>
			<scope>compile</scope>
			<exclusions>
				<exclusion>
					<groupId>org.springframework</groupId>
					<artifactId>spring-aop</artifactId>
				</exclusion>
				<exclusion>
					<groupId>org.springframework</groupId>
					<artifactId>spring-context</artifactId>
				</exclusion>
				<exclusion>
					<groupId>org.springframework</groupId>
					<artifactId>spring-beans</artifactId>
				</exclusion>
				<exclusion>
					<groupId>org.springframework</groupId>
					<artifactId>spring-core</artifactId>
				</exclusion>
				<exclusion>
					<artifactId>spring-web</artifactId>
					<groupId>org.springframework</groupId>
				</exclusion>
			</exclusions>
		</dependency>
		<dependency>
			<groupId>com.sun.jersey</groupId>
			<artifactId>jersey-server</artifactId>
			<version>1.11</version>
		</dependency>
		<dependency>
			<groupId>com.sun.jersey</groupId>
			<artifactId>jersey-client</artifactId>
			<version>1.11</version>
		</dependency>
		<dependency>
			<groupId>javax.ws.rs</groupId>
			<artifactId>jsr311-api</artifactId>
			<version>1.1.1</version>
		</dependency>

		<!-- hibernate4 -->
		<dependency>
			<groupId>org.hibernate</groupId>
			<artifactId>hibernate-core</artifactId>
			<version>4.2.5.Final</version>
		</dependency>
		<dependency>
			<groupId>org.hibernate</groupId>
			<artifactId>hibernate-entitymanager</artifactId>
			<version>4.2.5.Final</version>
		</dependency>
		<dependency>
			<groupId>org.hibernate</groupId>
			<artifactId>hibernate-ehcache</artifactId>
			<version>4.2.5.Final</version>
		</dependency>
		<dependency>
			<groupId>com.googlecode.ehcache-spring-annotations</groupId>
			<artifactId>ehcache-spring-annotations</artifactId>
			<version>1.2.0</version>
		</dependency>
		<dependency>
			<groupId>org.hibernate.javax.persistence</groupId>
			<artifactId>hibernate-jpa-2.0-api</artifactId>
			<version>1.0.1.Final</version>
		</dependency>
		<dependency>
			<groupId>org.hibernate</groupId>
			<artifactId>hibernate-validator</artifactId>
			<version>4.2.0.Final</version>
			<exclusions>
				<exclusion>
					<groupId>javax.xml.bind</groupId>
					<artifactId>jaxb-api</artifactId>
				</exclusion>
				<exclusion>
					<groupId>com.sun.xml.bind</groupId>
					<artifactId>jaxb-impl</artifactId>
				</exclusion>
			</exclusions>
		</dependency>

		<dependency>
			<groupId>org.codehaus.jackson</groupId>
			<artifactId>jackson-mapper-asl</artifactId>
			<version>1.9.11</version>
		</dependency>


		<!-- shiro -->
		<dependency>
			<groupId>org.apache.shiro</groupId>
			<artifactId>shiro-core</artifactId>
			<version>${shiro.version}</version>
		</dependency>
		<dependency>
			<groupId>org.apache.shiro</groupId>
			<artifactId>shiro-web</artifactId>
			<version>${shiro.version}</version>
		</dependency>
		<dependency>
			<groupId>org.apache.shiro</groupId>
			<artifactId>shiro-spring</artifactId>
			<version>${shiro.version}</version>
		</dependency>
		<dependency>
			<groupId>org.apache.shiro</groupId>
			<artifactId>shiro-ehcache</artifactId>
			<version>${shiro.version}</version>
		</dependency>
		<!-- my custom ehcache-->
		<dependency>
			<groupId>net.sf.ehcache</groupId>
			<artifactId>ehcache-core</artifactId>
			<version>2.4.1</version>
		</dependency>
		 
		
		<dependency>
			<groupId>org.apache.shiro</groupId>
			<artifactId>shiro-aspectj</artifactId>
			<version>${shiro.version}</version>
		</dependency>
		<dependency>
			<groupId>org.apache.shiro</groupId>
			<artifactId>shiro-quartz</artifactId>
			<version>${shiro.version}</version>
		</dependency>
		<!-- shiro cas -->
		<dependency>
			<groupId>org.apache.shiro</groupId>
			<artifactId>shiro-cas</artifactId>
			<version>${shiro.version}</version>
		</dependency>
		<!-- thymeleaf-shiro -->
		<dependency>
			<groupId>com.github.theborakompanioni</groupId>
			<artifactId>thymeleaf-extras-shiro</artifactId>
			<version>1.1.0</version>
		</dependency>
		<!-- thymeleaf -->
		<dependency>
			<groupId>org.thymeleaf</groupId>
			<artifactId>thymeleaf</artifactId>
			<version>${thymeleaf.version}</version>
		</dependency>
		<dependency>
			<groupId>org.thymeleaf</groupId>
			<artifactId>thymeleaf-spring3</artifactId>
			<version>${thymeleaf-spring.version}</version>
		</dependency>
		
		
		<!-- freemarker <dependency> <groupId>org.freemarker</groupId> <artifactId>freemarker</artifactId> 
			<version>2.3.19</version> </dependency> -->


		<!-- PostgreSQL -->
		<dependency>
			<groupId>postgresql</groupId>
			<artifactId>postgresql</artifactId>
		</dependency>

		<!-- mysql -->
		<dependency>
			<groupId>mysql</groupId>
			<artifactId>mysql-connector-java</artifactId>
		</dependency>

		<dependency>
			<groupId>c3p0</groupId>
			<artifactId>c3p0</artifactId>
			<version>0.9.1.2</version>
		</dependency>
		<dependency>
			<groupId>ant</groupId>
			<artifactId>ant</artifactId>
			<version>1.4.1</version>
		</dependency>
		<dependency>
			<groupId>net.lingala.zip4j</groupId>
			<artifactId>zip4j</artifactId>
			<version>1.3.1</version>
		</dependency>

	</dependencies>
	<build>
		<finalName>core</finalName>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
				<configuration>
					<source>1.6</source>
					<target>1.6</target>
				</configuration>
			</plugin>
		</plugins>
	</build>
</project>

```

** web -> pom.xml

```xml

<?xml version="1.0"?>
<project
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"
	xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>com.rails</groupId>
		<artifactId>vehicle</artifactId>
		<version>1.0</version>
	</parent>
	<artifactId>web</artifactId>
	<packaging>war</packaging>
	<name>web</name>
	<url>http://maven.apache.org</url>
	<dependencies>
		<dependency>
			<groupId>com.rails</groupId>
			<artifactId>core</artifactId>
		</dependency>
	</dependencies>
	<build>
		<finalName>web</finalName>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
				<configuration>
					<source>1.6</source>
					<target>1.6</target>
				</configuration>
			</plugin>
		</plugins>
	</build>
</project>


```



## web.xml

`web.xml`文件赋予了web工程spring特性。是整个web工程配置的入口。用于引入模块配置，以及增加一些web的过滤器。

本工程将各模块配置分成不同的`applicationContext-xxx。xml`进行配置。

```xml

<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns="http://java.sun.com/xml/ns/javaee" xmlns:web="http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd"
	xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd"
	id="WebApp_ID" version="2.5">
	<display-name>web</display-name>
	<context-param>
		<param-name>webAppRootKey</param-name>
		<param-value>web.root</param-value>
	</context-param>
	<context-param>
		<param-name>patchConfigLocation</param-name>
		<param-value>
		 	/WEB-INF/applicationContext.xml
        </param-value>
	</context-param>
	<listener>
		<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
	</listener>
	<listener>
		<listener-class>org.springframework.web.context.request.RequestContextListener</listener-class>
	</listener>
	<listener>
		<listener-class>org.springframework.web.util.Log4jConfigListener</listener-class>
	</listener>
	
	<!-- log4j 
	<context-param>
		<param-name>log4jConfigLocation</param-name>
		<param-value>WEB-INF/classes/log4j.properties</param-value>
	</context-param>-->
	
	
	<filter>
		<filter-name>CharacterEncodingFilter</filter-name>
		<filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
		<init-param>
			<param-name>encoding</param-name>
			<param-value>UTF-8</param-value>
		</init-param>
		<init-param>
			<param-name>forceEncoding</param-name>
			<param-value>true</param-value>
		</init-param>
	</filter>
	<filter-mapping>
		<filter-name>CharacterEncodingFilter</filter-name>
		<url-pattern>/*</url-pattern>
	</filter-mapping>
	
	<!-- filter>
		<filter-name>shiroFilter</filter-name>
		<filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
		<init-param>
			<param-name>targetFilterLifecycle</param-name>
			<param-value>true</param-value>
		</init-param>
	</filter>
	<filter-mapping>
		<filter-name>shiroFilter</filter-name>
		<url-pattern>/*</url-pattern>
	</filter-mapping -->

	<servlet>
		<servlet-name>dispatcher</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<param-value>
                /WEB-INF/applicationContext-servlet.xml
            </param-value>
		</init-param>
		<load-on-startup>1</load-on-startup>
	</servlet>
	<servlet-mapping>
		<servlet-name>dispatcher</servlet-name>
		<url-pattern>/*</url-pattern>
	</servlet-mapping>
	<servlet>
		<servlet-name>JerseyServlet</servlet-name>
		<servlet-class>com.sun.jersey.spi.spring.container.servlet.SpringServlet</servlet-class>
		<init-param>
			<param-name>com.sun.jersey.config.property.packages</param-name>
			<param-value>org.company</param-value>
		</init-param>
	</servlet>
	<servlet-mapping>
		<servlet-name>JerseyServlet</servlet-name>
		<url-pattern>/api/*</url-pattern>
	</servlet-mapping>
</web-app>

```




## applicationContext

* springMVC管理web - applicationContext-servlet.xml

```xml

<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:aop="http://www.springframework.org/schema/aop" xmlns:mvc="http://www.springframework.org/schema/mvc"
	xmlns:ehcache="http://ehcache-spring-annotations.googlecode.com/svn/schema/ehcache-spring"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans-3.2.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context-3.2.xsd
       http://www.springframework.org/schema/aop
       http://www.springframework.org/schema/aop/spring-aop-3.2.xsd
       http://www.springframework.org/schema/mvc
       http://www.springframework.org/schema/mvc/spring-mvc-3.2.xsd
       http://ehcache-spring-annotations.googlecode.com/svn/schema/ehcache-spring http://ehcache-spring-annotations.googlecode.com/svn/schema/ehcache-spring/ehcache-spring-1.1.xsd">



	<!-- 只扫描Controller 注解 -->
	<context:component-scan base-package="org.company.web"
		use-default-filters="false">
		<context:include-filter type="annotation"
			expression="org.springframework.stereotype.Controller" />
		<context:exclude-filter type="annotation"
			expression="org.springframework.stereotype.Service" />
	</context:component-scan>

	<!-- Allow annotation driven controllers -->
	<mvc:annotation-driven />

	<!-- 配置js，css等静态文件直接映射到对应的文件夹，不被DispatcherServlet处理 -->
	<mvc:resources location="/resources/" mapping="/resources/**" />
	<mvc:resources location="/resources/js/" mapping="/js/**" />
	<mvc:resources location="/resources/css/" mapping="/css/**" />
	<mvc:resources location="/resources/images/" mapping="/images/**" />
	<mvc:resources location="/resources/fonts/" mapping="/fonts/**" />
	<bean id="templateResolver"
		class="org.thymeleaf.templateresolver.ServletContextTemplateResolver">
		<property name="prefix" value="/WEB-INF/page/" />
		<property name="suffix" value=".html" />
		<property name="templateMode" value="XHTML" />
		<property name="cacheable" value="false" /><!-- 是否开启缓存,开发模式下关闭,部署时应该打开 -->
		<property name="characterEncoding" value="UTF-8" />
	</bean>

	<bean id="templateEngine" class="org.thymeleaf.spring3.SpringTemplateEngine">
		<property name="templateResolver" ref="templateResolver" />
		<property name="additionalDialects">
			<set>
				<bean class="at.pollux.thymeleaf.shiro.dialect.ShiroDialect" />
			</set>
		</property>
	</bean>


	<bean class="org.thymeleaf.spring3.view.ThymeleafViewResolver">
		<property name="templateEngine" ref="templateEngine" />
		<property name="order" value="1" />
		<property name="characterEncoding" value="UTF-8" />
	</bean>

	<!-- 避免IE执行AJAX时,返回JSON出现下载文件 -->
	<bean id="mappingJacksonHttpMessageConverter"
		class="org.springframework.http.converter.json.MappingJacksonHttpMessageConverter">
		<property name="supportedMediaTypes">
			<list>
				<value>text/html;charset=UTF-8</value>
			</list>
		</property>
	</bean>

	<!-- 配置 文件上传的支持 ,最大上传文件大小1G -->
	<bean id="multipartResolver"
		class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
		<property name="maxUploadSize" value="1024000000" />
		<property name="resolveLazily" value="true" />
		<property name="maxInMemorySize" value="4096" />
	</bean>

	<!-- 采用SpringMVC自带的JSON转换工具，支持@ResponseBody注解 -->
	<bean
		class="org.springframework.web.servlet.mvc.annotation.AnnotationMethodHandlerAdapter">
		<property name="messageConverters">
			<list>
				<bean
					class="org.springframework.http.converter.json.MappingJacksonHttpMessageConverter" />
			</list>
		</property>
	</bean>
</beans>


```

* spring数据与逻辑

	** applicationContext.xml 
	
```xml

<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:jee="http://www.springframework.org/schema/jee"
	xmlns:aop="http://www.springframework.org/schema/aop" xmlns:tx="http://www.springframework.org/schema/tx"
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="
        http://www.springframework.org/schema/jee
        http://www.springframework.org/schema/jee/spring-jee-3.2.xsd
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans-3.2.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context-3.2.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx-3.2.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop-3.2.xsd">


	<import resource="applicationContext-datasource.xml" />

	<!-- 加载*.properties File -->
	<bean id="webConfig"
		class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
		<property name="locations">
			<list>
				<value>classpath:*.properties</value>
			</list>
		</property>
	</bean>
	
	<!-- 扫描的包路径 去掉mvc的注解 -->
	<context:component-scan base-package="org.company">
		<context:exclude-filter type="annotation"
			expression="org.springframework.stereotype.Controller" />
	</context:component-scan> 
	
	
	
    
	<import resource="applicationContext-ehcache.xml" />
	
	
	
	
	<!-- AOP 的最终配置 -->
	<!-- BEAN与find/get 拦截器关联 -->
	<bean id="myService" class="org.springframework.aop.framework.ProxyFactoryBean">
		<property name="target">
			<ref local="testTableServiceBean" />
		</property>
		<property name="interceptorNames">
			<list>
				<value>methodCachePointCut</value>
				<value>methodCachePointCutAdvice</value>
			</list>
		</property>
	</bean>
	
	
	<!-- 拦截BEAN -->
	<bean id="testTableServiceBean" class="org.company.core.moduel.service.TestTableServiceImpl">
	</bean>
	
	
	
</beans>

```
	
	** applicationContext-database.xml
	
```xml

<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:tx="http://www.springframework.org/schema/tx"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:aop="http://www.springframework.org/schema/aop"
	xsi:schemaLocation="
		http://www.springframework.org/schema/beans 
		http://www.springframework.org/schema/beans/spring-beans-3.2.xsd 
	    http://www.springframework.org/schema/context
      	 http://www.springframework.org/schema/context/spring-context-3.2.xsd
		http://www.springframework.org/schema/tx 
		http://www.springframework.org/schema/tx/spring-tx-3.2.xsd
		http://www.springframework.org/schema/aop 
		http://www.springframework.org/schema/aop/spring-aop-3.2.xsd">
	
	
	<bean id="entityManagerFactory"
		class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean">
		<property name="dataSource" ref="dataSource" />
		<property name="persistenceProvider" ref="persistenceProvider" />
		<property name="jpaVendorAdapter" ref="jpaVendorAdapter" />
		<property name="jpaDialect" ref="jpaDialect" />
		<property name="jpaProperties">
			<props>
				<prop key="hibernate.show_sql">true</prop>
			</props>
		</property>
		 <property name="packagesToScan">  
	        <list>  
	           <value>org.company.core</value>  
	        </list>  
      </property>  
	</bean>
	
	<bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource"
		destroy-method="close">
		<property name="driverClass" value="com.mysql.jdbc.Driver" />
		<property name="jdbcUrl" value="jdbc:mysql://localhost:3306/webdata?characterEncoding=utf-8" />
		<property name="user" value="root" />
		<property name="password" value="123456" />
	</bean>
	
	<bean id="persistenceProvider" class="org.hibernate.ejb.HibernatePersistence" />

	<bean id="jpaVendorAdapter"
		class="org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter">
		<property name="generateDdl" value="true" />
		<property name="database" value="MYSQL" />
	</bean>
	<bean id="jpaDialect" class="org.springframework.orm.jpa.vendor.HibernateJpaDialect" />


	<context:annotation-config />
	
	<!--事务管理Bean -->
	<bean id="transactionManager" class="org.springframework.orm.jpa.JpaTransactionManager">
		<property name="entityManagerFactory" ref="entityManagerFactory" />
	</bean>
	
	<!--说明事务的配置使用的注解方式 -->
	<tx:annotation-driven transaction-manager="transactionManager" />


</beans>


```

	** applicationContext-ehcache.xml

```xml

<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:jee="http://www.springframework.org/schema/jee"
	xmlns:aop="http://www.springframework.org/schema/aop" xmlns:tx="http://www.springframework.org/schema/tx"
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="
        http://www.springframework.org/schema/jee
        http://www.springframework.org/schema/jee/spring-jee-3.2.xsd
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans-3.2.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context-3.2.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx-3.2.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop-3.2.xsd">
        
       
	
	<!-- Ehcache -->
	<bean id="cacheManager"
		class="org.springframework.cache.ehcache.EhCacheManagerFactoryBean">
	</bean>
	<bean id="demoCache" class="org.springframework.cache.ehcache.EhCacheFactoryBean">
		<property name="cacheManager" ref="cacheManager" />
		<property name="cacheName">
			<value>MYCACHE</value>
		</property>
	</bean>
	
	<context:annotation-config />
	<aop:aspectj-autoproxy proxy-target-class="true"/>
	
	
	<!-- find/create cache拦截器 -->  
	<bean id="methodCacheInterceptor" class="org.company.core.common.interceptor.MethodCacheInterceptor">
		<property name="cache">
			<ref local="demoCache" />
		</property>
	</bean>
	<!-- flush cache拦截器 -->  
    <bean id="methodCacheAfterAdvice" class="org.company.core.common.interceptor.MethodCacheAfterAdvice">  
      <property name="cache">  
        <ref local="demoCache" />  
      </property>  
    </bean>  
	
	
	
	
	<!-- find/get cache拦截器方法匹配 -->
	<bean id="methodCachePointCut"
		class="org.springframework.aop.support.RegexpMethodPointcutAdvisor">
		<property name="advice">
			<ref local="methodCacheInterceptor" />
		</property>
		<property name="patterns">
			<list>
				<value>org.company.core.*.service.*find.*</value>
			</list>
		</property>
	</bean>
	<!-- flush 拦截器方法匹配  -->
	<bean id="methodCachePointCutAdvice" 
		class="org.springframework.aop.support.RegexpMethodPointcutAdvisor">  
      <property name="advice">  
        <ref local="methodCacheAfterAdvice"/>  
      </property>  
      <property name="patterns">  
        <list>  
          <value>org.company.core.*.service.*create.*</value>  
          <value>org.company.core.*.service.*update.*</value>  
          <value>org.company.core.*.service.*delete.*</value>  
        </list>  
      </property>  
    </bean>
	
</beans>

```


实现效果如图:

![]({{site.baseurl}}/images/post_images/2015-04-22-dev-ConstructionOfSpringMVC/IMG_3822.JPG)



