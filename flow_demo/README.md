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

### 项目结构

- `App.tsx` 程序主入口
- `components/EditTask.tsx` 编辑任务节点内容，修改相应状态。
- `EdgeTypes/`和`NodeTypes/`文件夹分别是自定义 Edge 和自定义 Node
- `hooks/useEdgeClick.ts` 处理单击 Edge 事件

### 目前完成

1. 当前一个任务处于完成时(isSuccess==true)会将其下一个任务改为可就绪状态
2. 状态改变时，根据不同状态显示不同颜色，Ready 时可以显示蓝色，已经成功执行显示绿色
3. 点击连接线(edge)上的[+]直接添加默认任务

### 已知问题

- ~~在前一个节点变为 Success，当前节点只在图表上进行更改，右侧弹出的表单并不会变化~~
- 在已完成的两个节点间添加新节点时，第二个已完成节点的子节点不能更新为未就绪状态。可考虑在已完成的两个节点间取消添加节点功能，因为已经完成的两个任务间没必要在添加新任务。

### TODO

1. 点击连接线(edge)上的[+]弹出 modal 选择要添加的任务的类型。
2. 选择任务类型后，右侧弹出配置界面，点击提交后，在相应位置添加任务节点
3. 删除节点，并确保剩余节点正确连接

### DOING

- 添加 BooleanNode
