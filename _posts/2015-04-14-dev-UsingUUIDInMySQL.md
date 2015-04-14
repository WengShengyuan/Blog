---
layout: default
title: MySQL中的UUID
comments: true
category: DataBase
---


避免主键冲突可以有多种方法，其中UUID比较方便而已。

## 使用UUID

* 涉及分布式数据库间数据共享与同步的问题

以订单为例，假设有：中心A，中心B，中心C。。。服务器，各服务器均能独立产生订单。最终汇总到中心0服务器中。如果使用自增长主键就会在数据汇聚的时候产生冲突。
UUID可以很好地解决这个问题。

* JAVA生成UUID

```java

UUID.randomUUID().toString().replaceAll("-","");

```

## UUID的性能问题

由于MySQL的InnoDB类型表在插入数据的时候进行了逐渐排序。因此对于随机UUID在数据量大的时候会出现性能下降的情况。<br>
性能损失如图:
<img src-"{{site.baseurl}}/images/post_images/2015-04-14-dev-UsingUUIDInMySQL/initial-per-transaction.jpg"/>

数据来源<a href="http://kccoder.com/mysql/uuid-vs-int-insert-performance/">MySQL InnoDB Primary Key Choise</a><br>

## 提高MySQL中UUID查询性能的方法

很多文章中都提到了将UUID以binary形式存储可以显著提高性能。