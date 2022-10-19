import { CSSProperties } from "react";
import { NodeCategory } from "../../Nodes/NodeCategory";

export type InputSocketSpecJSON = {
  name: string;
  valueType: string;
  defaultValue?: any;
};

export type OutputSocketSpecJSON = {
  name: string;
  valueType: string;
};

export type NodeSpecJSON = {
  allowSettings: boolean;
  type: string;
  category: NodeCategory;
  inputs?: InputSocketSpecJSON[];
  outputs?: OutputSocketSpecJSON[];
  info?: {};
  style?: CSSProperties;
  isParent?: boolean;
};
