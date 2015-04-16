---
layout: default
title: Window与Linux跨平台JAVA编程的注意事项
comments: true
category: JAVA
---


该博文用于记录在开发过程中遇到的跨平台JAVA程序遇到的异常情况与处理

## 路径处理

* 不要写绝对路径

如`C:\\admin\\test`

路径应该从根目录开始使用`config`或者静态类的方式进行配置，这样比较好修改。比如:

```java

	public static class ComStatic {
		String ROOT_FOLDER = "ROOT";
		String FILE_TEMP = "TEMP";
		String WINDOWS_HOME = "C\:";
		String LINUX_HOME = "/opt";
		
	}
	
	
	class myClass {
	
		public void doSomething() {
		
			//路径：  C:/ROOT/TEMP
			String static ROOT_PATH_WINDOWS = String.format("%s%s%s%s%s",
			ComStatic.WINDOWS_HOME, File.separator, ComStatic.ROOT_FOLDER,
			File.separator,ComStatic.FILE_TEMP);
			
			//路径： /opt/ROOT/TEMP
			String static ROOT_PATH_LINUX = String.format("%s%s%s%s%s", 
			ComStatic.LINUX_HOME, File.separator,  ComStatic.ROOT_FOLDER,
			File.separator, ComStatic.FILE_TEMP);
		}
	
	}

```

* 不要直接用\\ 或者 /

如上所示要用 File.separator;

* 可以自己做一个工具如[CustomFileUtils](http://github.com/WengShengyuan/CustomUtils/blob/master/src/main/custom/CustomFileUtils.java)来拼接路径

```java

	/**
	 * 拼接路径
	 * @param pathList a, b, c, d
	 * @return a/b/c/d 
	 */
	public static String parsePath(String ... pathList){
		if(pathList.length == 0){
			return "";
		}
		StringBuilder sb = new StringBuilder();
		for(String o : pathList){
			sb.append(o).append(File.separator);
		}
		return sb.toString().substring(0,sb.length()-1);
	}

```

## 加密解密问题

在windows上进行加密后，从Linux解密会出现<br>
`javax.crypto.BadPaddingException:Given final block not properly padded`



原因在于 SecureRandom 实现完全随操作系统本身的內部状态，除非调用方在调用 getInstance 方法，然后调用 setSeed 方法；

该实现在 windows 上每次生成的 key 都相同，但是在 solaris 或部分 linux 系统上则不同。关于SecureRandom类的详细介绍，见
[SecureRandom](http://yangzb.iteye.com/blog/325264">SecureRandom)




解决方式：

```java

	//原错误方法
	/** 
     * 获得秘密密钥 
     *  
     * @param secretKey 
     * @return 
     * @throws NoSuchAlgorithmException  
     */  
    private SecretKey generateKey(String secretKey) throws NoSuchAlgorithmException{ 
    
    	/*主要是此处代码出錯*/  
        SecureRandom secureRandom = new SecureRandom(secretKey.getBytes());  
        KeyGenerator kg = null;  
        try {  
            kg = KeyGenerator.getInstance(DES_ALGORITHM);  
        } catch (NoSuchAlgorithmException e) {
        	  
        }  
        kg.init(secureRandom);  
        // 生成密钥  
        return kg.generateKey();  
    }  
	
	
	
	
	/** 
 	 * 获得秘密密钥 
   	 *  
	 * @param secretKey 
	 * @return 
	 * @throws NoSuchAlgorithmException  
	 */  
	private SecretKey generateKey(String secretKey) throws NoSuchAlgorithmException{  
	    //防止linux下 随机生成key  
	    SecureRandom secureRandom = SecureRandom.getInstance("SHA1PRNG");  
	    /* 注意这里 */
	    secureRandom.setSeed(secretKey.getBytes());  
	    KeyGenerator kg = null;  
	    try {  
	        kg = KeyGenerator.getInstance(DES_ALGORITHM);  
	    } catch (NoSuchAlgorithmException e) {  
	    
	    }  
	    kg.init(secureRandom);  
	    // 生成密钥  
	    return kg.generateKey();  
	}  

```



