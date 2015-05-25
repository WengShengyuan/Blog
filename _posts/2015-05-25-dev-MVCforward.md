---
layout: default
title: 关于MVC的进一步学习
comments: true
category: MVC
---


前一段第一次接触SpringMVC的时候，是学习与开发同时进行的，难免会留下一些坏习惯，使的代码结构不够标准。现将最近看到的文章总结的一些想法归纳一下。

## Controller代码精简

一般Controller的作用应该局限于连接前端Request以及后端服务的枢纽，不应该实现过多复杂的业务逻辑。甚至可以将前端Request直接传递到后端Service中进行处理。这样可以使Service的借口更为简洁，在参数变化的时候不需要轻易改动接口。
因此Controller - Service 之间的结构变为:

```java

@Controller
public class Controller {

	@RequestMapping(value= "/route")
	public ModelAndView route(HttpServletRequest request, HttpServletResponse response){
		service.processsRoute(request);
	}

}



public interface Service {
	public void processRoute(HttpServletRequest request) throws Exception;
}

```

## 页面与数据获取适当的分离

为数据获取通道专门开设Controller,类似于API。分离的好处有:

* 一般数据处理与生成需要一定的运行时间，而且若数据量很大的时候，页面生成时间更长， 因此将页面与数据处理分离，可以令页面返回更快，提高用户体验。

* 数据处理分离有助于解耦，这样在WEB以及APP共同开发的环境下，可以比较容易得实现代码复用。

* 目前许多前端MVC框架开发的案例均使用独立的数据获取，并将数据与前台DOM绑定的形式进行开发。

比如：

```java

//仅返回页面资源
@Controller
public class WebController {

	@RequestMapping(value= "/route")
	public ModelAndView route(HttpServletRequest request, HttpServletResponse response){
		ModelAndView model = new ModelAndView();
		model.setViewName("/web/route");
		return model;		
	}

}

//处理数据并返回数据实体
@Controller
@RequestMapping(value = "/api")
public class APIController{

	@RequestMapping(value= "/route")
	@ResponseBody
	public PageBean route(HttpServletRequest request, HttpServletResponse response){
		PageBean bean = APIservice.getDate(request);
		return bean;
	}

}

```

这样在页面中就可以使用ajax来异步加载数据了。

因此可以为模块开始WebController以及APIController分别处理请求。

## Service专注于实现逻辑，Dao专注于数据处理

比如登陆流程可以分为：用户名、密码匹配 -> 登陆状态修改 -> 日志记录 -> 获取用户权限 ... 等等几个步骤，每个步骤都可以专门在Dao中开辟接口。Service中依次调用即可。这样使得业务逻辑在Service代码中更为清晰。也便于调试。

## GenericDao中加入分页与排序的支持

### 分页

通过 `setFirstResult` 和 `setMaxResults`进行分页

```java

	@Override
	public List<T> findAll(int pageNo, int pageSize) throws Exception {
		List<T> resultList = null;
		try {
		    String sql = "from " + getPersistentClass().getName() + " obj";
		    TypedQuery<T> query = em
			    .createQuery(sql, this.getPersistentClass());
		    query.setFirstResult((pageNo-1)*pageSize);
		    query.setMaxResults(pageSize);
		    resultList = query.getResultList();
		} catch (Exception e) {
		    WifiLogUtil.wifiLogError("GenericDaoImpl.class findAll", e);
		    throw new SystemWifiException
		    ("查询数据库出错，请确认sql语句是否正确或者链接是否正确。");
		}
		return resultList;
	}

```

### 排序

通过拼接字符串的形式生成HQL实现
