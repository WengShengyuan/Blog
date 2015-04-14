---
layout: default
title: MySQL的 Too many connections问题
comments: true
category: DataBase
---


## 1 修改最大连接数

```Bash

	vi /etc/my.cnf

```

修改`max_connections = 1000`

## 2 重启MySQL

```Bash

	/etc/init.d/mysqld restart

```