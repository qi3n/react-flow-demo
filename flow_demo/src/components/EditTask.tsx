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
const { Option } = Select;
export default function EditTask({
  onClose,
  open,
  info,
  onChangeNode,
  setTaskReady,
  readOutside,
  sucOutside,
  setTaskSuc,
  isPreviousSuc,
  setIsPreviousSuc,
}) {
  // In edit component,
  const [nodeInfo, setNodeInfo] = useState<any>({});
  const [suc, setSuc] = useState(info.data.isSuccess);
  const [ready, setReady] = useState(info.data.isReady);

  useEffect(() => {
    setReady(readOutside);
  }, [readOutside]);

  useEffect(() => {
    setSuc(sucOutside);
  }, [sucOutside]);

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
    setTaskReady(value);
    setReady(value);
    setNodeInfo({
      ...info,
      data: {
        ...info.data,
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
    setTaskSuc(value);
    setNodeInfo({
      ...info,
      data: {
        ...info.data,
        isSuccess: value,
      },
    });
  };

  const setNodeName = (value: string) => {
    setNodeInfo({
      ...info,
      data: {
        ...info.data,
        label: value,
      },
    });
  };

  const onSubmitHandler = () => {
    onChangeNode(nodeInfo);
    onClose();
  };

  return (
    <Drawer
      title="Task Status"
      width={400}
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmitHandler} type="primary">
            Submit
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={16}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter task name" }]}
          >
            <Input
              defaultValue={info.data.label}
              onChange={(evt) => setNodeName(evt.target.value)}
            />
          </Form.Item>
        </Row>
        <Row gutter={16}>
          <Form.Item>
            <Switch
              // disabled={!isPreviousSuc}
              checkedChildren="Ready"
              unCheckedChildren="Not Ready"
              checked={ready}
              onChange={setNodeReady}
            />
          </Form.Item>
        </Row>

        <Row gutter={16}>
          <Form.Item>
            <Switch
              checkedChildren="Success"
              unCheckedChildren="Not Success"
              checked={sucOutside}
              onChange={setNodeSuccess}
            />
          </Form.Item>
        </Row>
        {info.type === "yesno" && (
          <Row gutter={16}>
            <Form.Item>
              <Select placeholder="Please choose the branch">
                <Option value="private">Private</Option>
                <Option value="yes">Yes</Option>
                <Option value="no">No</Option>
              </Select>
            </Form.Item>
          </Row>
        )}

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
      </Form>
    </Drawer>
  );
}
