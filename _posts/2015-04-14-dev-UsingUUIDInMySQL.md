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
<img src = "{{site.baseurl}}/images/post_images/2015-04-14-dev-UsingUUIDInMySQL/initial-per-transaction.jpg"/>

数据来源<a href="http://kccoder.com/mysql/uuid-vs-int-insert-performance/">MySQL InnoDB Primary Key Choise</a><br>

## 提高MySQL中UUID查询性能的方法

很多文章中都提到了将UUID以binary形式存储可以显著提高性能。<br>
如 <a href="http://iops.io/blog/storing-billions-uuid-fields-mysql-innodb/">storing-billions-uuid-fields-mysql-innodb</a>
这篇博文就有详细性能对比:<br>

Store UUID in hex format as CHAR(36).
INSERT PERFORMANCE
--------------------------------------------------------
total_rows           chunk_size           time_taken
100000               100000               1.87230491638
200000               100000               2.42642807961
300000               100000               3.65519285202
400000               100000               4.23701429367
500000               100000               4.88455510139
600000               100000               5.57620716095
700000               100000               7.50717425346
800000               100000               9.49350070953
900000               100000               10.1547751427
1000000              100000               12.0748021603
1100000              100000               12.277310133
1200000              100000               12.2819159031
1300000              100000               16.9854588509
1400000              100000               20.3873689175
1500000              100000               21.8642649651
1600000              100000               24.4224257469
1700000              100000               29.6857917309
1800000              100000               31.5416200161
1900000              100000               35.4671728611
2000000              100000               41.4726109505