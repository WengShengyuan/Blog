---
layout: default
title: hibernate中的通用<K,V>查询法
comments: true
category: database
---


## 通过拼接HQL语句的形式实现，使用`StringBuilder`。

* 模式1

```SQL

SELECT * FROM OBJ WHERE PARAM1 = 'VALUE1' AND PARAM2 = 'VALUE2' AND ....;

```
JAVA实现

```java

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
			// 去掉最后一个and
			sql.append(conStr.toString().substring(0, conStr.length() - 4));
			Query query = em.createQuery(sql.toString());
			for (String key : map.keySet()) {
				query = query.setParameter(key, map.get(key));
			}
			resultList = query.getResultList();
		} catch (Exception e) {
			throw new SystemWifiException("查询数据库出错，请确认sql语句是否正确或者链接是否正确。"
					+ e.getMessage());
		}
		if (resultList == null || (resultList != null && resultList.size() < 1)) {
			return resultList;
			// throw new BusinessWifiException("查询结果为空");
		} else
			return resultList;
	}

```


* 模式2

```SQL

SELECT * FROM OBJ WHERE PARAM1 IN ('VALUE1', 'VALUE2', .....);

```

JAVA实现

```java

	@Override
	public List<T> queryByStringInMap(HashMap<String, List<Object>> map)
			throws Exception {
		List<T> resultList = null;
		try {
			StringBuilder sql = new StringBuilder("SELECT o from "
					+ getPersistentClass().getName() + " o WHERE ");
			StringBuilder conStr = new StringBuilder("");
			// 拼接条件
			for (String key : map.keySet()) {
				List<Object> value = map.get(key);
				conStr = conStr.append(String.format(" o.%s in (:%s) and", key,
						key));
			}
			// 去掉最后一个and
			sql.append(conStr.toString().substring(0, conStr.length() - 4));
			Query query = em.createQuery(sql.toString());
			for (String key : map.keySet()) {
				query = query.setParameter(key, map.get(key));
			}
			resultList = query.getResultList();
		} catch (Exception e) {
			throw new SystemWifiException(getPersistentClass().getName()+"查询数据库出错，请确认sql语句是否正确或者链接是否正确。");
		}
		if (resultList == null || (resultList != null && resultList.size() < 1)) {
			// throw new BusinessWifiException("查询结果为空");
			return resultList;
		} else
			return resultList;

	}

```

## 实际使用

```java

	HashMap<String, Object> map = new HashMap<String, Object>();
	map.put("key1", valueObj);
	map.put("key2", valueObj);
	List<Entity> results = entityDao.queryByStringEqualMap(map);
	
	
	HashMap<String, List<Object>> map = new HashMap<String, List<Object>>();
	List<Object> values = new ArrayList<Object>();
	values.add(valueObj1);
	values.add(valueObj2);
	map.put("key1", values);
	List<Entity> results = entityDao.queryByStringInMap(map);

```


