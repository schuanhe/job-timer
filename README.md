# 工资计时器

一个基于Vue 3的实时工资计算器，帮助你直观地了解工作时间和收入情况。

## 主要功能

- 🕒 实时工作时间显示
- 💰 实时工资计算（每秒更新）
- ⏰ 下班倒计时
- 📅 周末倒计时
- 💵 今日/本周/本月收入统计
- ⚙️ 自定义工作时间和工资设置

## 技术栈

- Vue 3
- TypeScript
- Vite
- Vue Router

## 安装和运行

1. 克隆项目到本地

```bash
git clone https://github.com/schuanhe/job-timer.git
cd 每秒的钱
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

4. 构建生产版本

```bash
npm run build
```

## 项目截图

![工作配置截图](![工作配置截图](URL_ADDRESS.com/schuanhe/job-timer/blob/main/src/assets/config.png)
![工作倒计时截图](![工作倒计时截图](URL_ADDRESS.com/schuanhe/job-timer/blob/main/src/assets/timer.png)


## 项目结构

```
├── src/
│   ├── components/         # 组件目录
│   │   ├── SalaryTimer.vue # 工资计时器组件
│   │   └── WorkInfoForm.vue# 工作信息设置组件
│   ├── data/              # 数据目录
│   │   └── workInfo.json  # 默认工作信息配置
│   ├── router/            # 路由配置
│   └── App.vue           # 根组件
├── public/               # 静态资源
└── index.html           # 入口HTML文件
```

## 使用说明

1. 首次使用时，点击设置按钮配置您的工作信息：
   - 工作时间（开始时间和结束时间）
   - 月工资
   - 工作日（默认周一至周五）

2. 系统会自动根据您的设置：
   - 显示实时工作状态
   - 计算当前已赚取的工资
   - 显示下班倒计时
   - 统计今日、本周和本月的收入

3. 所有设置都会保存在本地，下次访问时自动加载

## 注意事项

- 工资计算基于工作日和工作时间自动进行
- 非工作时间不会计入收入统计
- 所有数据都保存在本地浏览器中，不会上传到服务器