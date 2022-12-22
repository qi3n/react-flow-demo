// 尝试添加有两个output的Node
import { EdgeProps, getOutgoers, useReactFlow } from "reactflow";

import { uuid, randomLabel } from "../utils";

// this hook implements the logic for clicking the button on a workflow edge
// on edge click: create a node in between the two nodes that are connected by the edge
function useEdgeOnClick(id: EdgeProps["id"]) {
  const { setEdges, setNodes, getNode, getEdges, getEdge, getNodes } =
    useReactFlow();

  const handleEdgeClick = () => {
    // first we retrieve the edge object to get the source and target id
    const edge = getEdge(id);

    if (!edge) {
      return;
    }
    const sourceNode = getNode(edge.source);
    if (!sourceNode) {
      return;
    }
    // we retrieve the target node to get its position
    const targetNode = getNode(edge.target);

    if (!targetNode) return;

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === targetNode.id) {
          // const nexts = getOutgoers(targetNode, getNodes(), getEdges());
          console.log(
            "I have change next node ready status. Node",
            targetNode.id
          );
          // TODO: 这里更改了isReady无效
          n.data = {
            ...n.data,
            isReady: false,
            isSuccess: false,
            isPrevious: false,
          };
        }
        return n;
      })
    );

    if (!targetNode) {
      return;
    }
    let isReady = false;
    if (sourceNode?.data.isSuccess) {
      isReady = true;
    }

    // create a unique id for newly added elements
    const insertNodeId = uuid();

    // this is the node object that will be added in between source and target node
    const insertNode = {
      id: insertNodeId,
      // we place the node at the current position of the target (prevents jumping)
      position: { x: targetNode.position.x, y: targetNode.position.y },
      data: {
        label: randomLabel() + " Boolean",
        isReady: isReady,
        isSuccess: false,
        output: "notyet",
      },
      type: "yesno",
    };
    let sourceEdge;
    // new connection from source to new node
    if (sourceNode.type === "yesno") {
      sourceEdge = {
        id: `${edge.source}->${insertNodeId}`,
        source: edge.source,
        sourceHandle: edge.sourceHandle,
        target: insertNodeId,
        type: "workflow",
      };
    } else {
      sourceEdge = {
        id: `${edge.source}->${insertNodeId}`,
        source: edge.source,
        target: insertNodeId,
        type: "workflow",
      };
    }

    // const sourceEdge = {
    //   id: `${edge.source}->${insertNodeId}`,
    //   source: edge.source,
    //   target: insertNodeId,
    //   type: "workflow",
    // };

    // new connection from new node to target
    const targetEdgeYes = {
      id: `${insertNodeId}->${edge.target}-yes`,
      source: insertNodeId,
      // label: "yes",
      sourceHandle: "yes",
      target: edge.target,
      type: "workflow",
    };

    const targetEdgeNo = {
      id: `${insertNodeId}->${edge.target}-no`,
      source: insertNodeId,
      data: {
        label: "no",
      },
      sourceHandle: "no",
      target: edge.target,
      type: "workflow",
    };
    // remove the edge that was clicked as we have a new connection with a node inbetween
    setEdges((edges) =>
      edges
        .filter((e) => e.id !== id)
        .concat([sourceEdge, targetEdgeYes, targetEdgeNo])
    );

    // insert the node between the source and target node in the react flow state
    setNodes((nodes) => {
      const targetNodeIndex = nodes.findIndex(
        (node) => node.id === edge.target
      );

      return [
        ...nodes.slice(0, targetNodeIndex),
        insertNode,
        ...nodes.slice(targetNodeIndex, nodes.length),
      ];
    });
  };

  return handleEdgeClick;
}

export default useEdgeOnClick;
