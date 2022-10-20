import { Metadata } from "../Metadata";
import { Node } from "react-flow-renderer/nocss";
import { CSSProperties } from "react";

export type LinkJSON = { nodeId: string; socket: string };

export type InputJSON = {
  value?: string;
  links?: LinkJSON[];
};

export type NodeJSON = {
  label?: string;
  type: string;
  id: string;
  inputs?: {
    [key: string]: InputJSON;
  };
  metadata?: Metadata;
  settings?: { [key: string]: any };
  data?: { [key: string]: any };
  style?: CSSProperties;
  isParent?: boolean;
  parentId?: string;
};

export type GraphJSON = {
  name?: string;
  nodes: NodeJSON[];
  metadata?: Metadata;
};

export interface NodeExtend extends Node {
  isParent?: boolean;
}
