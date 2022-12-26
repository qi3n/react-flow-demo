import React, { useEffect, useState } from "react";
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
  Switch,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { withSuccess } from "antd/es/modal/confirm";
import useCreateNode from "../hooks/useCreateNode";
import { useReactFlow } from "reactflow";
import { uuid } from "../utils";
const { Option } = Select;
export default function CreationTaskForm({
  onClose,
  open,
  nodeType,
  taskType,
  edgeId,
  //   setTaskReady,
  //   readOutside,
  //   sucOutside,
  //   setTaskSuc,
  //   isPreviousSuc,
  //   setIsPreviousSuc,
}) {
  // In edit component,
  const { setEdges, setNodes, getNode, getEdges, getEdge, getNodes } =
    useReactFlow();
  const [nodeInfo, setNodeInfo] = useState<any>({});
  const [suc, setSuc] = useState(false);
  const [ready, setReady] = useState(false);

  const [label, setLabel] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  //   useEffect(() => {
  //     setReady(readOutside);
  //   }, [readOutside]);

  //   useEffect(() => {
  //     setSuc(sucOutside);
  //   }, [sucOutside]);

  // const setNodeReady = (value: boolean) => {
  //   if (value === false) {
  //     setSuc(false);
  //     setReady(value);

  //     setNodeInfo({
  //       ...info,
  //       data: {
  //         ...info.data,
  //         isReady: value,
  //         isSuccess: value,
  //       },
  //     });
  //   } else {
  //     setReady(value);
  //     setNodeInfo({
  //       ...info,
  //       data: {
  //         ...info.data,
  //         isReady: value,
  //         isSuccess: suc,
  //       },
  //     });
  //   }
  // };

  const setNodeReady = (value: boolean) => {
    setReady(value);
    setNodeInfo({
      data: {
        ...nodeInfo.data,
        isReady: value,
        isSuccess: suc,
      },
    });
  };

  // const setNodeSuccess = (value: boolean) => {
  //   setSuc(value);
  //   setNodeInfo({
  //     ...info,
  //     data: {
  //       ...info.data,
  //       isSuccess: value,
  //       isReady: ready,
  //     },
  //   });
  // };

  const setNodeSuccess = (value: boolean) => {
    setSuc(value);
    setNodeInfo({
      data: {
        ...nodeInfo.data,
        isSuccess: value,
      },
    });
  };

  const setNodeEmail = (value: string) => {
    setEmail(value);
    setNodeInfo({
      data: {
        ...nodeInfo.data,
        email: value,
      },
    });
  };

  const setNodePhone = (value: string) => {
    setPhone(value);
    setNodeInfo({
      data: {
        ...nodeInfo.data,
        phone: value,
      },
    });
  };

  const setNodeName = (value: string) => {
    setNodeInfo({
      data: {
        ...nodeInfo.data,
        label: value,
      },
    });
  };

  const createNode = () => {
    const edge = getEdge(edgeId);

    if (!edge) {
      return;
    }
    const sourceNode = getNode(edge.source);
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
      data: { ...nodeInfo.data, isReady: isReady, isSuccess: false },
      type: "workflow",
    };
    console.log(nodeInfo);

    let sourceEdge;
    // new connection from source to new node
    if (sourceNode.type === "yesno") {
      sourceEdge = {
        id: `${edge.source}->${insertNodeId}-${edge.sourceHandle}`,
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
    let targetEdge;
    if (targetNode.type === "yesno") {
      targetEdge = {
        id: `${insertNodeId}->${edge.target}-${edge.sourceHandle}`,
        source: insertNodeId,
        target: edge.target,
        type: "workflow",
      };
    } else {
      targetEdge = {
        id: `${insertNodeId}->${edge.target}`,
        source: insertNodeId,
        target: edge.target,
        type: "workflow",
      };
    }

    setEdges((edges) =>
      edges.filter((e) => e.id !== edgeId).concat([sourceEdge, targetEdge])
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

  const onSubmitHandler = () => {
    // onChangeNode(nodeInfo);
    console.log("current edge id", edgeId);
    setNodeInfo({
      data: {
        ...nodeInfo.data,
        label: title,
      },
    });
    createNode();
    onClose();
  };

  let title = "";
  let recipient;

  if (taskType === "email") {
    title = "发送邮件提醒";
    recipient = (
      <Form.Item
        name="email"
        label="邮箱"
        rules={[{ required: true, message: "Please enter email" }]}
      >
        <Input onChange={(evt) => setNodeEmail(evt.target.value)} />
      </Form.Item>
    );
  } else if (taskType === "phone") {
    title = "发送短信提醒";
    recipient = (
      <Form.Item
        name="phone"
        label="手机号码"
        rules={[{ required: true, message: "Please enter Phone number" }]}
      >
        <Input onChange={(evt) => setNodePhone(evt.target.value)} />
      </Form.Item>
    );
  }

  return (
    <Drawer
      title={title}
      width={480}
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      //   extra={
      //     <Space>
      //       <Button onClick={onClose}>Cancel</Button>
      //       <Button onClick={onSubmitHandler} type="primary">
      //         Submit
      //       </Button>
      //     </Space>
      //   }
    >
      <Form
        initialValues={{ email: email, name: "" }}
        layout="vertical"
        onFinish={onSubmitHandler}
        hideRequiredMark
      >
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="name"
              label="任务名"
              rules={[{ required: true, message: "请输入任务名" }]}
            >
              <Input onChange={(evt) => setNodeName(evt.target.value)} />
            </Form.Item>
            {recipient}
          </Col>
        </Row>

        {/* <Row gutter={16}>
          <Form.Item>
            <Switch
              // disabled={!isPreviousSuc}
              checkedChildren="Ready"
              unCheckedChildren="Not Ready"
              checked={ready}
              onChange={setNodeReady}
            />
          </Form.Item>
        </Row> */}

        <Row gutter={16}>
          <Form.Item>
            <Switch
              checkedChildren="Success"
              unCheckedChildren="Not Success"
              checked={suc}
              onChange={setNodeSuccess}
            />
          </Form.Item>
        </Row>

        {/* <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="owner"
                label="Owner"
                rules={[{ required: true, message: "Please select an owner" }]}
              >
                <Select placeholder="Please select an owner">
                  <Option value="xiao">Xiaoxiao Fu</Option>
                  <Option value="mao">Maomao Zhou</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: "Please choose the type" }]}
              >
                <Select placeholder="Please choose the type">
                  <Option value="private">Private</Option>
                  <Option value="public">Public</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="approver"
                label="Approver"
                rules={[
                  { required: true, message: "Please choose the approver" },
                ]}
              >
                <Select placeholder="Please choose the approver">
                  <Option value="jack">Jack Ma</Option>
                  <Option value="tom">Tom Liu</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dateTime"
                label="DateTime"
                rules={[
                  { required: true, message: "Please choose the dateTime" },
                ]}
              >
                <DatePicker.RangePicker
                  style={{ width: "100%" }}
                  getPopupContainer={(trigger) => trigger.parentElement!}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: "please enter url description",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="please enter url description"
                />
              </Form.Item>
            </Col>
          </Row> */}
        <Form.Item wrapperCol={{ span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
