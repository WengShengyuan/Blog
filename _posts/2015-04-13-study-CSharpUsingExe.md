---
layout: default_comments
title: C#调用外部EXE-LibSVM为例
comments: true
category: C#
---


主要是前一段做客流预测的时候，发现不会写SVM，想直接用<a href= "http://baike.baidu.com/view/598089.htm">LibSVM</a>来进行预测。因为LibSVM可以直接将运算结果生成文件，
所以打算通过C#调用EXE的形式进行调用，同时读取结果数据。

# 核心方法

## 执行EXE

```CSharp

		/// <summary>
        /// 执行EXE文件
        /// </summary>
        /// <param name="exePath"></param>
        /// <param name="args"></param>
        /// <param name="outputFile">若有指定输出重定向才填写</param>
        private void executeEXE(String exePath, String args, bool logout)
        {
            Process proc = new Process();
            proc.StartInfo.FileName = exePath;
            proc.StartInfo.CreateNoWindow = true;
            proc.StartInfo.Arguments = args;

            proc.StartInfo.RedirectStandardOutput = true;
            proc.StartInfo.UseShellExecute = false;
            proc.Start();
            
                StreamReader sr = new StreamReader(proc.StandardOutput.BaseStream);
                string line = "";

                while ((line = sr.ReadLine()) != null)
                {
                    if (logout)
                    {
                        Console.WriteLine(line);
                    }
                }
                sr.Close();
            
            
            proc.WaitForExit();

        }
        
        //把console输出到文件
        private void executeEXE(String exePath, String args, String outputFile, bool logout)
        {
            Process proc = new Process();
            proc.StartInfo.FileName = exePath;
            proc.StartInfo.CreateNoWindow = true;
            proc.StartInfo.Arguments = args;

            proc.StartInfo.RedirectStandardOutput = true;
            proc.StartInfo.UseShellExecute = false;
            proc.Start();
            
                StreamReader sr = new StreamReader(proc.StandardOutput.BaseStream);
                string line = "";

                while ((line = sr.ReadLine()) != null)
                {
                    if (logout)
                    {
                        Console.WriteLine(line);
                        FileUtil.AppendText(outputFile, line);
                        FileUtil.AppendText(outputFile, FileUtil.NewLine);
                    }

                }
                sr.Close();
            
            
            proc.WaitForExit();
            
        }

```

## 算法调度

以下调用均是由上述的执行EXE方法

* 将数据转换为LibSVM格式的文本文件

* 调用svmscale.exe进行归一化

`svmscale.exe feature.txt feature.scaled`

* 调用svmtrtrain.exe进行训练

`svmtrain.exe -s 3 -p 0.0001 -t 2 -g 32 -c 0.53125 -n 0.99 feature.scaled`

* 调用svmpredict.exe进行预测

`svmpredict.exe feature_test.scaled feature.scaled.model feature_test.predicted`

* 将结果文本转为DataSet导入C#中进行进一步处理
