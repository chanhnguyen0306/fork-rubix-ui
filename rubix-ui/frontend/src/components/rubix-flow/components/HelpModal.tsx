import { List } from "antd";
import { FC } from "react";
import { Modal } from "./Modal";

export type HelpModalProps = {
  open?: boolean;
  onClose: () => void;
};

export const HelpModal: FC<HelpModalProps> = ({ open = false, onClose }) => {
  const noteList = [
    "Right click anywhere to add a new node.",
    "Left click to select nodes or connections, backspace to delete selected nodes or connections.",
    "Click and drag on a socket to connect to another socket of the same type.",
    "Hold shift and drag for multi-selection.",
    "Drag a connection into empty space to add a new node and connect it to the source.",
  ];

  return (
    <Modal
      title="Help"
      actions={[{ label: "Close", onClick: onClose }]}
      open={open}
      onClose={onClose}
    >
      <List
        size="small"
        dataSource={noteList}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </Modal>
  );
};
