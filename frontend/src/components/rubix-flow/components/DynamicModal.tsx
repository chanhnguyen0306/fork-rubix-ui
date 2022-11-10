import { ChangeEvent, FC, useEffect, useState } from "react";

import { NodeInterface } from "../lib/Nodes/NodeInterface";
import { Modal } from "./Modal";
import { REGEX_NUMBER } from "./InputSocket";

export type DynamicInputModalProps = {
  node: NodeInterface;
  open?: boolean;
  isInput: boolean;
  onClose: () => void;
  onSubmit: (count: NodeInterface) => void;
};

export type NodeInputJSON = {
  pin: string;
  dataType: string;
  value: any;
};

const getCountDynamic = (data: any, isInput: boolean) => {
  if (!data) return 0;

  const newData = { ...data };
  if (isInput) {
    if (newData.inputs) delete newData.inputs;
    if (newData.out) delete newData.out;
  }

  return Object.keys(newData).length;
};

export const DynamicInputModal: FC<DynamicInputModalProps> = ({
  node,
  open = false,
  isInput,
  onClose,
  onSubmit,
}) => {
  const [value, setValue] = useState<string>("");

  const handleClose = () => {
    setValue("");
    onClose();
  };

  const handleSubmit = () => {
    const type = isInput ? "inputs" : "out";
    const countInput = Number(value);
    const count = getCountDynamic(isInput ? node.data : node.data.out, isInput);

    let newData = { ...node.data };
    let idxLoop = count + 1;

    if (count > countInput) {
      newData = {};
      idxLoop = 1;
    }

    for (let i = idxLoop; i <= countInput; i++) {
      const inputName = isInput ? `in${i}` : `out${i}`;
      const item = {
        pin: inputName,
        dataType: "number",
        value: null,
      };

      if (newData[type]) {
        newData[type].push(item);
      } else {
        newData[type] = [item];
      }
    }

    onSubmit({ ...node, data: newData });
  };

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleBlurValue = (e: ChangeEvent<HTMLInputElement>) => {
    const _value = e.target.value;
    if (_value.match(REGEX_NUMBER)) setValue(_value);
    else setValue("0");
  };

  useEffect(() => {
    const count = getCountDynamic(isInput ? node.data : node.data.out, isInput);
    setValue(count.toString());
  }, [node, open]);

  return (
    <Modal
      title="Dynamic Input Count"
      actions={[
        { label: "Close", onClick: handleClose },
        { label: "Save", onClick: handleSubmit },
      ]}
      open={open}
      onClose={onClose}
    >
      <div className="flex items-center space-x-4 mx-3 my-5">
        <div>Count</div>
        <input
          className="w-full border border-gray-300 p-2"
          type="text"
          value={value}
          onChange={handleChangeValue}
          onBlur={handleBlurValue}
        />
      </div>
    </Modal>
  );
};
