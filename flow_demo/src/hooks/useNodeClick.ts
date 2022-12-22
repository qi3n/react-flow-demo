import { useCallback } from "react";
import { NodeProps, useReactFlow, getOutgoers } from "reactflow";

import { uuid, randomLabel } from "../utils";

// this hook implements the logic for clicking a workflow node
// on workflow node click: create a new child node of the clicked node
export function useNodeClick(id: NodeProps["id"], setOpen) {
  const { setEdges, setNodes, getNodes, getEdges, getNode } = useReactFlow();

  const onClick = useCallback(() => {
    // we need the parent node object for positioning the new child node
    const parentNode = getNode(id);
    setOpen(true);

    if (!parentNode) {
      return;
    }

    // create a unique id for the child node
    const childNodeId = uuid();

    // create the child node
    const childNode = {
      id: childNodeId,
      // we try to place the child node close to the calculated position from the layout algorithm
      // 150 pixels below the parent node, this spacing can be adjusted in the useLayout hook
      position: { x: parentNode.position.x, y: parentNode.position.y + 150 },
      type: "workflow",
      data: { label: randomLabel() },
    };

    // we need to create a connection from parent to child
    const childEdge = {
      id: `${parentNode.id}=>${childNodeId}`,
      source: parentNode.id,
      target: childNodeId,
      type: "workflow",
    };

    // we need to create a connection from child to our placeholder
    const childPlaceholderEdge = {
      id: `${childNodeId}=>exit`,
      source: childNodeId,
      target: "exit",
      type: "workflow",
    };

    // setNodes((nodes) => nodes.concat([childNode]));

    // add the new edges (node -> child, child -> placeholder), filter out any placeholder edges
    // setEdges((edges) => edges.concat([childEdge, childPlaceholderEdge]));
  }, [getEdges, getNode, getNodes, id, setEdges, setNodes]);

  return onClick;
}

export default useNodeClick;
