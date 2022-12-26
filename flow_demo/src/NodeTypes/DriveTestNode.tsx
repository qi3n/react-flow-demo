import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import cx from "classnames";

import styles from "./NodeTypes.module.css";

const DriveTestNode = ({ id, data }: NodeProps) => {
  // see the hook implementation for details of the click handler
  // calling onClick turns this node and the connecting edge into a workflow node

  // const nodeClasses = cx(styles.node);
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
    <div className={nodeClasses} title="click to add a node">
      {data.label}
      <Handle
        className={styles.handle}
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
    </div>
  );
};

export default memo(DriveTestNode);
