import { Button, Popover } from "antd";
import React, { useState } from "react";

interface RbConfirmPopoverI {
  handleOk: () => void;
  title: string;
  buttonTitle: string;
}

const RbConfirmPopover = (props: RbConfirmPopoverI) => {
  const { handleOk, title, buttonTitle } = props;
  const [visible, setVisible] = useState(false);

  const hide = () => {
    setVisible(false);
  };

  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible);
  };

  const handleClick = () => {
    handleOk();
    hide();
  };

  return (
    <Popover
      content={
        <div>
          <p>Are you sure?</p>
          <span
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              style={{ marginRight: 10 }}
              type="primary"
              onClick={handleClick}
            >
              OK
            </Button>
            <a style={{ color: "grey" }} onClick={hide}>
              Close
            </a>
          </span>
        </div>
      }
      title={title}
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <Button type="primary">
        {buttonTitle}
      </Button>
    </Popover>
  );
};

export default RbConfirmPopover;
