---
layout: default
title: JPA�����ڿ��ٿ��������仯�ı��ѯ��ҵ�������ṹ���
comments: true
category: java
---


*��Ҫʹ�ó�����ʵ����ж���״̬��״̬ת��·���࣬״̬ת��ҵ������Ը���*


## 1 ���ó���

���͵�ʹ�ó�����������������
���û��ӹ�����Ʒ���̻����������������������ͣ��û��ջ����û�ȷ�ϣ��û��˻�\�˿�̻��˿���׹رյȵ�һϵ�������У��������ڲ�ͬ�׶α���Ϊ��ͬ��״̬��
����Щ״̬�ö���ʵ�屾���һ�����߶���ֶβ�ֵͬ���������ʾ��


�����ҵ����ʱͨ���򵥵ģ���ѯʵ�� -> �޸���������ֶ� -> ���棬����ʵ��ҵ���߼������Լ����ݸ��µĻ���������ȱ�㣺

* ��ѯÿһ��״̬��ʵ���б���Ҫ��ס���еĹؼ��ֶ���ϣ����д��ͻ���ɲ�ѯ�����׼ȷ���������Է��֡�

* �������������ɴ�����󣬱��磺©��һ���ֶΣ��Ĵ�״̬��ȵȡ�

* ÿһ��ҵ�����̴���Ŀ�ʼ״̬�ͽ���״̬���ɿأ����磺�û����ύ�����ǲ����Ա�ֱ�ӹرս��׵ģ������Ҫʵ����һԼ������Ӧ���ڹرս��׵�ҵ��������ر���������״̬�ܶ࣬ҵ�����߼��ܶ������£���������©Լ�������ҵ���߼��������

* �ڿ��������У�������һ��״̬���޸�һ��ҵ���߼�����ֹ״̬��Ҫ�����Ĵ����޸ģ��������ҵ���߼��������

�����Ҫ�Զ�����Ϊ������ϸ���������˻��˿�ȱ���ԣ������趩�������¼���״̬��״̬���м�ͷ���ʾ
����ͨ��ҵ�����ת��״̬����������

![]({{site.baseurl}}/images/post_images/2015-08-01-dev-quickOrderDesign/order.jpg)


## 2 �������

��ƴ��·�Ϊ����ѯ�����Ż�����Ʋ�ѯ�������ݽṹ������״̬���ģʽ(State Design Pattern)������ҵ�����㡣

### 2.1 ��ѯ�����Ż�

JPA��ѯͨ����дHQL��ɣ�ͨ����װ��ѯ������ʵ������<�ֶ�,Ŀ��ֵ>�ļ�ֵ�Բ��Զ�����HQL��ɲ�ѯ�Ĺ��̣�ʡȥ�˱�дHQL�Ĺ����������ⲿ������˵���ǲ�ѯ���������������

�������£�


```java

// ����HashMap<String, Object>���洢��ѯ������ֵ����Ϊ����
// ʵ����"SELECT FROM XXXX WHERE KEY1 = VALUE1 AND KEY2 = VALUE2 ...."��ѯ

	@Override
	public List<T> queryByStringEqualMap(HashMap<String, Object> map)
			throws Exception {
		List<T> resultList = null;
		try {
			StringBuilder sql = new StringBuilder("SELECT o from "
					+ getPersistentClass().getName() + " o WHERE ");
			StringBuilder conStr = new StringBuilder("");
			// ƴ������
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
			throw new Exception("��ѯ���ݿ������ȷ��sql����Ƿ���ȷ���������Ƿ���ȷ��"
					+ e.getMessage());
		}
		if (resultList == null || (resultList != null && resultList.size() < 1)) {
			return resultList;
			// throw new BusinessWifiException("��ѯ���Ϊ��");
		} else
			return resultList;
	}
	
	
// ��ѯ��һ�����

	HashMap<String, Object> map = new HashMap<String, Object>();
	map.put("KEY1", VALUE1);
	map.put("KEY2", VALUE2);

	List<Entity> results = entityDao.queryByStringEqualMap(map);

```


### 2.2 ��Ʋ�ѯ�������ݽṹ

�½�2.1�еĲ�ѯ������Ӧ���ڶ������Ӧ�ó�����ʱ����Ȼ�޷�������Ҫ��ס����״̬��Ӧ���ֶ��Լ�����ֵ�����⣬�������ֵ������󣬽��Ҳ�ǲ���ȷ�ġ�

