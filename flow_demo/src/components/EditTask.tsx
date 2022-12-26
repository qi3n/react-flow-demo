import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Switch,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { withSuccess } from "antd/es/modal/confirm";
import TextArea from "antd/es/input/TextArea";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
const { Option } = Select;
const { RangePicker } = DatePicker;
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
  const [email, setEmail] = useState(info.data.email);
  const [phone, setPhone] = useState(info.data.phone);
  const [frequency, setFrequency] = useState(info.data.freqency);
  const [dateRange, setDateRange] = useState<any>(info.data.dateRange);
  const [content, setContent] = useState(info.data.content);

  const dateFormat = "YYYY-MM-DD";

  useEffect(() => {
    setReady(readOutside);
  }, [readOutside]);

  useEffect(() => {
    setSuc(sucOutside);
  }, [sucOutside]);

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

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setNodeInfo({
      ...info,
      data: {
        ...info.data,
        content: e.target.value,
      },
    });
  };

  const handleRangeDate = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", typeof dateString);
    setDateRange(dateString);
    setNodeInfo({
      ...info,
      data: {
        ...info.data,
        dateRange: dateString,
      },
    });
  };
  const handleFrequencyChange = (value: number) => {
    setFrequency(value);
    setNodeInfo({
      ...info,
      data: {
        ...info.data,
        freqency: value,
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

  const setNodeEmail = (value: string) => {
    setEmail(value);
    setNodeInfo({
      ...info,
      data: {
        ...info.data,
        email: value,
      },
    });
  };

  const setNodePhone = (value: string) => {
    setPhone(value);
    setNodeInfo({
      ...info,
      data: {
        ...info.data,
        phone: value,
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
      <Form
        layout="vertical"
        hideRequiredMark
        initialValues={{
          name: info.data.label,
          email: email,
          phone: phone,
          content: content,
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter task name" }]}
            >
              <Input onChange={(evt) => setNodeName(evt.target.value)} />
            </Form.Item>
            {info.data.taskType === "email" && (
              <Form.Item
                name="email"
                label="邮箱"
                rules={[{ required: true, message: "Please enter email" }]}
              >
                <Input onChange={(evt) => setNodeEmail(evt.target.value)} />
              </Form.Item>
            )}

            {info.data.taskType === "phone" && (
              <Form.Item
                name="phone"
                label="手机号码"
                rules={[
                  { required: true, message: "Please enter Phone number" },
                ]}
              >
                <Input onChange={(evt) => setNodePhone(evt.target.value)} />
              </Form.Item>
            )}

            <Form.Item
              name="content"
              label="提醒内容"
              rules={[{ required: true, message: "请输入提醒内容" }]}
            >
              <TextArea
                showCount
                maxLength={240}
                style={{ height: 200, marginBottom: 24 }}
                onChange={handleContentChange}
                placeholder="请输入"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={16}>
            <Form.Item name="dateRange" label="日期范围">
              <Space direction="vertical" size={12}>
                <RangePicker
                  defaultValue={[
                    dayjs("2022-12-28", dateFormat),
                    dayjs("2022-12-29", dateFormat),
                  ]}
                  onChange={handleRangeDate}
                />
              </Space>
            </Form.Item>
            <Form.Item name="frequency" label="频率">
              <InputNumber
                min={1}
                max={30}
                defaultValue={frequency}
                onChange={handleFrequencyChange}
              />
              {"   "}天
            </Form.Item>
          </Col>
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
              <Select
                placeholder="Please choose the branch"
                onChange={(value) => console.log(value)}
              >
                <Option value="notyet">Not Yet</Option>
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
