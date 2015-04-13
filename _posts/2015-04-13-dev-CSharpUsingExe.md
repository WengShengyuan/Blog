---
layout: default_comments
title: C#调用外部EXE-LibSVM为例
comments: true
---


主要是前一段做客流预测的时候，发现不会写SVM，所以 想直接用<a href= "http://baike.baidu.com/view/598089.htm">LibSVM</a>来进行预测。因为LibSVM可以直接将运算结果生成文件，
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

```