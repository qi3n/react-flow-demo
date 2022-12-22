import React, { memo, useEffect, useState } from "react";
import {
  Handle,
  Position,
  NodeProps,
  useReactFlow,
  getOutgoers,
} from "reactflow";
import cx from "classnames";

import styles from "./NodeTypes.module.css";
import useNodeClickHandler from "../hooks/useNodeClick";

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
import EditTask from "../components/EditTask";

const WorkflowNode = ({ id, data }: NodeProps) => {
  const [suc, setSuc] = useState(data.isSuccess);
  const [ready, setReady] = useState(data.isReady);

  const { setEdges, setNodes, getNodes, getEdges, getNode } = useReactFlow();
  const [open, setOpen] = useState(false);
  // see the hook implementation for details of the click handler
  // calling onClick adds a child node to this node
  const onClick = useNodeClickHandler(id, setOpen);

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
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === ids[0]) {
          n.data = { ...n.data, isReady: ready };
        }
        return n;
      })
    );
  }, [suc]);
  const node = getNode(id);
  let nextNodesID;
  if (node?.data.isSuccess) {
    nextNodesID = getOutgoers(node, getNodes(), getEdges()).map((n) => n.id);
    console.log(nextNodesID);
  } else {
    nextNodesID = [];
  }

  const onClose = () => {
    setOpen(false);
  };

  // where nodes actually change
  const onChangeNode = (val: any) => {
    setNodes((nds) =>
      nds.map((item) => {
        if (item.id === val.id) {
          item.data.label = val.data.label;
          item.data.isReady = val.data.isReady;
          item.data.isSuccess = val.data.isSuccess;
        }
        if (nextNodesID.includes(item.id)) {
          item.data.isReady = true;
        }
        return item;
      })
    );
  };
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
        setReadyFromOutside={setReady}
        onChangeNode={onChangeNode}
        readOutside={ready}
        sucOutside={suc}
        setSucOutside={setSuc}
      />
      <div
        onClick={onClick}
        className={nodeClasses}
        title="click to add a child node"
      >
        {data.label}
        <Handle
          className={styles.handle}
          type="target"
          position={Position.Top}
          isConnectable={true}
        />
        <div className={styles.close}>
          <CloseOutlined
            onClick={(e) => {
              e.stopPropagation();
              data.onChange(id);
            }}
            className={styles.ico}
          />
        </div>
        <Handle
          className={styles.handle}
          type="source"
          position={Position.Bottom}
          isConnectable={true}
        />
      </div>
    </>
  );
};

export default memo(WorkflowNode);
