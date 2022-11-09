import { PropsWithChildren } from "react";
import cx from "classnames";
import { categoryColorMap, colors } from "../util/colors";
import { NodeSpecJSON } from "../lib";
import { Tooltip } from "antd";

type NodeProps = {
  title: string;
  category?: NodeSpecJSON["category"];
  selected: boolean;
  height: number;
  hasChild: boolean;
  status?: any;
  onDbClickTitle: () => void;
};

export const NodeContainer = ({
  title,
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

  const renderTitle = () => {
    return (
      <div
        style={{
          justifyContent: "space-between",
          display: "flex",
        }}
      >
        <span>{title}</span>
        {status?.activeMessage && renderStatusMessages()}
      </div>
    );
  };

  const renderStatusMessages = () => {
    return (
      <span className="ml-4">
        {status?.waringIcon && (
          <Tooltip title={status.waringMessage}>{status.waringIcon}</Tooltip>
        )}
        {status?.notifyIcon && (
          <Tooltip title={status.notifyMessage}>{status.notifyIcon}</Tooltip>
        )}
        {status?.errorIcon && (
          <Tooltip title={status.errorMessage}>{status.errorIcon}</Tooltip>
        )}
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
      <div
        className={`${backgroundColor} ${textColor} px-3 py-1 rounded-t`}
        onDoubleClick={onDbClickTitle}
      >
        {renderTitle()}
        <div>
          {category} {status?.subTitle ? " | " + status.subTitle : null}
        </div>
      </div>
      <div
        className={`flex flex-col gap-2 py-3 border-l border-r border-b ${borderColor}`}
        style={{ minHeight: height ? height - 50 : "auto" }}
      >
        {children}
      </div>
    </div>
  );
};
