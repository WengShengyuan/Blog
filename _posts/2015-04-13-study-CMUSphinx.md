---
layout: default_comments
title: 关于CMUSphinx的一些整理
comments: true
---


过去挺久了，这里记录的代码还是比较原始的阶段，等以后整理好后不上更完整的应用代码


# 平台搭建

## PC平台

* 通过MAVEN构建

```xml

<project>
    <repositories>
        <repository>
            <id>snapshots-repo</id>
            <url>https://oss.sonatype.org/content/repositories/snapshots</url>
            <releases><enabled>false</enabled></releases>
        <snapshots><enabled>true</enabled></snapshots>
        </repository>
    </repositories>
</project>

//dependency

<dependency>
	<groupId>edu.cmu.sphinx</groupId>
	<artifactId>sphinx4-core</artifactId>
	<version>1.0-SNAPSHOT</version>
</dependency>

<dependency>
	<groupId>edu.cmu.sphinx</groupId>
	<artifactId>sphinx4-data</artifactId>
	<version>1.0-SNAPSHOT</version>
</dependency>

```

## Android平台

不需要网上繁琐的Ant编译教程，直接从别人的项目中找到jar包比较方便。


# API的使用及代码

## 配置器

```java

	public class ConfigClass {
	
		public static Configuration configuration = new Configuration();
		public  ConfigClass()
		{
			// Set path to acoustic model.
			configuration.setAcousticModelPath("./mod/bergtrain.cd_cont_200");
			// Set path to dictionary.
			configuration.setDictionaryPath("./mod/bergtrain.cd_cont_200/bergtrain.dic");
			// Set language model.
			configuration.setLanguageModelPath("./mod/bergtrain.lm.dmp");
		}
	}

```

## 实时识别

```java

	public class LiveRec {
	
		static Configuration conf = new Configuration();
		
		public static void main(String[] args) {
			// TODO Auto-generated method stub
			ConfigClass configClass = new ConfigClass();
	    	conf = configClass.configuration;
	    	
	    	try
	    	{
	    		LiveSpeechRecognizer recognizer;
				recognizer = new LiveSpeechRecognizer(conf);
				while(true)
					{
						recognizer.startRecognition(true);
				    	System.out.println("speak");
				    	SpeechResult result = recognizer.getResult();
				    	// Pause recognition process. It can be resumed then with startRecognition(false).
				    	recognizer.stopRecognition();
				    	printout(result);
					}
	
	    	}
	    	catch (IOException e)
			{
				System.out.println(e.toString());
			}
	    	
		}
		
		public static void printout(SpeechResult inresult)
	    {
	    	System.out.println("Result:"+inresult.getHypothesis());
			
	    }
	
	}

```

## 音频文件识别

```java

	public class SerialRec 
	{
		static Configuration conf = new Configuration();
		
	    public static void main( String[] args )
	    {
	        ConfigClass configClass = new ConfigClass();
	    	conf = configClass.configuration;
	    	LiveSpeechRecognizer recognizer;
			try 
			{
				recognizer = new LiveSpeechRecognizer(conf);
			} 
			catch (IOException e) 
			{
				e.printStackTrace();
			}
			test_all("speech1");
	    }
	    
	    public static void printout(SpeechResult inresult)
	    {
	    	System.out.println("Result:"+inresult.getHypothesis());
	    }
	    
	    public static void test_all(String infile)
		{
			StreamSpeechRecognizer recognizer;
			try 
			{
				recognizer = new StreamSpeechRecognizer(conf);
				for (int i=1;i<281;i++)
				{
					try
					{
						recognizer.startRecognition(new FileInputStream("./res/"+infile+"/1_" +String.valueOf(i) +".wav"));
						SpeechResult result = recognizer.getResult();
						recognizer.stopRecognition();	
						System.out.print(String.valueOf(i)+"->Result:");
						String tsr = result.getHypothesis();
						System.out.println(tsr);
						
					}
					catch(Exception e)
					{}
				}
			} 
			catch (IOException e) 
			{
				e.printStackTrace();
			}
		}
	}

```


# 训练过程

* 待补充

## 样本量要求


1 hour of recording for command and control for single speaker<br>
5 hour of recordings of 200 speakers for command and control for many speakers<br>
10 hours of recordings for single speaker dictation<br>
50 hours of recordings of 200 speakers for many speakers dictation<br>

# 配置调优分析

## FontEnd 端点检测



