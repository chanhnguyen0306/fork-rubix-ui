import { Metadata } from "../Metadata";
import { Node } from "react-flow-renderer/nocss";

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
  settings?: any;
  data?: { [key: string]: any };
  style?: { [key: string]: any };
  isParent?: boolean;
};

export type GraphJSON = {
  name?: string;
  nodes: NodeJSON[];
  metadata?: Metadata;
};

export interface NodeExtend extends Node {
  isParent?: boolean;
}
