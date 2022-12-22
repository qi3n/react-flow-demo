# Workflow spike

To run this demo, please do the following steps:

1. Install dependencies

```
npm install
```

2. Run the dev environment

```
npm start
```

React Flow Documentation
https://reactflow.dev/docs/introduction/

### 目前完成

1. 当前一个任务处于完成时(isSuccess==true)会将其下一个任务改为可就绪状态
2. 点击连接线(edge)上的[+]直接添加默认任务

### 已知问题

1. ~~在前一个节点变为 Success，当前节点只在图表上进行更改，右侧弹出的表单并不会变化~~

### TODO

1. 点击连接线(edge)上的[+]弹出 modal 选择要添加的任务的类型。
2. 选择任务类型后，右侧弹出配置界面，点击提交后，在相应位置添加任务节点
3. 删除节点
