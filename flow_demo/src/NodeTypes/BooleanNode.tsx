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
import EditBooleanTask from "../components/EditBooleanTask";

const BooleanNode = ({ id, data }: NodeProps) => {
  // see the hook implementation for details of the click handler
  // calling onClick turns this node and the connecting edge into a workflow node
  const { setEdges, setNodes, getNodes, getEdges, getNode } = useReactFlow();
  const node = getNode(id);
  const [suc, setSuc] = useState(data.isSuccess);
  const [ready, setReady] = useState(data.isReady);
  const [isPreviousSuc, setIsPreviousSuc] = useState(data.isPreviousSuc);
  const [output, setOutput] = useState(data.output);

  const [open, setOpen] = useState(false);
  // see the hook implementation for details of the click handler
  // calling onClick adds a child node to this node
  const onClick = useNodeClickHandler(id, setOpen);

  useEffect(() => {
    const node = getNode(id);
    if (!node) return;

    setReady(node.data.isReady);
    setSuc(node.data.isSuccess);
    setOutput(node.data.output);
  }, [open, id]);

  // 这三个useEffect让表单的变化反映到flow里面
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

  // useEffect(() => {
  //   setNodes((nds) =>
  //     nds.map((n) => {
  //       if (n.id === id) {
  //         n.data = { ...n.data, output: output };
  //       }
  //       return n;
  //     })
  //   );
  // }, [output]);

  useEffect(() => {
    console.log(output);
    const setNones = getEdges()
      .filter((e) => e.source === id)
      .map((e) => e.target);

    const targetIDs = getEdges()
      .filter((e) => e.source === id && e.id.includes(output))
      .map((e) => e.target);

    console.log("targets ids", targetIDs);
    //const ids = getOutgoers(node, getNodes(), getEdges()).map((n) => n.id);
    // 得到所有什么BooleanNode相连的node id
    setNodes((nds) =>
      nds.map((n) => {
        if (node?.data.output !== "notyet" && setNones.includes(n.id)) {
          n.data = { ...n.data, isReady: false, isPreviousSuc: suc };
        }

        if (node?.data.output !== "notyet" && targetIDs.includes(n.id)) {
          n.data = { ...n.data, isReady: suc, isPreviousSuc: suc };
        }

        if (n.id === id) {
          n.data = { ...n.data, isSuccess: suc, output: output };
        }
        return n;
      })
    );
  }, [suc, output]);

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
        // if (nextNodesID.includes(item.id)) {
        //   item.data.isReady = true;
        // }
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
      <EditBooleanTask
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
        outputOfNode={output}
        setOutputOfNode={setOutput}
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
