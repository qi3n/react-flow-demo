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
import React, { useCallback, useState } from "react";
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
  Row,
  Select,
  Space,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
const { Option } = Select;

import "reactflow/dist/style.css";
import { randomLabel } from "./utils";

const proOptions: ProOptions = { account: "paid-no", hideAttribution: true };

// initial setup: one workflow node and a placeholder node
// placeholder nodes can be turned into a workflow node by click
const defaultNodes: Node[] = [
  {
    id: "entry",
    data: {
      label: "Entry",
      isReady: true,
      isSuccess: true,
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
    type: "exit",
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

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  return (
    <>
      <ReactFlow
        defaultNodes={defaultNodes}
        defaultEdges={defaultEdges}
        // onNodeClick={onNodeClick}
        proOptions={proOptions}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitViewOptions={fitViewOptions}
        onInit={reactFlowInstance}
        minZoom={0.2}
        nodesDraggable={true}
        nodesConnectable={true}
        zoomOnDoubleClick={false}
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