��ˣ�������ƾ�̬����������⣬������Զ��������֧����ʽ���������ݽṹ��ʵ�ֲ�ѯ�����Ŀ���ƴ�ӡ����磺

```java

//������Ĳ�ѯ������ʽ�ṹ��ƣ�����˳���ö���ࣩ
public class OrderProductChainningMap {
	
	private HashMap<String, Object> map ;
	
	public OrderProductChainningMap(){
		this.map = new HashMap<String, Object>();
	}
	
	
	//֧����ʽ���ֽ�����֧��
	public OrderProductChainningMap setOrderPayType_CASH() {
		this.map.put("orderPayType", OrderProductEnum.ORDERPAYTYPE_CASH.getCode_string());
		return this;
	}
	public OrderProductChainningMap setOrderPayType_NOCASH() {
		this.map.put("orderPayType", OrderProductEnum.ORDERPAYTYPE_NOCASH.getCode_string());
		return this;
	}
	
	
	
	//״̬��δ֧������֧�����ӵ����ܵ��������С�ȷ���ջ�
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
	
	
	
	
	//��Ч��־����Ч����Ч
	public OrderProductChainningMap setValidFlag_FALSE() {
		this.map.put("validFlag", OrderProductEnum.VALIDFLAG_FALSE.getCode_string());
		return this;
	}
	public OrderProductChainningMap setValidFlag_TRUE() {
		this.map.put("validFlag", OrderProductEnum.VALIDFLAG_TRUE.getCode_string());
		return this;
	}
	
	
	
	//�����ֶ���������
	public OrderProductChainningMap setMap(String key, Object obj) {
		this.map.put(key, obj);
		return this;
	}
	public HashMap<String,Object> getMap() {
		return this.map;
	}
}

```

���Կ������ýṹ�ĺ�����Ȼ��HashMap<String, Object>��ֻ�������һ�㣬����������ͨ���������֣������ؽṹ������ˣ������������ò�ѯ������
�������£�

```java

OrderProductChainningMap map = new OrderProductChainningMap();

//��Ч��δ֧�����ֽ�֧���Ķ�������:
map	.setValidFalg_TRUE()
	.setOrderState_UNPAID()
	.setOrderPayType_CASH();

List<Entity> result = entityDao.queryByStringEqualMap(map.getMap());


```

### 2.3 ����״̬���ģʽ

״̬ģʽ�ɣ�״̬�ӿڡ�״̬�ࡢʵ���װ��ͬʵ�֡�

* ״̬�ӿڣ�Ԥ������״̬�¿��ܵ�ҵ�������
* ״̬�ࣺ��״̬�µ�ҵ���������ʵ�֡�
* ʵ���װ������ʵ�塢�Լ���ǰʵ��������״̬���ṩ����״̬��ʵ���ҵ�������

��Ҫִ��˳�����£�

* 1.�����ݿ��в�ѯ����ʵ��Entity����װ��ʵ���װWrapper��������ʵ����������״̬State��
* 2.��ʵ���ҵ�����ͨ����װ����������װͨ����ǰ״̬��ľ���ҵ���������ʵ�֡�(Wrapper -> state -> doSth))

��ͼ��ʾ��

ԭController - Service - Dao ģʽ��

![]({{site.baseurl}}/images/post_images/2015-08-01-dev-quickOrderDesign/CSDPattern.jpg)

Ƕ��State Pattern Design��״̬ģʽ��

![]({{site.baseurl}}/images/post_images/2015-08-01-dev-quickOrderDesign/stateDesign.jpg)

����ṹ���£�

#### 2.3.1 �ӿ�

```java

public Interface IOrderState {

	/**
	 * �ܵ�
	 * @param user
	 * @throws Exception
	 */
	public void rejectOrder(UserInfo user) throws Exception;
	
		
	/**
	 * ����
	 * @param user
	 * @throws Exception
	 */
	public void deliverOrder(UserInfo user) throws Exception;
	
	/**
	 * ȡ������
	 * @param customer
	 * @throws Exception
	 */
	public void cancelOrder(Customer customer) throws Exception;
	
		
	/**
	 * ȷ���ջ�
	 * @param customer
	 * @throws Exception
	 */
	public void deliverConfirm(Customer customer) throws Exception;
	
	
}

```

#### 2.3.2 ״̬��

״̬���ж���ҵ������߼��������Կ��Ƶ�ǰ״̬�Ƿ������ʵ�����ĳЩ�������������״̬ת�ơ�

�������£��¶���״̬��������

