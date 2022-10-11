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
    "Left click to select nodes or connections.",
    "Press Delete key to remove selected nodes or connections.",
    "Click and drag on a socket to connect to another socket of the same type.",
    "Hold shift and drag for multi-selection.",
    "Drag a connection into empty space to add a new node and connect it to the source.",
    "Hold ctrl and a to select all node.",
    "Hold ctrl and e for export to nodes .",
    "Hold Ctrl and i for import to nodes.",  
    "Hold Ctrl and d to delete nodes selected.",
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
        renderItem={(item) => (
          <List.Item
            className="black--text"
            style={{ borderBottom: "1px solid #f0f0f0" }}
          >
            {item}
          </List.Item>
        )}
      />
    </Modal>
  );
};
