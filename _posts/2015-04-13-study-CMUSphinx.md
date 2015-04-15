---
layout: default
title: 关于CMUSphinx的一些整理
comments: true
category: SpeechRec
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


> 1 hour of recording for command and control for single speaker<br>
5 hour of recordings of 200 speakers for command and control for many speakers<br>
10 hours of recordings for single speaker dictation<br>
50 hours of recordings of 200 speakers for many speakers dictation<br>

# 配置调优分析

## FontEnd 相关参数

### epFrontEnd 带端点检测

* 包含组件`speechClassifier`, `speechMarker` 以及 `nonSpeechDataFilter` 是端点检测的基本组件，构成默认的FrontEnd pointer。

* `speechClassifier`用于将Speech和背景声音区别开来， threshold门限用于设置灵敏度，值越低，越灵敏。

* `speechMarker`用于确定speech结尾的非speech部分的长度，以保证手机信息的完整性。默认50ms

* `MicroPhone` 中的  'msecPerRead' 参数设置一次读取的时长 默认 10ms。 'closeBetweenUtterances'  设置在说话间隙是否关闭麦克风，建议不关闭，因为开关不稳定(linux)。

* `dataBlocker` 用于设置音频块的长度, 默认 10ms.

* `Preemphasizer` 是一个高通滤波器，用于增加高频的信息能量

* `fft`这里用的是DiscreteCosineTransform，函数变换用，梅尔频谱系数，MFCC.

* `liveCMN` 计算迄今为止的倒谱平均值。

* `featureExtraction` 这里用的是 DeltasFeatureExtractor 倒谱三角量计算

### 一些影响因素

* speechClassifier、speechMarker、nonSpeechDataFilter、denoise 对识别准确率有负面影响。

	* Dither 加入人工噪音，防止能量为0时候崩溃，降低准确率
	
	* EnergyFilter 抛弃0能量帧，是Dither的替代品，降低准确率
	
	* Preemphasizer 高通滤波器，准确率较好

## SearchManageer

### 连续语音识别使用 `wordPruningSearchManager`

* `linguist这里用的是lexTreeLinguist`不超过三音节较大的n-gram文法 - 这语言学家将直接从N - gram语言模型生成的搜索空间。
支持的词汇是存在于字典中的语言模型中发现的字和词的交集。假定单词在单词表中的所有序列是有效的。要为其定义acoustic Model 和 language Model

* `linguist` 如果用 flatlinguist就可以用grammar.

* `pruner` 这里用的是 SimplePrunner 剪枝用的

* `threadedScoer`多线程 评分 计算

* `SimpleActiveListManager`用于存放待扩展的Token




