import { useEffect, useRef } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import {
  Connection,
  Handle,
  Position,
  useReactFlow,
} from "react-flow-renderer/nocss";
import cx from "classnames";
import { colors, valueTypeColorMap } from "../util/colors";
import { isValidConnection } from "../util/isValidConnection";
import { OutputSocketSpecJSON } from "../lib";
import { AutoSizeInput } from "./AutoSizeInput";

export type OutputSocketProps = {
  connected: boolean;
  minWidth: number;
  dataOut: Array<any>;
  onSetWidthInput: (width: number) => void
} & OutputSocketSpecJSON;

export const OutputSocket = ({
  connected,
  valueType,
  name,
  minWidth,
  dataOut,
  onSetWidthInput
}: OutputSocketProps) => {
  const instance = useReactFlow();
  const refName = useRef<any>(null);

  const showFlowIcon = valueType === "flow";
  const colorName = valueTypeColorMap[valueType];
  const [backgroundColor, borderColor] = colors[colorName];

  const getValueOutput = (outputName: string) =>
    dataOut &&
    dataOut.find((item: { pin: string }) => item.pin === outputName).value;

  const getValueOptions = (value: boolean | null) => {
    switch (value) {
      case true:
      case false:
        return `${value}`;
      case null:
        return "null";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (refName.current) {
      const _width = refName.current.offsetWidth;
      onSetWidthInput(_width);
    }
  }, [refName]);

  return (
    <div className="flex grow items-center justify-end h-7">
      <AutoSizeInput
        type="text"
        className="bg-gray-600 disabled:bg-gray-700 py-1 px-2 mr-2 nodrag"
        value={
          (valueType === "boolean"
            ? getValueOptions(getValueOutput(name))
            : getValueOutput(name)) || ""
        }
        minWidth={40}
        disabled
      />
      {showFlowIcon && (
        <CaretRightOutlined style={{ color: "#ffffff", fontSize: "large" }} />
      )}
      {showFlowIcon === false && (
        <div
          ref={refName}
          className="flex justify-end"
          style={{ minWidth: minWidth === -1 ? "max-content" : minWidth }}
        >
          {name}
        </div>
      )}
      <Handle
        id={name}
        type="source"
        position={Position.Right}
        className={cx(
          borderColor,
          connected ? backgroundColor : "bg-gray-1100"
        )}
        isValidConnection={(connection: Connection) =>
          isValidConnection(connection, instance)
        }
      />
    </div>
  );
};
