---
layout: default
title: JPA下利于快速开发、灵活变化的表查询及业务处理程序结构设计
comments: true
category: java
---


*主要使用场景：实体具有多种状态，状态转换路径多，状态转换业务处理相对复杂*


## 1 适用场景

典型的使用场景即订单处理场景。
在用户从购买商品，商户处理订单，发货，物流配送，用户收货，用户确认，用户退货\退款，商户退款，交易关闭等等一系列流程中，订单会在不同阶段表现为不同的状态。
而这些状态用订单实体本身的一个或者多个字段不同值的组合来表示。


如果在业务处理时通过简单的：查询实体 -> 修改所有相关字段 -> 保存，这样实现业务逻辑处理以及数据更新的话，有如下缺点：

* 查询每一种状态的实体列表需要记住所有的关键字段组合，如果写错就会造成查询结果不准确，并且难以发现。

* 很容易因疏忽造成代码错误，比如：漏改一个字段，改错状态码等等。

* 每一项业务流程处理的开始状态和结束状态不可控，比如：用户新提交订单是不可以被直接关闭交易的，如果需要实现这一约束，就应该在关闭交易的业务代码中特别声明。若状态很多，业务处理逻辑很多的情况下，很容易遗漏约束，造成业务逻辑处理错误。

* 在开发过程中，若增加一个状态、修改一个业务逻辑的起止状态需要大量的代码修改，极易造成业务逻辑处理错误。

这里简要以订单表为例（明细、物流、退货退款等表格略）。假设订单有以下几种状态，状态间有箭头则表示
允许通过业务操作转换状态，否则不允许。

![]({{site.baseurl}}/images/post_images/2015-08-01-dev-quickOrderDesign/order.jpg)


## 2 总体设计

设计大致分为：查询过程优化、设计查询参数数据结构、引入状态设计模式(State Design Pattern)、增加业务管理层。

### 2.1 查询过程优化

JPA查询通过编写HQL完成，通过封装查询方法，实现输入<字段,目标值>的键值对并自动生成HQL完成查询的过程，省去了编写HQL的工作量，对外部调用来说，是查询条件代码更清晰。

代码如下：


```java

// 构造HashMap<String, Object>来存储查询条件键值对作为输入
// 实现了"SELECT FROM XXXX WHERE KEY1 = VALUE1 AND KEY2 = VALUE2 ...."查询

	@Override
	public List<T> queryByStringEqualMap(HashMap<String, Object> map)
			throws Exception {
		List<T> resultList = null;
		try {
			StringBuilder sql = new StringBuilder("SELECT o from "
					+ getPersistentClass().getName() + " o WHERE ");
			StringBuilder conStr = new StringBuilder("");
			// 拼接条件
			for (String key : map.keySet()) {
				Object value = map.get(key);
				conStr = conStr.append(String.format(" o.%s = :%s and", key,
						key));
			}

			sql.append(conStr.toString().substring(0, conStr.length() - 4));
			Query query = em.createQuery(sql.toString());
			for (String key : map.keySet()) {
				query = query.setParameter(key, map.get(key));
			}
			resultList = query.getResultList();
		} catch (Exception e) {
			throw new Exception("查询数据库出错，请确认sql语句是否正确或者链接是否正确。"
					+ e.getMessage());
		}
		if (resultList == null || (resultList != null && resultList.size() < 1)) {
			return resultList;
			// throw new BusinessWifiException("查询结果为空");
		} else
			return resultList;
	}
	
	
// 查询的一般过程

	HashMap<String, Object> map = new HashMap<String, Object>();
	map.put("KEY1", VALUE1);
	map.put("KEY2", VALUE2);

	List<Entity> results = entityDao.queryByStringEqualMap(map);

```


### 2.2 设计查询参数数据结构

章节2.1中的查询方法若应用在订单表等应用场景中时，仍然无法避免需要记住大量状态对应的字段以及常量值的问题，如果常量值输入错误，结果也是不正确的。

因此，除了设计静态常量解决以外，可以针对订单表设计支持链式操作的数据结构在实现查询条件的快速拼接。比如：

