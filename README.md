# Workflow spike with react flow 

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

### 功能描述

当前可以模拟任务就绪、成功与否。单击节点可以写改该节点相关配置，为了方便模拟，可以在配置表单修改 Ready 和 Success 状态。单击连接线上的+按钮可以添加一个新节点。如果一个节点可以开始执行任务，就是就绪 Ready 状态，变成蓝色，当任务执行完成时就变成绿色，并且该已完成任务的子节点自动变成可就绪状态。

如果在已完成节点和其子节点（就绪状态）添加一个新的子节点，那么这个新的子节点将会是就绪状态，之前已经就绪的节点变成未就绪状态。

### 项目结构

- `App.tsx` 程序主入口
- `components/EditTask.tsx` 编辑任务节点内容，修改相应状态。
- `EdgeTypes/`和`NodeTypes/`文件夹分别是自定义 Edge 和自定义 Node
- `hooks/useEdgeClick.ts` 处理单击 Edge 事件

### 目前完成

1. 当前一个任务处于完成时(isSuccess==true)会将其下一个任务改为可就绪状态
2. 状态改变时，根据不同状态显示不同颜色，Ready 时可以显示蓝色，已经成功执行显示绿色
3. ~~点击连接线(edge)上的[+]直接添加默认任务~~s
4. 点击连接线(edge)上的[+]弹出 modal 选择要添加的任务的类型。

### 已知问题

- ~~在前一个节点变为 Success，当前节点只在图表上进行更改，右侧弹出的表单并不会变化~~
- 在已完成的两个节点间添加新节点时，第二个已完成节点的子节点不能更新为未就绪状态。可考虑在已完成的两个节点间取消添加节点功能，因为已经完成的两个任务间没必要在添加新任务。
- 

### TODO

1. ~~点击连接线(edge)上的[+]弹出 modal 选择要添加的任务的类型。~~
2. 选择任务类型后，右侧弹出配置界面，点击提交后，在相应位置添加任务节点
3. 删除节点，并确保剩余节点正确连接
4. 添加 Wait 节点类型，该节点作用是等待多长时间后开始执行下一任务
5. ~~添加 Boolean 节点类型~~

### DOING

- [ ] refactor the code 
