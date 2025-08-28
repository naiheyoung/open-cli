**查找并打开指定文件或目录(Windows)**

<br>

**USAGE**

```bash
npm install @naiheyoung/open-cli -g
open -h
```

**COMMAND**

```bash
open <folder>           # 打开指定目录
     -e                 # 在资源管理器中打开目标目录
open config list        # 显示配置文件信息
open config get <key>   # 获取配置
open config set <k> <v> # 设置配置

# 默认以vscode打开目录
# 也可以直接在%username%/.breeze-open-cli.json文件中修改配置
```

**❗❗❗**

> 该命令依赖于 Everything 文件服务, 因此使用前需要在`.breeze-open-cli.json`中配置服务认证信息

<samp>code is licensed under <a href='./LICENSE'>MIT</a>,<br> words and images are licensed under <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/'>CC BY-NC-SA 4.0</a></samp>.

