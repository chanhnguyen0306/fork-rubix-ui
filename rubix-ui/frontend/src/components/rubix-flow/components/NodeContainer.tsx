import { PropsWithChildren } from "react";
import cx from "classnames";
import { categoryColorMap, colors } from "../util/colors";
import { NodeSpecJSON } from "../lib";

type NodeProps = {
  title: string;
  category?: NodeSpecJSON["category"];
  selected: boolean;
  height: number;
};

export const NodeContainer = ({
  title,
  category = "None",
  selected,
  children,
  height,
}: PropsWithChildren<NodeProps>) => {
  const colorName = categoryColorMap[category] || "gray";
  let [backgroundColor, borderColor, textColor] = colors[colorName];
  if (selected) {
    borderColor = "border-gray-800";
  }
  return (
    <div
      className={cx(
        "rounded text-white bg-gray-800 min-w-[130px] text-start",
        selected && "outline outline-1"
      )}
    >
      <div className={`${backgroundColor} ${textColor} px-3 py-1 rounded-t`}>
        {title}
      </div>
      <div
        className={`flex flex-col gap-2 py-3 border-l border-r border-b `}
        style={{ minHeight: height - 27 }}
      >
        {children}
      </div>
    </div>
  );
};