```java

/**
 * �¶���״̬ʵ����
 */
public class OfflineNew implements IOrderProductState {
	
	OrderProductWrapper order;
	
	public OfflineNew(OrderProductWrapper order){
		this.order = order;
	}

	@Override
	public void rejectOrder(UserInfo user) throws Exception {
		// ������Ч��־��Ϊ��Ч
		this.order.getOrder().setValidFlag(OrderProductEnum.VALIDFLAG_FALSE.getCode_string());
		this.order.setState(this.order.getRejected());
	}

	
	@Override
	public void cancelOrder(Customer customer) throws Exception {
		//������Ч��־��Ϊ��Ч
		this.order.getOrder().setValidFlag(OrderProductEnum.VALIDFLAG_FALSE.getCode_string());
		this.order.setState(this.order.getCanceled());
	}

	
	//�¶���δ���ͣ���˲��ܽ���ȷ���ջ��������������ڴ�״̬�µ��øò����������˳�
	@Override
	public void deliverConfirm(Customer customer) throws Exception {
		throw new Exception("Method rejected");		
	}

	
	@Override
	public void deliverOrder(UserInfo user) throws Exception {
		//�ı�״̬��������
		this.order.getOrder().setOrderState(OrderProductEnum.ORDERSTATE_SHIFTING.getCode_string());
		this.order.setState(this.order.getShifting());
	}

}

```

#### 2.3.3 ʵ���װ

���ض���ʵ���Լ�����״̬��Ϣ�İ�װ�࣬�������п����˲�������������ʵ��Ӧ����״̬����ʵ�֡�

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
	 * �ܵ�
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
	 * ȡ������
	 * @param customer
	 * @throws Exception
	 */
	public void cancelOrder(Customer customer) throws Exception{
		state.cancelOrder(customer);
	}
	
	
	
	/**
	 * ȷ���ջ�
	 * @param customer
	 * @throws Exception
	 */
	public void deliverConfirm(Customer customer) throws Exception{
		state.deliverConfirm(customer);
	}
	
	
	/**
	 * ���ݶ���ʵ�����øð�װ�ĳ�ʼ״̬
	 */
	private void setCurrentState(){
		
		//����������Ҫ�Ǹ������ݿ��ѯ��ʵ�� order ������ֶε�ֵ�����õ�ǰ������״̬ state
		//�����Ϳ�������Ӧ�ķ���������state����ʵ�������state.doSth();
		
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

### 2.4 ����ҵ������

��������������������漰���ű��������������������
������������ϸ����\�˻���֧����־....������������ͨ��������ͳһЭ������֤�����ҵ����ȵ������ԣ���������
������������ݵĳ־û���

�����ֻ������ݿ��ж�ȡʵ�壬���а�װ��ִ��ҵ�������д�����ݿ⼴�ɡ��������ĳ��ʵ���Ƿ����ִ��ĳ����������Ϊ����Ĳ������Լ��Ƿ����ִ����Щ�������Ѿ���״̬ģʽ����������ơ�

```java

public class OrderProcessManager {

	@Resource(name = "OrderProductServiceImpl")
	private OrderProductService orderProductService;

	// ȷ���ջ�
	public void confirmOrder(String orderProductId, Customer customer) throws Exception {
		OrderProduct order = orderProductService.findById(orderProductId);
		OrderProductWrapper wrapper = new OrderProductWrapper(order);
		wrapper.deliverConfirm(customer);
		orderProductService.update(wrapper.getOrder());
	}

	// ȡ������
	public void cancelOrder(String orderProductId, Customer customer) throws Exception {
		OrderProduct order = orderProductService.findById(orderProductId);
		OrderProductWrapper wrapper = new OrderProductWrapper(order);
		wrapper.cancelOrder(customer);
		orderProductService.update(wrapper.getOrder());
	}
	
	// ���Ͷ���
	public void deliverOrder(String orderProductId, UserInfo user) throws Exception {
		OrderProduct order = orderProductService.findById(orderProductId);
		OrderProductWrapper wrapper = new OrderProductWrapper(order);
		wrapper.deliverOrder(user);
		orderProductService.update(wrapper.getOrder());
	}
	
	// �ܾ�����
	public void rejectOrder(String orderProductId, UserInfo user) throws Exception {
		OrderProduct order = orderProductService.findById(orderProductId);
		OrderProductWrapper wrapper = new OrderProductWrapper(order);
		wrapper.rejectOrder(user);
		orderProductService.update(wrapper.getOrder());
	}

}

```