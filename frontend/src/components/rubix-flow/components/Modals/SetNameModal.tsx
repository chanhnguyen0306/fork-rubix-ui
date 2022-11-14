import { FC, useState } from "react";

import { NodeSpecJSON } from "../../lib";
import { NodeInterface } from "../../lib/Nodes/NodeInterface";
import { InputSocket } from "../InputSocket";
import { Modal } from "../Modal";

export type SetNameModalProps = {
  node: NodeInterface;
  nodeType: NodeSpecJSON;
  open?: boolean;
  onClose: () => void;
};

export const SetNameModal: FC<SetNameModalProps> = ({
  node,
  nodeType,
  open = false,
  onClose,
}) => {
  const [name, setName] = useState<any>(null);

  const handleChange = (key: string, value: any) => {
    setName(value);
  };

  const handleSave = () => {
    /* handle */
    console.log("name", name);

    setName(null);
    onClose();
  };

  return (
    <Modal
      title="Set Name"
      actions={[
        { label: "Cancel", onClick: onClose },
        { label: "Set", onClick: handleSave },
      ]}
      open={open}
      onClose={onClose}
    >
      {nodeType && (
        <div className="flex flex-row justify-between gap-8 relative my-3 px-4 py-3 bg-white">
          <InputSocket
            classnames="border border-gray-300 px-2 py-1 align-top w-full"
            name={"Name"}
            valueType="string"
            value={name}
            onChange={handleChange}
            isHideConnect
          />
        </div>
      )}
    </Modal>
  );
};
