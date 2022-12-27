/**
 * This example shows how you can use custom nodes and edges to dynamically add elements to your react flow graph.
 * A global layouting function calculates the new positions for the nodes every time the graph changes and animates existing nodes to their new position.
 *
 * There are three ways of adding nodes to the graph:
 *  1. Click an existing node: Create a new child node of the clicked node
 *  2. Click on the plus icon of an existing edge: Create a node in between the connected nodes of the edge
 *  3. Click a placeholder node: Turn the placeholder into a "real" node to prevent jumping of the layout
 *
 * The graph elements are added via hook calls in the custom nodes and edges. The layout is calculated every time the graph changes (see hooks/useLayout.ts).
 **/
import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  ProOptions,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";

import useLayout from "./hooks/useLayout";
import nodeTypes from "./NodeTypes";
import edgeTypes from "./EdgeTypes";

import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
const { Title } = Typography;
const { Option } = Select;

import "reactflow/dist/style.css";
import styles from "./App.module.css";
import { randomLabel } from "./utils";
import useEdgeClick from "./hooks/useEdgeClick";
import useEdgeOnClick from "./hooks/useEdgeOnClick";
import CreateTaskForm from "./components/CreateTaskForm";
import Sidebar from "./components/Sidebar";

const proOptions: ProOptions = { account: "paid-no", hideAttribution: true };

const emptyNodes: Node[] = [
  {
    id: "entry",
    data: {
      label: "开始",
      isReady: true,
      isSuccess: false,
      isPreviousSuc: true,
    },
    position: { x: 0, y: 0 },
    type: "workflow",
  },
  {
    id: "exit",
    data: { label: "下一阶段" },
    position: { x: 0, y: 200 },
    type: "workflow",
  },
];

const emptyEdges: Edge[] = [
  {
    id: "entry=>exit",
    source: "entry",
    target: "exit",
    type: "workflow",
  },
];

const demoNodes1: Node[] = [
  {
    id: "entry",
    data: {
      label: "开始",
      isReady: true,
      isSuccess: false,
      isPreviousSuc: true,
    },
    position: { x: 0, y: 0 },
    type: "workflow",
  },
  {
    id: "1",
    data: {
      label: "完善客档信息",
      taskType: "customerDetails",
      content: "test content",
      frequency: 2,
      dateRange: ["2022-12-30", "2023-01-30"],
    },
    type: "workflow",
    position: { x: 0, y: 150 },
  },
  {
    id: "2",
    data: {
      label: "提醒预约试驾",
      taskType: "email",
      email: "zhengxu465@gmail.com",
      content: "test content",

      frequency: 2,
      dateRange: ["2022-12-27", "2023-12-30"],
    },
    type: "workflow",
    position: { x: 0, y: 300 },
  },
  {
    id: "3",
    data: {
      label: "车辆试驾",
      taskType: "driveTest",
      email: "zhengxu465@gmail.com",
      content: "test content",
      frequency: 2,
      dateValue: "2023-01-20",
      dateRange: ["2023-01-10", "2023-01-20"],
    },
    type: "workflow",
    position: { x: 0, y: 300 },
  },
  {
    id: "exit",
    data: { label: "下一阶段" },
    position: { x: 0, y: 450 },
    type: "workflow",
  },
];

const demoEdges1: Edge[] = [
  {
    id: "entry=>1",
    source: "entry",
    target: "1",
    type: "workflow",
  },
  {
    id: "1=>2",
    source: "1",
    target: "2",
    type: "workflow",
  },
  {
    id: "2=>3",
    source: "2",
    target: "3",
    type: "workflow",
  },
  {
    id: "3=>exit",
    source: "3",
    target: "exit",
    type: "workflow",
  },
];

// initial setup: one workflow node and a placeholder node
// placeholder nodes can be turned into a workflow node by click
const defaultNodes: Node[] = [
  {
    id: "entry",
    data: {
      label: "Entry",
      isReady: true,
      isSuccess: false,
      isPreviousSuc: true,
    },
    position: { x: 0, y: 0 },
    type: "workflow",
  },
  {
    id: "1",
    data: {
      label: "Task A",
      isReady: false,
      isSuccess: false,
      isPreviousSuc: false,
    },

    position: { x: 0, y: 150 },
    type: "workflow",
  },
  {
    id: "2",
    data: {
      label: "Task B",
      isReady: false,
      isSuccess: false,
      isPreviousSuc: false,
    },

    position: { x: 0, y: 300 },
    type: "workflow",
  },
  {
    id: "exit",
    data: { label: "Exit" },
    position: { x: 0, y: 450 },
    type: "workflow",
  },
];