```java

//订单表的查询条件链式结构设计（结合了常量枚举类）
public class OrderProductChainningMap {
	
	private HashMap<String, Object> map ;
	
	public OrderProductChainningMap(){
		this.map = new HashMap<String, Object>();
	}
	
	
	//支付方式：现金、网络支付
	public OrderProductChainningMap setOrderPayType_CASH() {
		this.map.put("orderPayType", OrderProductEnum.ORDERPAYTYPE_CASH.getCode_string());
		return this;
	}
	public OrderProductChainningMap setOrderPayType_NOCASH() {
		this.map.put("orderPayType", OrderProductEnum.ORDERPAYTYPE_NOCASH.getCode_string());
		return this;
	}
	
	
	
	//状态：未支付、已支付、接单、拒单、配送中、确认收货
	public OrderProductChainningMap setOrderState_UNPAID() {
		this.map.put("orderState", OrderProductEnum.ORDERSTATE_UNPAID.getCode_string());
		return this;
	}
	public OrderProductChainningMap setOrderState_PAID() {
		this.map.put("orderState", OrderProductEnum.ORDERSTATE_PAID.getCode_string());
		return this;
	}
	public OrderProductChainningMap setOrderState_ACCEPTED() {
		this.map.put("orderState", OrderProductEnum.ORDERSTATE_ACCEPTED.getCode_string());
		return this;
	}
	public OrderProductChainningMap setOrderState_REJECTED() {
		this.map.put("orderState", OrderProductEnum.ORDERSTATE_REJECTED.getCode_string());
		return this;
	}
	public OrderProductChainningMap setOrderState_SHIFTING() {
		this.map.put("orderState", OrderProductEnum.ORDERSTATE_SHIFTING.getCode_string());
		return this;
	}
	public OrderProductChainningMap setOrderState_SHIFTCONFIRM() {
		this.map.put("orderState", OrderProductEnum.ORDERSTATE_SHIFTCONFIRM.getCode_string());
		return this;
	}
	
	
	
	
	//有效标志：有效、无效
	public OrderProductChainningMap setValidFlag_FALSE() {
		this.map.put("validFlag", OrderProductEnum.VALIDFLAG_FALSE.getCode_string());
		return this;
	}
	public OrderProductChainningMap setValidFlag_TRUE() {
		this.map.put("validFlag", OrderProductEnum.VALIDFLAG_TRUE.getCode_string());
		return this;
	}
	
	
	
	//其他字段条件设置
	public OrderProductChainningMap setMap(String key, Object obj) {
		this.map.put(key, obj);
		return this;
	}
	public HashMap<String,Object> getMap() {
		return this.map;
	}
}

```

可以看到，该结构的核心仍然是HashMap<String, Object>，只是外包了一层，将属性设置通过方法表现，并返回结构自身。因此，可以连续设置查询条件。
方法如下：

```java

OrderProductChainningMap map = new OrderProductChainningMap();

//有效，未支付，现金支付的订单条件:
map	.setValidFalg_TRUE()
	.setOrderState_UNPAID()
	.setOrderPayType_CASH();

List<Entity> result = entityDao.queryByStringEqualMap(map.getMap());


```

### 2.3 引入状态设计模式

状态模式由：状态接口、状态类、实体包装共同实现。

* 状态接口：预设所有状态下可能的业务操作。
* 状态类：该状态下的业务操作具体实现。
* 实体包装：包含实体、以及当前实体所处的状态，提供依据状态对实体的业务操作。

主要执行顺序如下：

* 1.从数据库中查询数据实体Entity，包装成实体包装Wrapper，并根据实体数据设置状态State。
* 2.对实体的业务操作通过包装操作，而包装通过当前状态类的具体业务操作代码实现。(Wrapper -> state -> doSth))

如图所示：

原Controller - Service - Dao 模式：

![]({{site.baseurl}}/images/post_images/2015-08-01-dev-quickOrderDesign/CSDPattern.jpg)

嵌入State Pattern Design的状态模式：

![]({{site.baseurl}}/images/post_images/2015-08-01-dev-quickOrderDesign/stateDesign.jpg)

代码结构如下：

#### 2.3.1 接口

```java

public Interface IOrderState {

	/**
	 * 拒单
	 * @param user
	 * @throws Exception
	 */
	public void rejectOrder(UserInfo user) throws Exception;
	
		
	/**
	 * 派送
	 * @param user
	 * @throws Exception
	 */
	public void deliverOrder(UserInfo user) throws Exception;
	
	/**
	 * 取消订单
	 * @param customer
	 * @throws Exception
	 */
	public void cancelOrder(Customer customer) throws Exception;
	
		
	/**
	 * 确认收货
	 * @param customer
	 * @throws Exception
	 */
	public void deliverConfirm(Customer customer) throws Exception;
	
	
}

```

#### 2.3.2 状态类

状态类中定义业务操作逻辑，并可以控制当前状态是否允许对实体进行某些操作，操作后的状态转移。

代码如下（新订单状态举例）：

```java

/**
 * 新订单状态实体类
 */
public class OfflineNew implements IOrderProductState {
	
	OrderProductWrapper order;
	
	public OfflineNew(OrderProductWrapper order){
		this.order = order;
	}

	@Override
	public void rejectOrder(UserInfo user) throws Exception {
		// 订单有效标志置为无效
		this.order.getOrder().setValidFlag(OrderProductEnum.VALIDFLAG_FALSE.getCode_string());
		this.order.setState(this.order.getRejected());
	}

	
	@Override
	public void cancelOrder(Customer customer) throws Exception {
		//订单有效标志置为无效
		this.order.getOrder().setValidFlag(OrderProductEnum.VALIDFLAG_FALSE.getCode_string());
		this.order.setState(this.order.getCanceled());
	}

	
	//新订单未配送，因此不能进行确认收货操作，因此如果在此状态下调用该操作将报错退出
	@Override
	public void deliverConfirm(Customer customer) throws Exception {
		throw new Exception("Method rejected");		
	}

	
	@Override
	public void deliverOrder(UserInfo user) throws Exception {
		//改变状态至配送中
		this.order.getOrder().setOrderState(OrderProductEnum.ORDERSTATE_SHIFTING.getCode_string());
		this.order.setState(this.order.getShifting());
	}

}

```

