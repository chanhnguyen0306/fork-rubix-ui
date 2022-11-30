import React from "react";
import { Tag, Tooltip } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  VerticalAlignMiddleOutlined,
} from "@ant-design/icons";

interface BadgeDetailI {
  [name: string]: {
    title: string;
    color: string;
  };
}

export enum VERSION_STATES {
  DOWNGRADE = "downgrade",
  UPGRADE = "upgrade",
  NONE = "none",
}

export const badgeDetails: BadgeDetailI = {
  [VERSION_STATES.DOWNGRADE]: {
    title: "Downgrade is required",
    color: "red",
  },
  [VERSION_STATES.UPGRADE]: {
    title: "Upgrade is required",
    color: "yellow",
  },
  [VERSION_STATES.NONE]: {
    title: "No action needed",
    color: "green",
  },
  default: {
    title: "",
    color: "",
  },
};

const RbVersion = (props: any) => {
  const { state, version } = props;
  let badgeDetail = badgeDetails[state];
  if (!badgeDetail) {
    return <Tag>{state}</Tag>;
  }

  return <Tooltip title={badgeDetail.title}>
    <Tag
      icon={
        state == VERSION_STATES.UPGRADE ?
          <ArrowUpOutlined /> : state == VERSION_STATES.DOWNGRADE ?
            <ArrowDownOutlined /> : <VerticalAlignMiddleOutlined />
      }
      color={badgeDetail.color}>{version}
    </Tag>
  </Tooltip>;
};

export default RbVersion;
