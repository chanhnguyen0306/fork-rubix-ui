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

export type OutputSocketProps = {
  connected: boolean;
} & OutputSocketSpecJSON;

export const OutputSocket = ({
  connected,
  valueType,
  name,
}: OutputSocketProps) => {
  const instance = useReactFlow();
  const showFlowIcon = valueType === "flow";
  const colorName = valueTypeColorMap[valueType];
  const [backgroundColor, borderColor] = colors[colorName];

  return (
    <div className="flex grow items-center justify-end h-7">
      {showFlowIcon && (
        <CaretRightOutlined style={{ color: "#ffffff", fontSize: "large" }} />
      )}
      {showFlowIcon === false && <div className="">{name}</div>}
      <Handle
        id={name}
        type="source"
        position={Position.Right}
        className={cx(borderColor, connected ? backgroundColor : "bg-gray-1200")}
        isValidConnection={(connection: Connection) =>
          isValidConnection(connection, instance)
        }
      />
    </div>
  );
};
