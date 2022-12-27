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
  const [nodeInfo, setNodeInfo] = useState<any>(info);
  const [suc, setSuc] = useState(info.data.isSuccess);
  const [ready, setReady] = useState(info.data.isReady);
  const [email, setEmail] = useState(info.data.email);
  const [phone, setPhone] = useState(info.data.phone);
  const [frequency, setFrequency] = useState(info.data.frequency);
  const [dateRange, setDateRange] = useState<any>(info.data.dateRange);
  const [content, setContent] = useState(info.data.content);

  const [date, setDate] = useState(info.data.dateValue);

  const dateFormat = "YYYY-MM-DD";

  useEffect(() => {
    setReady(readOutside);
  }, [readOutside]);

  useEffect(() => {
    setSuc(sucOutside);
  }, [sucOutside]);

  const handleDateChange = (value: DatePickerProps["value"]) => {
    console.log("Selected Time: ", value);

    setDate(value);
    setNodeInfo({
      ...nodeInfo,
      data: {
        ...nodeInfo.data,
        dateValue: value,
      },
    });
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
  };

  const setNodeReady = (value: boolean) => {
    setTaskReady(value);
    setReady(value);
    setNodeInfo({
      ...nodeInfo,
      data: {
        ...nodeInfo.data,
        isReady: value,
        isSuccess: suc,
      },
    });
  };

  const setNodeSuccess = (value: boolean) => {
    setTaskSuc(value);
    setNodeInfo({
      ...nodeInfo,
      data: {
        ...nodeInfo.data,
        isSuccess: value,
      },
    });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setNodeInfo({
      ...nodeInfo,
      data: {
        ...nodeInfo.data,
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
      ...nodeInfo,
      data: {
        ...nodeInfo.data,
        dateRange: dateString,
      },
    });
  };

  const handleFrequencyChange = (value: number) => {
    setFrequency(value);
    setNodeInfo({
      ...nodeInfo,
      data: {
        ...nodeInfo.data,
        frequency: value,
      },
    });
  };

  const setNodeName = (value: string) => {
    setNodeInfo({
      ...nodeInfo,
      data: {
        ...nodeInfo.data,
        label: value,
      },
    });
  };

  const setNodeEmail = (value: string) => {
    setEmail(value);
    setNodeInfo({
      ...nodeInfo,
      data: {
        ...nodeInfo.data,
        email: value,
      },
    });
  };

  const setNodePhone = (value: string) => {
    setPhone(value);
    setNodeInfo({
      ...nodeInfo,
      data: {
        ...nodeInfo.data,
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
      width={350}
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
          taskName: info.data.label,
          email: email,
          phone: phone,
          content: content,
          frequency: frequency,
        }}
        onFinish={onSubmitHandler}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="taskName"
              label="Name"
              rules={[{ required: true, message: "Please enter task name" }]}
            >
              <Input onChange={(evt) => setNodeName(evt.target.value)} />
            </Form.Item>
            {info.data.taskType === "email" ||
              (info.data.taskType === "driveTest" && (
                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[{ required: true, message: "Please enter email" }]}
                >
                  <Input onChange={(evt) => setNodeEmail(evt.target.value)} />
                </Form.Item>
              ))}

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
          </Col>
        </Row>
        {info.id !== "entry" && info.id !== "exit" && (
          <Row gutter={16}>
            <Col span={24}>
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
              {info.data.taskType === "driveTest" && (
                <Form.Item
                  name="date"
                  label="试驾日期"
                  rules={[
                    {
                      type: "object" as const,
                      required: true,
                      message: "Please select date",
                    },
                  ]}
                >
                  <DatePicker
                    defaultValue={dayjs(date, dateFormat)}
                    // disabledDate={disabledDate}
                    onChange={handleDateChange}
                  />
                </Form.Item>
              )}
              <Form.Item
                name="dateRange"
                label="日期范围"
                rules={[
                  {
                    type: "array" as const,
                    required: true,
                    message: "Please select date",
                  },
                ]}
              >
                <RangePicker
                  disabledDate={disabledDate}
                  defaultValue={[
                    dayjs(dateRange[0], dateFormat),
                    dayjs(dateRange[1], dateFormat),
                  ]}
                  onChange={handleRangeDate}
                />
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
        )}

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
      </Form>
    </Drawer>
  );
}