// initial setup: connect the workflow node to the placeholder node with a placeholder edge
const defaultEdges: Edge[] = [
  {
    id: "entry=>1",
    source: "entry",
    target: "1",
    type: "workflow",
  },
  {
    id: "1=>2",
    source: "1",
    target: "2",
    type: "workflow",
  },
  {
    id: "2=>exit",
    source: "2",
    target: "exit",
    type: "workflow",
  },
];

const fitViewOptions = {
  padding: 0.95,
};

function ReactFlowDemo() {
  // this hook call ensures that the layout is re-calculated every time the graph changes
  useLayout();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreationOpen, setIsCreationOpen] = useState(false);

  const [currentEdgeId, setCurrentEdgeId] = useState("");
  const [currentNodeId, setCurrentNodeId] = useState("");
  const [nodeType, setNodeType] = useState("placeholder");
  const [taskType, setTaskType] = useState("");
  const [taskName, setTaskName] = useState("");
  const [workflow, setWorkflow] = useState({
    nodes: demoNodes1,
    edges: demoEdges1,
  });

  // useEffect(() => {}, [workflow]);
  const handleEmptyWorkFlow = () => {
    console.log("click empty workflow");
    setWorkflow({ nodes: emptyNodes, edges: emptyEdges });
  };

  const handleDemoWorkFlow = () => {
    setWorkflow({ nodes: demoNodes1, edges: demoEdges1 });
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showCreation = () => {
    setIsCreationOpen(true);
  };

  const handleCreationCancel = () => {
    setTaskName("");
    setIsCreationOpen(false);
  };

  // const createTaskNode = useEdgeClick(currentEdgeId);

  const createTaskNode = (taskType: string, nodeType: string) => {
    setNodeType(nodeType);
    setTaskType(taskType);
    if (taskType === "customerDetails") {
      setTaskName("完善客档信息");
    } else if (taskType === "email") {
      setTaskName("发送邮件提醒");
    } else if (taskType === "phone") {
      setTaskName("发送短信提醒");
    } else if (taskType === "driveTest") {
      setTaskName("车辆试驾");
    }
    handleOk();
    showCreation();
  };

  // const createBooleanNode = useEdgeOnClick(currentEdgeId);
  const createBooleanNode = () => {
    setNodeType("yesno");
    handleOk();
    showCreation();
  };

  const onEdgeClick = (e: any, edge: Edge) => {
    setCurrentEdgeId(edge.id);
    showModal();
  };

  return (
    <>
      <CreateTaskForm
        onClose={handleCreationCancel}
        open={isCreationOpen}
        nodeType={nodeType}
        taskType={taskType}
        edgeId={currentEdgeId}
        taskName={taskName}
      />

      <Modal
        title="选择任务类型"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
        width={280}
      >
        <div className={styles.modalContainer}>
          <div>
            <Title level={5}>提醒</Title>
            <Button onClick={() => createTaskNode("email", "workflow")}>
              邮件提醒
            </Button>
            <Button onClick={() => createTaskNode("phone", "workflow")}>
              电话提醒
            </Button>
          </div>
          <div>
            <Title level={5}>事件</Title>
            <Button
              onClick={() => createTaskNode("customerDetails", "workflow")}
            >
              完善客档信息
            </Button>
            <Button onClick={() => createTaskNode("driveTest", "workflow")}>
              预约试驾
            </Button>
            <Button disabled={true} onClick={createBooleanNode}>
              是否有车
            </Button>
          </div>
        </div>
      </Modal>
      <Sidebar
        onChangeEmpty={handleEmptyWorkFlow}
        onChangeLeadDemo={handleDemoWorkFlow}
      />
      <ReactFlow
        defaultNodes={workflow.nodes}
        defaultEdges={workflow.edges}
        nodes={workflow.nodes}
        edges={workflow.edges}
        // onNodeClick={onNodeClick}
        proOptions={proOptions}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitViewOptions={fitViewOptions}
        minZoom={0.2}
        nodesDraggable={true}
        nodesConnectable={true}
        zoomOnDoubleClick={false}
        onEdgeClick={onEdgeClick}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </>
  );
}

function ReactFlowWrapper() {
  return (
    <ReactFlowProvider>
      <ReactFlowDemo />
    </ReactFlowProvider>
  );
}

export default ReactFlowWrapper;
