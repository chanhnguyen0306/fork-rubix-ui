import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { FlowFactory } from "../factory";
import { NodeInterface } from "../lib/Nodes/NodeInterface";
import { Modal } from "./Modal";
import { InputSocket } from "./InputSocket";
import { InputSocketSpecJSON } from "../lib";

export type SetPayloadModalProps = {
  node: NodeInterface;
  inputs: any;
  open?: boolean;
  onClose: () => void;
};

export const SetPayloadModal: FC<SetPayloadModalProps> = ({
  node,
  inputs,
  open = false,
  onClose,
}) => {
  const [payload, setPayload] = useState<any>({});
  const [widthInput, setWidthInput] = useState(-1);

  const { connUUID = "", hostUUID = "" } = useParams();
  const isRemote = connUUID && hostUUID ? true : false;
  const factory = new FlowFactory();

  const handleChange = (key: string, value: any) => {
    setPayload((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    await factory.NodePayload(connUUID, hostUUID, isRemote, payload, node.id);
    onClose();
  };

  const handleSetWidthInput = (width: number) => {
    setWidthInput((prev: number) => Math.max(prev, width));
  };

  useEffect(() => {
    const generateData: any = {};
    inputs &&
      inputs.forEach((item: InputSocketSpecJSON) => {
        generateData[item.name] = item.defaultValue;
      });
    setPayload(generateData);
  }, [inputs, open]);

  return (
    <Modal
      title="Set Payload"
      actions={[
        { label: "Cancel", onClick: onClose },
        { label: "Set", onClick: handleSave },
      ]}
      open={open}
      onClose={onClose}
    >
      {inputs &&
        inputs.map((item: InputSocketSpecJSON, i: number) => (
          <div
            key={i}
            className="flex flex-row justify-between gap-8 relative my-3 px-4 py-3 bg-white"
          >
            <InputSocket
              {...item}
              value={payload[item.name]}
              onChange={handleChange}
              connected={false}
              minWidth={widthInput + 5}
              onSetWidthInput={handleSetWidthInput}
              dataInput={null}
              isHideConnect
              classnames="border border-gray-300 px-2 py-1 align-top w-full"
            />
          </div>
        ))}
    </Modal>
  );
};
