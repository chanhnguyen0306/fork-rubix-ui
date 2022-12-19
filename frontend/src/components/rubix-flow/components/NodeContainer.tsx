import { PropsWithChildren } from "react";
import cx from "classnames";
import { categoryColorMap, colors } from "../util/colors";
import { NodeSpecJSON } from "../lib";
import { Tooltip } from "antd";

type NodeProps = {
  title: string;
  icon: string;
  nodeName: string;
  category?: NodeSpecJSON["category"];
  selected: boolean;
  height: number;
  hasChild: boolean;
  status?: any;
  onDbClickTitle: () => void;
};

export const NodeContainer = ({
  title,
  icon,
  nodeName,
  category = "None",
  selected,
  children,
  height,
  hasChild,
  status,
  onDbClickTitle,
}: PropsWithChildren<NodeProps>) => {
  const colorName = categoryColorMap[category] || "gray";
  let [backgroundColor, borderColor, textColor] = colors[colorName];

  if (selected) {
    borderColor = "border-gray-800";
  }

  const renderFirstRow = () => {
    return (
      <div style={{ display: "block" }}>
        {icon && <span className="pr-3 pt-1">{icon}</span>}
        {nodeName && <span>{nodeName}</span>}
        {status?.activeMessage && renderStatusMessages()}
        {status?.subTitle && <span className="ml-1 float-right" style={{fontSize: "8px"}}>{status.subTitle}</span>}
      </div>
    );
  };

  const renderStatusMessages = () => {
    return (
      <span className="ml-4">
        {status?.waringIcon && <Tooltip title={status.waringMessage}>{status.waringIcon}</Tooltip>}
        {status?.notifyIcon && <Tooltip title={status.notifyMessage}>{status.notifyIcon}</Tooltip>}
        {status?.errorIcon && <Tooltip title={status.errorMessage}>{status.errorIcon}</Tooltip>}
      </span>
    );
  };

  return (
    <div
      className={cx([
        `rounded text-white bg-gray-800 min-w-[130px] text-start`,
        { "bg-opacity-50": hasChild, "outline outline-1": selected },
      ])}
    >
      <div className={`flex ${backgroundColor} ${textColor} px-3 py-1 rounded-t`} onDoubleClick={onDbClickTitle}>
        <div style={{ width: "100%" }}>
          {renderFirstRow()}
          <div>
            <span>{title}</span> {" | "}
            {category}
          </div>
        </div>
      </div>
      <div
        className={`flex flex-col gap-2 py-3 border-l border-r border-b ${borderColor}`}
        style={{ minHeight: hasChild && height ? height - 50 : "auto" }}
      >
        {children}
      </div>
    </div>
  );
};
