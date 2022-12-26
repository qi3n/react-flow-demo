import { Button, Modal } from "antd";
import React, { useState } from "react";
import { EdgeProps, getBezierPath } from "reactflow";

import useEdgeClick from "../hooks/useEdgeClick";
import useEdgeOnClick from "../hooks/useEdgeOnClick";
import styles from "./EdgeTypes.module.css";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
}: EdgeProps) {
  // see the hook for implementation details
  // onClick adds a node in between the nodes that are connected by this edge

  // const createTaskNode = useEdgeClick(id);

  // const createBooleanNode = useEdgeOnClick(id);

  // const onClick = useEdgeOnClick(id);

  const [edgePath, edgeCenterX, edgeCenterY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* <Modal
        title="Choose the Node Type"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        <Button onClick={createTaskNode}>Task Node</Button>
        <Button onClick={createBooleanNode}>Boolean Node</Button>
      </Modal> */}
      <path
        id={id}
        style={style}
        className={styles.edgePath}
        d={edgePath}
        markerEnd={markerEnd}
      />
      <g transform={`translate(${edgeCenterX}, ${edgeCenterY})`}>
        <rect
          // onClick={onHandleEdgeClick}
          x={-10}
          y={-10}
          width={20}
          ry={4}
          rx={4}
          height={20}
          className={styles.edgeButton}
        />
        <text className={styles.edgeButtonText} y={5} x={-4}>
          +
        </text>
      </g>
    </>
  );
}
