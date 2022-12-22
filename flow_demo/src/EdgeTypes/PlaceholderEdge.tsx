import React from "react";
import { getBezierPath, EdgeProps } from "reactflow";
import useEdgeClick from "../hooks/useEdgeClick";

import styles from "./EdgeTypes.module.css";

// the placeholder edges do not have a special functionality, only used as a visual
export default function PlaceholderEdge({
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
  const [edgePath, edgeCenterX, edgeCenterY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const onClick = useEdgeClick(id);
  return (
    <>
      <path
        id={id}
        style={style}
        className={styles.placeholderPath}
        d={edgePath}
        markerEnd={markerEnd}
      />
      <g transform={`translate(${edgeCenterX}, ${edgeCenterY})`}>
        <rect
          onClick={onClick}
          x={-10}
          y={-10}
          width={20}
          ry={4}
          rx={4}
          height={20}
          className={styles.phEdgeButton}
        />
        <text className={styles.phEdgeButtonText} y={5} x={-4}>
          +
        </text>
      </g>
    </>
  );
}
