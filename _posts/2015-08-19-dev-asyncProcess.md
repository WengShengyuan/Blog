---
layout: default
title: WEB项目中一些简单异步任务的组织与调度方法
comments: true
category: easyui
---

在一些WEB项目中，为提升用户体验，一些耗时操作可以在用户提交后异步进行，而不需要立即显示执行结果。因此可以将这些操作委托给后台线程进行。

## ThreadPoolExecutor

一般使用ThreadPoolExecutor来管理任务比直接声明Thread并调用更方便，且易于管理。

### 参数

#### 定义

它有几个常用设置：

* int corePoolSize - 核心线程数量
* int maximumPoolSize - 最大线程数量
* long keepAliveTime - 保持空闲时间
* TimeUnit unit - 时间单位
* BlockingQueue<Runnable> workQueue - 任务队列
* RejectedExecutionHandler handler - 拒绝异常处理

#### 逻辑关系

* 如果此时线程池中的数量小于corePoolSize，即使线程池中的线程都处于空闲状态，也要创建新的线程来处理被添加的任务。
* 如果此时线程池中的数量等于 corePoolSize，但是缓冲队列 workQueue未满，那么任务被放入缓冲队列。
* 如果此时线程池中的数量大于corePoolSize，缓冲队列workQueue满，并且线程池中的数量小于maximumPoolSize，建新的线程来处理被添加的任务。
* 如果此时线程池中的数量大于corePoolSize，缓冲队列workQueue满，并且线程池中的数量等于maximumPoolSize，那么通过 handler所指定的策略来处理此任务。


### 队列

这里介绍Queue仅做线程池任务队列时的特性介绍，并不详细介绍各种BlockingQueue的其余特性。

#### ArrayBlockingQueue

一般作为有界队列存储，当并发任务量巨大的时候，可以在一定程度上保护系统稳定性，较为常用。声明时需要制定队列的长度。

#### LinkedBlockingQueue

无界队列，容量大，但是在在并发任务量巨大时，由于没有数量限制，容易造成内存溢出等一系列问题。


### 拒绝异常处理

#### ThreadPoolExecutor.AbortPolicy()

直接放弃当前任务，会抛出异常。

#### ThreadPoolExecutor.CallerRunsPolicy()

用于被拒绝任务的处理程序，它直接在 execute 方法的调用线程中运行被拒绝的任务；如果执行程序已关闭，则会丢弃该任务。所以如果Executor没有被关闭，任务会等待执行。如果Executor被关闭，则会被丢弃。

#### ThreadPoolExecutor.DiscardOldestPolicy()

抛弃旧的任务

#### ThreadPoolExecutor.DiscardPolicy()

抛弃当前的任务


### 一般设置组合

#### 定时更新任务

这些任务一般不消耗太多系统资源，并且若上一任务挂起，新任务提交时，往往上一任务就不需要执行了。因此可以为这些任务分配一个线程，1-2个队列长度即可，拒绝异常处理选择抛弃旧任务。

* ArrayBlockingQueue(2);
* TreahPoolExecutor(1,1,60L,TimeUnit.SECONDS,queue,new ThreadPoolExecutor.DiscardOldestPolicy())

#### 可能大量并发且必须完成的任务

这些任务需要分配较多的系统资源。线程数以及队列长度的设置应该按实际使用场景判断：

##### IO负担大的

应该多分配线程数量，减少队列长度。

##### CPU负担大的

应该分配较少线程数(具体数量依据CPU核心数确定)，这样可以减少上下文切换造成的性能损失，同时增加队列长度。

拒绝异常处理应该选择让任务继续等待线程池空闲，并加入任务队列。

* ArrayBlockingQueue(1000);
* TreahPoolExecutor(4,8,60L,TimeUnit.SECONDS,queue,new ThreadPoolExecutor.CallerRunsPolicy())

对于可能出现的任务失败，或者系统异常导致的任务丢失，可以考虑结合队列的持久化方法。并加入定时任务，扫描未被执行的任务并加入线程池任务队列。
