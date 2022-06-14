##  PACKAGE-CI整体功能介绍及安装操作
PACKAGE-CI是一款完全由JavaScript语言编写的自动化运维工具，主要面向各种规模的互联网软件（前端）开发团队，致力于打造前端项目DevOps一体化解决方案，相信开源的力量。
- GitHub开源地址：[https://github.com/yangrds/package-ci](https://github.com/yangrds/package-ci)
- 博客主页[https://js-vue.com](https://js-vue.com/archives/package-ci)（最新文档将在这里更新）
- 电子邮件地址[yangrd@tom.com](yangrd@tom.com)（可以随时给我发电子邮件）
- 如果您在使用过程中有任何疑问，可以加入群聊提问。
![Xnip2022-06-14_07-55-49](https://package-ci.oss-cn-shanghai.aliyuncs.com/images/Xnip2022-06-14_07-55-49.jpg)
### 软件平台演示
- 演示地址：[https://package.js-vue.com](https://package.js-vue.com/)
- 演示账号：xiaohuajia
- 演示密码：123
### 软件开源信息
|软件名|描述|开源协议|
|-------|-------|-------|
|package-ci-scheduler|集群调度器|MIT|
|package-ci-cluster|集群节点应用|MIT|
|package-ci-view|前端|MIT|
### 软件架构图
![功能架构图 ](https://package-ci.oss-cn-shanghai.aliyuncs.com/images/jg.svg)
### 功能特点
1. 低内存占用，完全抛弃docker容器，由node衍生进程（process）替代容器。
2. 轻量化应用，由node衍生的进程内仅有一个koa2应用，方便二次开发增减功能。
3. 完整工作流，项目从开发到功能测试再到UAT交付验收，直至最后项目上线正式环境，都有严格的工作阶段。
4. 大型集群节点，集群调度器[scheduler]可管理无数台节点服务器[cluster]。
5. 项目迁移，在调度器平台编辑项目所属节点，即可将项目从A服务器迁移至B服务器。
6. 指令集合，每个项目都有专属的指令集合，可以添加各种基于npm/yarn的指令，对项目进行各种常规操作（调度器源码已经屏蔽npm/yarn之外的任何指令）
7. GIT管理，可以对项目进行GIT管理（只读性操作）比如【指定分支克隆】【检出指定分支】【删除指定分支（本地）】【切换分支】【Commit记录】等等。
8. 团队成员，可以在平台内注册团队成员，每个成员可以和多个项目进行不同的身份绑定，使用不同权限对项目进行不同的日常操作。
### PACKAGE-CI常规目录操作
**package-ci-scheduler**
1. 调度器首次启动会在系统用户目录下创建package-ci-lib文件夹，会创建如下文件/目录，自动创建
1. rsa_public_key_1024.txt（项目公钥）自动创建
1. rsa_private_key_1024.txt（项目私钥）自动创建
1. static（资源目录）调度器创建项目时从git克隆的文件全部放在这里，自动创建

**package-ci-cluster**
1. 节点应用首次启动会在系统用户目录下创建package-ci-static文件夹，会创建如下文件/目录，自动创建
2. server.js（服务文件）用koajs编写由ncc编译，每次启动都会扫描如果缺失则会自动创建。
3. rsa_private_key_1024.txt 调度器里的私钥文件，调度器启动后会自动创建，然后复制到节点应用的目录内，这样调度器才能和节点通信
4. DEV（目录）该节点内所有项目的DEV环境静态资源全部存储在这里，自动创建
5. TEST（目录）该节点内所有项目的TEST环境静态资源全部存储在这里，自动创建
6. UAT（目录）该节点内所有项目的UAT环境静态资源全部存储在这里，自动创建
7. PROD（目录）该节点内所有项目的生产环境静态资源全部存储在这里，自动创建

### 如何启动软件
```javascript
  /*  
  【dev】 热启动项目
  【build】 将项目打包至dist目录
  【win/lux/mac】 是配置了pkg封包，可以把dist目录内build好的项目，封装为三个平台的可执行应用。
  */
"scripts": {
    "prebuild": "rimraf dist",
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "dev": "nest start --watch", 
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "win": "pkg . -t node14-win-x64",
    "lux": "pkg . -t node14-linux-x64",
    "mac": "pkg . -t node14-macos-x64"
  }
```
## 项目部署流程
| 环境     | 权限                         | 说明                                                                       |
| -------- | ---------------------------- | -------------------------------------------------------------------------- |
| DEV环境  | 开发成员                     | 该环境是给开发成员员线上调试专用，项目所绑定的开发成员可随意部署（无限制） |
| TEST环境 | 测试成员（QA）               | 该环境是给测试成员进行功能测试专用，只允许项目绑定的测试人员部署和操作     |
| UAT环境  | 项目经理（PM）               | 该环境是给开发成员员线上调试专用，项目所绑定的开发成员可随意部署（无限制） |
| PROD环境 | 项目经理（PM）测试成员（QA） | 项目正式上线，必须PM和QA全部确认后，由开发成员部署至生产环境（PROD）       |
## 软件截图
![WX20220614-061057@2x](https://package-ci.oss-cn-shanghai.aliyuncs.com/images/WX20220614-061057@2x.png)
![Xnip2022-06-14_06-11-35](https://package-ci.oss-cn-shanghai.aliyuncs.com/images/Xnip2022-06-14_06-11-35.jpg)
![Xnip2022-06-14_06-13-42](https://package-ci.oss-cn-shanghai.aliyuncs.com/images/Xnip2022-06-14_06-13-42.jpg)
![Xnip2022-06-14_06-18-49](https://package-ci.oss-cn-shanghai.aliyuncs.com/images/Xnip2022-06-14_06-18-49.jpg)
![Xnip2022-06-14_06-18-11](https://package-ci.oss-cn-shanghai.aliyuncs.com/images/Xnip2022-06-14_06-18-11.jpg)
![Xnip2022-06-14_06-20-01](https://package-ci.oss-cn-shanghai.aliyuncs.com/images/Xnip2022-06-14_06-20-01.jpg)
![Xnip2022-06-14_06-19-35](https://package-ci.oss-cn-shanghai.aliyuncs.com/images/Xnip2022-06-14_06-19-35.jpg)