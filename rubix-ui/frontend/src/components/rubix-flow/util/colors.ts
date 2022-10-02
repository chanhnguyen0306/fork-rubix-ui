import { NodeSpecJSON } from "../lib";

export const colors: Record<string, [string, string, string]> = {
  red: ["bg-orange-700", "border-orange-700", "text-gray"],
  green: ["bg-green-600", "border-green-600", "text-gray"],
  purple: ["bg-purple-500", "border-purple-500", "text-gray"],
  blue: ["bg-cyan-600", "border-cyan-600", "text-gray"],
  gray: ["bg-gray-500", "border-gray-500", "text-gray"],
  white: ["bg-white", "border-white", "text-gray-700"],
};

export const valueTypeColorMap: Record<string, string> = {
  number: "purple",
  boolean: "green",
  string: "gray",
};

export const categoryColorMap: Record<NodeSpecJSON["category"], string> = {
  math: "purple",
  logic: "green",
  compare: "green",
  statistics: "green",
  time: "green",
  mqtt: "blue",
  debug: "blue",
  None: "gray",
};
