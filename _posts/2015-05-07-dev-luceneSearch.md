---
layout: default
title: lucene搜索引擎的初级使用
comments: true
category: java
---


一些网站项目中常常有全文搜索需求。若从头开始写代码是很不明智的，因为：

* `findAll()`再进行文本匹配效率极低

* `SELECT LIKE`形式在数据量大的时候效率也很低。详见:[lucene检索与关键字like性能对比](http://www.cnblogs.com/ShaYeBlog/archive/2012/09/04/2670432.html)

* 以上检索方式要实现字符通配、组合逻辑检索均不方便

因此，使用lucene检索引擎可以十分方便的满足全文检索需求。

另外，网上虽然有类似hibernate search 或者 solr 这样的基于lucene的集成引擎，但是在一些小规模的应用场景，直接调用lucene反而更容易实现。特别是在本人对Spring的配置和声明不熟悉的情况下，直接部署
hibernate search 可能反而出现一些无法预料的错误。


## 引用包

使用MAVEN引入，包括以下组件:

* lucence 核心

* 中文分词器

```XML

 <!-- lucene core -->
 <dependency>
 	<groupId>org.apache.lucene</groupId>
 	<artifactId>lucene-core</artifactId>
 	<version>4.7.2</version>
 </dependency>
 <dependency>
 	<groupId>org.apache.lucene</groupId>
 	<artifactId>lucene-queryparser</artifactId>
 	<version>4.7.2</version>
 </dependency>
 <!-- lucene core -->
 
 <!-- 中文分词器 -->
 <dependency>
 	<groupId>org.apache.lucene</groupId>
 	<artifactId>lucene-analyzers-smartcn</artifactId>
 	<version>4.7.2</version>
 </dependency>
 <!-- 中文分词器 -->
 
```


##　一般使用方式

lucene 可以从任何数据源中创建索引文件，然后从索引文件中进行搜索。因此，其使用步骤大致即可分为：创建索引和搜索。



### 建立索引和搜索时需要保持一致的公共声明

```java

	//公共变量声明
	private String indexFile = "C://INDEX";
	Version version = Version.LUCENE_47;
	Analyzer analyzer = new SmartChineseAnalyzer(version);
	String fileds = new String[] {"introduction","itemName"};

```

### 创建索引

```java

	@Override
	public void updateIndex() throws Exception {
		List<WebMerchantInfo> list;
		//存放索引的文件夹
        File indxeFile;
        //创建Directory对象
        Directory directory;
        //创建IndexWriterConfig
        IndexWriterConfig indexWriterConfig ;
        //创建IndexWriter
        IndexWriter indexWriter;
        
        
        try {
			indxeFile = new File(indexFile);
			directory =FSDirectory.open(indxeFile);
			indexWriterConfig = new IndexWriterConfig(version, analyzer);
			indexWriterConfig.setOpenMode(OpenMode.CREATE);
			indexWriter = new IndexWriter(directory, indexWriterConfig);
		} catch (Exception e) {
			WifiLogUtil.wifiLogError(String.format("%s %s", this.getClass().getName(),"updateIndex"), e);
    	    throw new SystemWifiException("初始化索引错误");
		}
        
        //从数据库中读取出所有的新闻记录以便进行索引的创建
        try {
            list = wmiDao.findAll();
            DateFormat dateFormat = new SimpleDateFormat("yyyy年MM月dd日 HH时mm分ss秒");
            for (WebMerchantInfo o : list) {
            	try{
            		//建立一个lucene文档
                    Document doc = new Document();
                    //得到信息
                    String itemName =o.getItemName();
                    String id = o.getMerchantInfoId() + "";
                    String introduction = o.getIntroduction();
                    String putTime = o.getPutTime();
                    if(itemName == null || introduction == null || putTime == null || id == null){
                    	continue;
                    }
                    doc = addDoc(id, itemName, introduction, putTime);
                    indexWriter.addDocument(doc);
            	} catch(Exception e){
            		e.printStackTrace();
            	}
                
            }
            indexWriter.close();

        } catch (SQLException e) {
        	WifiLogUtil.wifiLogError(String.format("%s %s", this.getClass().getName(),"updateIndex"), e);
    	    throw new SystemWifiException("构造索引错误");

        }
		
	}
	
	private Document addDoc(String id, String itemName, String introduction, String putTime) throws UnsupportedEncodingException{
		try {
			Document doc = new Document();
			FieldType ft = new FieldType();
			ft.setStored(true);         
			ft.setIndexed(true);         
			ft.setTokenized(false); 
			doc.add(new Field("id", id,ft));
			doc.add(new Field("itemName", itemName, TextField.TYPE_STORED));
			doc.add(new Field("introduction", introduction, TextField.TYPE_STORED));
			doc.add(new Field("putTime", putTime, ft));
			return doc;
		} catch (Exception e) {
			WifiLogUtil.wifiLogError(String.format("%s %s", this.getClass().getName(),"addDoc"), e);
    	    throw new SystemWifiException("索引单元Document处理错误");
		}
		
	}

```

### 搜索

```java

	@Override
	public List<WebMerchantInfo>  keyWordSearch(String topic) throws Exception {
		if(topic.isEmpty() || topic == null){
			return null;
		}
		IndexSearcher searcher = null;  
        List<WebMerchantInfo> rList =  null;
        List<ScoreDoc[]> hitsList = null;
        ScoreDoc[] hits=null;
        Query query=null;  
        
        try {
			searcher = new IndexSearcher(DirectoryReader.open(FSDirectory.open(new File(indexFile))));  
			rList = new ArrayList<WebMerchantInfo>();
			hitsList = new ArrayList<ScoreDoc[]>();
		} catch (Exception e) {
			WifiLogUtil.wifiLogError(String.format("%s %s", this.getClass().getName(),"keyWordSearch"), e);
    	    throw new SystemWifiException("基础信息获取错误");
		}
        
        try {
            BooleanClause.Occur[] clauses = { BooleanClause.Occur.SHOULD, BooleanClause.Occur.SHOULD };
            query = MultiFieldQueryParser.parse(version,topic, fields, clauses, analyzer);
        } catch (Exception e) {  
        	WifiLogUtil.wifiLogError(String.format("%s %s", this.getClass().getName(),"keyWordSearch"), e);
    	    throw new SystemWifiException("搜索器构造错误");
        }
        try{
        	if (searcher!=null) {  
                TopDocs results=searcher.search(query, 10);//只取排名前十的搜索结果  
                hits=results.scoreDocs;  
                Document document=null;
                if (hits.length>0) {
                    for (ScoreDoc o: hits) {  
                         document=searcher.doc(o.doc);  
                         String introduction=document.get("introduction");
                         String itemName = document.get("itemName");
                         String putTime = document.get("putTime");
                         String id = document.get("id");
                         WebMerchantInfo w = new WebMerchantInfo();
                         w.setItemName(itemName);
                         w.setIntroduction(introduction);
                         w.setPutTime(putTime);
                         w.setMerchantInfoId(Long.valueOf(id));
                         rList.add(w);
                    }  
                }else{
                	System.out.println("没查到结果");
                	return null;
                }
//                searcher.close();  
                return rList;

            }else{
            	 System.out.println("没查找到索引");  
            	 return null;
            }
        } catch(Exception e){
        	WifiLogUtil.wifiLogError(String.format("%s %s", this.getClass().getName(),"keyWordSearch"), e);
    	    throw new SystemWifiException("结果搜索错我");
        }
        
    }

```

## 性能优化

* 建立索引是需要进行一次`findAll`操作，可以将建立索引的过程放在表数据发生变化时候触发，平时搜索可以直接根据现有索引进行搜索。
* lucene支持在内存中建立索引，因此，若内存足够大可以尝试将索引建立在内存中。



## 包装框架

### hibernate search

支持Annotation注解方式使用。与hibernate结合紧密。

详见官网: [hibernate search](http://hibernate.org/search/)

一些博客:

[基于Spring的Hibernate Search全文检索功能示例](http://nkadun.iteye.com/blog/338469)

[hibernate search 基本查询](http://blog.csdn.net/dm_vincent/article/details/40707857)





### solr

对JPA支持不佳。