import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { JsonTable } from "react-json-to-html";

import { FlowFactory } from "../factory";
import { NodeInterface } from "../lib/Nodes/NodeInterface";
import { Modal } from "./Modal";

export type NodeHelpModalProps = {
  node: NodeInterface;
  open?: boolean;
  onClose: () => void;
};

export const NodeHelpModal: FC<NodeHelpModalProps> = ({
  node,
  open = false,
  onClose,
}) => {
  const [value, setValue] = useState<object>({});
  const { connUUID = "", hostUUID = "" } = useParams();
  const isRemote = connUUID && hostUUID ? true : false;

  const factory = new FlowFactory();

  const handleClose = () => {
    setValue({});
    onClose();
  };

  const fetchNodeHelp = async () => {
    const type = node.type ? node.type.split("/")[1] : "";
    const res =
      (await factory.NodeHelpByName(connUUID, hostUUID, isRemote, type)) || {};
    setValue(res);
  };

  useEffect(() => {
    fetchNodeHelp();
  }, [node]);

  return (
    <Modal
      title="Node Help"
      actions={[{ label: "Close", onClick: handleClose }]}
      open={open}
      onClose={onClose}
    >
      <JsonTable json={value || {}} />
    </Modal>
  );
};
