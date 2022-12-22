import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import cx from "classnames";

import styles from "./NodeTypes.module.css";
const leftHandleStyle = { left: 10 };
const rightHandleStyle = { right: 10 };

const BooleanNode = ({ id, data }: NodeProps) => {
  // see the hook implementation for details of the click handler
  // calling onClick turns this node and the connecting edge into a workflow node

  const nodeClasses = cx(styles.node);

  return (
    <div className={nodeClasses} title="click to add a node">
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
        position={Position.Bottom}
        isConnectable={false}
        style={leftHandleStyle}
      />

      <Handle
        className={styles.handle}
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        style={rightHandleStyle}
      />
    </div>
  );
};

export default memo(BooleanNode);
