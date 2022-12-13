import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import TextUpdaterNode from "./components/CustomNodes/TextUpdaterNode.js";
import Sidebar from "./components/Sidebar";
import "./index.css";

import "reactflow/dist/style.css";
import "./text-updater-node.css";
import "./updatenode.css";

const rfStyle = {
  backgroundColor: "#B8CEFF",
};

const initialNodes = [
  {
    id: "1",
    data: { label: "Contact enrollment trigger" },
    type: "input",
    position: { x: 200, y: 100 },
  },
  {
    id: "2",
    data: { label: "Task2" },
    position: { x: 200, y: 200 },
  },
  {
    id: "3",
    data: { label: "Task3" },
    position: { x: 200, y: 300 },
    style: {
      background: "#fff",
      border: "1px solid black",
      borderRadius: 15,
      fontSize: 12,
      textAlign: "center",
    },
  },
];

const initialEdges = [
  { id: "edge-1", source: "1", target: "2", sourceHandle: "b" },
];

let id = initialNodes.length;
const getId = () => `dndnode_${id++}`;

function Flow() {
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  console.log(edges);

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const nodeTypes = useMemo(
    () => ({
      textUpdater: TextUpdaterNode,
    }),
    []
  );

  const [nodeName, setNodeName] = useState("Task 2");
  const [nodeBg, setNodeBg] = useState("#eee");

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "2") {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = {
            ...node.data,
            label: nodeName,
          };
        }

        return node;
      })
    );
  }, [nodeName, setNodes]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "2") {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.style = { ...node.style, backgroundColor: nodeBg };
        }

        return node;
      })
    );
  }, [nodeBg, setNodes]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `Task ${id}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onDoubleClick = (event) => {
    event.preventDefault();
    console.log(`double click `);
    console.log(event);
  };

  return (
    <div style={{ height: "100%", weight: "100%" }} className="dndflow">
      <ReactFlowProvider>
        <Sidebar />
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDoubleClick={onDoubleClick}
            fitView
            style={rfStyle}
            className="touchdevice-flow"
          >
            <Background />
            <div className="updatenode__controls">
              <label>label:</label>
              <input
                value={nodeName}
                onChange={(evt) => setNodeName(evt.target.value)}
              />

              <label className="updatenode__bglabel">background:</label>
              <input
                value={nodeBg}
                onChange={(evt) => setNodeBg(evt.target.value)}
              />
            </div>
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default Flow;
