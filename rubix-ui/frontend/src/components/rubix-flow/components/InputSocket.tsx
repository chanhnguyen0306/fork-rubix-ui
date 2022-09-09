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
import { AutoSizeInput } from "./AutoSizeInput";
import { InputSocketSpecJSON } from "../lib";

export type InputSocketProps = {
  connected: boolean;
  value: any | undefined;
  onChange: (key: string, value: any) => void;
} & InputSocketSpecJSON;

export const InputSocket = ({
  connected,
  value,
  onChange,
  name,
  valueType,
  defaultValue,
}: InputSocketProps) => {
  const instance = useReactFlow();
  const showFlowIcon = valueType === "flow";
  const colorName = valueTypeColorMap[valueType];
  const [backgroundColor, borderColor] = colors[colorName];
  return (
    <div className="flex grow items-center justify-start h-7">
      {showFlowIcon && (
        <CaretRightOutlined style={{ color: "#ffffff", fontSize: "large" }} />
      )}
      {showFlowIcon === false && (
        <>
          <div className="capitalize mr-2">{name}</div>
          {connected === false && (
            <>
              {valueType === "string" && (
                <AutoSizeInput
                  type="text"
                  className=" bg-gray-600 disabled:bg-gray-700 py-1 px-2 nodrag"
                  value={String(value) ?? defaultValue ?? ""}
                  onChange={(e) => onChange(name, e.currentTarget.value)}
                />
              )}
              {valueType === "number" && (
                <AutoSizeInput
                  type="number"
                  className=" bg-gray-600 disabled:bg-gray-700 py-1 px-2 nodrag"
                  value={String(value) ?? defaultValue ?? ""}
                  onChange={(e) => onChange(name, e.currentTarget.value)}
                />
              )}
              {valueType === "boolean" && (
                <input
                  type="checkbox"
                  className=" bg-gray-600 disabled:bg-gray-700 py-1 px-2 nodrag"
                  value={String(value) ?? defaultValue ?? ""}
                  onChange={(e) => onChange(name, e.currentTarget.checked)}
                />
              )}
            </>
          )}
        </>
      )}
      <Handle
        id={name}
        type="target"
        position={Position.Left}
        className={cx(borderColor, connected ? backgroundColor : "bg-gray-800")}
        isValidConnection={(connection: Connection) =>
          isValidConnection(connection, instance)
        }
      />
    </div>
  );
};