#### 2.3.3 实体包装

承载订单实体以及订单状态信息的包装类，并在类中开辟了操作方法，具体实现应该在状态类中实现。

```java

public class OrderProductWrapper {
	
	OrderProduct order;
	IOrderProductState state;
		
	IOrderProductState canceled;
	IOrderProductState offlineNew;
	IOrderProductState rejected;
	IOrderProductState shiftConfirm;
	IOrderProductState shifting;
	
	
	public OrderProductWrapper(OrderProduct order){
		this.order = order;
		
		canceled = new Canceled(this);
		offlineNew = new OfflineNew(this);
		rejected = new Rejected(this);
		shiftConfirm = new ShiftConfirm(this);
		shifting = new Shifting(this);
		
		setCurrentState();
	}
	
	public OrderProductWrapper(OrderProduct order, List<OrderPdetail> details) {
		this.order = order;
		this.details = details;
		
		canceled = new Canceled(this);
		offlineNew = new OfflineNew(this);
		rejected = new Rejected(this);
		shiftConfirm = new ShiftConfirm(this);
		shifting = new Shifting(this);
		
		setCurrentState();
	}
	
	/**
	 * 拒单
	 * @param user
	 * @throws Exception
	 */
	public void rejectOrder(UserInfo user) throws Exception{
		state.rejectOrder(user);
	}
	
	public void deliverOrder(UserInfo user) throws Exception {
		state.deliverOrder(user);
	}
	
	/**
	 * 取消订单
	 * @param customer
	 * @throws Exception
	 */
	public void cancelOrder(Customer customer) throws Exception{
		state.cancelOrder(customer);
	}
	
	
	
	/**
	 * 确认收货
	 * @param customer
	 * @throws Exception
	 */
	public void deliverConfirm(Customer customer) throws Exception{
		state.deliverConfirm(customer);
	}
	
	
	/**
	 * 根据订单实体设置该包装的初始状态
	 */
	private void setCurrentState(){
		
		//不明述，主要是根据数据库查询的实体 order 的相关字段的值来设置当前订单的状态 state
		//这样就可以在相应的方法中利用state进行实体操作：state.doSth();
		
		/*
		 * state setting
		 */
		setState(XXXState);
		
	}

	public OrderProduct getOrder() {
		return order;
	}

	public void setOrder(OrderProduct order) {
		this.order = order;
	}

	
	public void setState(IOrderProductState newState){
		this.state = newState;
	}

	public IOrderProductState getAccepted(){
		return accepted;
	}
	
	public IOrderProductState getCanceled(){
		return canceled;
	}
	
	public IOrderProductState getOfflineNew(){
		return offlineNew;
	}
	
	public IOrderProductState getOnlineNew(){
		return onlineNew;
	}
	
	public IOrderProductState getPaid(){
		return paid;
	}
	
	public IOrderProductState getRejected(){
		return rejected;
	}
	
	public IOrderProductState getShiftConfirm(){
		return shiftConfirm;
	}
	
	public IOrderProductState getShifting(){
		return shifting;
	}
	
}


```

### 2.4 增加业务管理层

由于整个订单处理操作涉及多张表，多个关联操作，因此针对
订单、订单明细、发\退货、支付日志....的连续操作都通过管理器统一协调。保证了这个业务调度的完整性，并最终由
管理器完成数据的持久化。

在这里，只需从数据库中读取实体，进行包装，执行业务操作并写回数据库即可。无需关心某个实体是否可以执行某个操作，因为具体的操作，以及是否可以执行这些操作都已经在状态模式中做好了设计。

```java

public class OrderProcessManager {

	@Resource(name = "OrderProductServiceImpl")
	private OrderProductService orderProductService;

	// 确认收货
	public void confirmOrder(String orderProductId, Customer customer) throws Exception {
		OrderProduct order = orderProductService.findById(orderProductId);
		OrderProductWrapper wrapper = new OrderProductWrapper(order);
		wrapper.deliverConfirm(customer);
		orderProductService.update(wrapper.getOrder());
	}

	// 取消订单
	public void cancelOrder(String orderProductId, Customer customer) throws Exception {
		OrderProduct order = orderProductService.findById(orderProductId);
		OrderProductWrapper wrapper = new OrderProductWrapper(order);
		wrapper.cancelOrder(customer);
		orderProductService.update(wrapper.getOrder());
	}
	
	// 配送订单
	public void deliverOrder(String orderProductId, UserInfo user) throws Exception {
		OrderProduct order = orderProductService.findById(orderProductId);
		OrderProductWrapper wrapper = new OrderProductWrapper(order);
		wrapper.deliverOrder(user);
		orderProductService.update(wrapper.getOrder());
	}
	
	// 拒绝订单
	public void rejectOrder(String orderProductId, UserInfo user) throws Exception {
		OrderProduct order = orderProductService.findById(orderProductId);
		OrderProductWrapper wrapper = new OrderProductWrapper(order);
		wrapper.rejectOrder(user);
		orderProductService.update(wrapper.getOrder());
	}

}

```