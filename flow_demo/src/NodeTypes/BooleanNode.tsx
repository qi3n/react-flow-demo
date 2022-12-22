import React, { memo, useEffect, useState } from "react";
import {
  Handle,
  Position,
  NodeProps,
  useReactFlow,
  getOutgoers,
} from "reactflow";
import cx from "classnames";
import useNodeClickHandler from "../hooks/useNodeClick";
import styles from "./NodeTypes.module.css";
import EditTask from "../components/EditTask";
const leftHandleStyle = { left: 50 };
const rightHandleStyle = { right: 50 };

const BooleanNode = ({ id, data }: NodeProps) => {
  // see the hook implementation for details of the click handler
  // calling onClick turns this node and the connecting edge into a workflow node
  const { setEdges, setNodes, getNodes, getEdges, getNode } = useReactFlow();
  const node = getNode(id);
  const [suc, setSuc] = useState(data.isSuccess);
  const [ready, setReady] = useState(data.isReady);
  const [isPreviousSuc, setIsPreviousSuc] = useState(data.isPreviousSuc);

  const [open, setOpen] = useState(false);
  // see the hook implementation for details of the click handler
  // calling onClick adds a child node to this node
  const onClick = useNodeClickHandler(id, setOpen);

  useEffect(() => {
    const node = getNode(id);
    if (!node) return;
    console.log("opening is ready?", node.data.isReady);
    setReady(node.data.isReady);
    setSuc(node.data.isSuccess);
  }, [open]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          n.data = { ...n.data, isReady: ready };
        }
        return n;
      })
    );
  }, [ready]);

  useEffect(() => {
    const ids = getOutgoers(node, getNodes(), getEdges()).map((n) => n.id);
    // 得到所有什么BooleanNode相连的
    setNodes((nds) =>
      nds.map((n) => {
        if (ids.includes(n.id)) {
          n.data = { ...n.data, isReady: suc, isPreviousSuc: suc };
        }
        if (n.id === id) {
          n.data = { ...n.data, isSuccess: suc };
        }
        return n;
      })
    );
  }, [suc]);
  const onClose = () => {
    setOpen(false);
  };

  let nextNodesID;
  if (node?.data.isSuccess) {
    nextNodesID = getOutgoers(node, getNodes(), getEdges()).map((n) => n.id);
  } else {
    nextNodesID = [];
  }

  // where nodes actually change
  const onChangeNode = (val: any) => {
    setNodes((nds) =>
      nds.map((item) => {
        if (item.id === val.id) {
          item.data.label = val.data.label;
        }
        if (nextNodesID.includes(item.id)) {
          item.data.isReady = true;
        }
        return item;
      })
    );
  };
  // change styles based on the status
  let nodeClasses;
  if (data.isReady) {
    if (data.isSuccess) {
      nodeClasses = cx(styles.node, styles.nodeSuc);
    } else {
      nodeClasses = cx(styles.node);
    }
  } else {
    nodeClasses = cx(styles.node, styles.placeholder);
  }

  return (
    <>
      <EditTask
        onClose={onClose}
        open={open}
        info={node}
        setTaskReady={setReady}
        onChangeNode={onChangeNode}
        readOutside={ready}
        sucOutside={suc}
        setTaskSuc={setSuc}
        isPreviousSuc={isPreviousSuc}
        setIsPreviousSuc={setIsPreviousSuc}
      />
      <div
        onClick={onClick}
        className={nodeClasses}
        title="click to add a node"
      >
        {data.label}
        <Handle
          className={styles.handle}
          type="target"
          position={Position.Top}
          isConnectable={false}
        />

        <Handle
          className={styles.handle}
          type="source"
          position={Position.Left}
          id="yes"
          isConnectable={true}
        />

        <Handle
          className={styles.handle}
          type="source"
          position={Position.Right}
          id="no"
          isConnectable={true}
        />
      </div>
    </>
  );
};

export default memo(BooleanNode);
