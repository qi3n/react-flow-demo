import { NodeTypes } from "reactflow";
import BooleanNode from "./BooleanNode";
import ExitNode from "./ExitNode";

import PlaceholderNode from "./PlaceholderNode";
import WorkflowNode from "./WorkflowNode";

// two different node types are needed for our example: workflow and placeholder nodes
const nodeTypes: NodeTypes = {
  placeholder: PlaceholderNode,
  workflow: WorkflowNode,
  exit: ExitNode,
  yesno: BooleanNode,
};

export default nodeTypes;
