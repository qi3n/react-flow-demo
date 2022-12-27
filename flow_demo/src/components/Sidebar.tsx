import { Button, Typography } from "antd";
import styles from "./Sidebar.module.css";

import React from "react";
const { Title } = Typography;
export default ({ onChangeEmpty, onChangeLeadDemo }) => {
  return (
    <aside className={styles.sidebarContainer}>
      <Title level={4}>Change Demo</Title>
      <Button onClick={onChangeEmpty}>空工作流</Button>
      <Button onClick={onChangeLeadDemo}>线索转机会</Button>
      <Button disabled={true}>看车</Button>
    </aside>
  );
};
