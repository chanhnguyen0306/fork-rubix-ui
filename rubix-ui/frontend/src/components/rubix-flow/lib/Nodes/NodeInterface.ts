import { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import {
  XYPosition,
  Position,
  CoordinateExtent,
  internalsSymbol,
  NodeHandleBounds,
} from "react-flow-renderer";
export interface NodeInterface<T = any> {
  id: string;
  position: XYPosition;
  data: T;
  type?: string;
  style?: CSSProperties;
  className?: string;
  targetPosition?: Position;
  sourcePosition?: Position;
  hidden?: boolean;
  selected?: boolean;
  dragging?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  dragHandle?: string;
  width?: number | null;
  height?: number | null;
  parentNode?: string;
  zIndex?: number;
  extent?: "parent" | CoordinateExtent;
  expandParent?: boolean;
  positionAbsolute?: XYPosition;
  [internalsSymbol]?: {
    z?: number;
    handleBounds?: NodeHandleBounds;
    isParent?: boolean;
  };
  settings?: any; // Interface Setting cannot be determined
}
