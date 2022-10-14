import clsx from "clsx";
import { UndoOutlined, RedoOutlined } from "@ant-design/icons";

export type ControlUndoableProps = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
};

const ControlUndoable = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: ControlUndoableProps) => {
  return (
    <div className="absolute top-4 left-4 bg-white z-10 flex black--text">
      <div
        className={clsx("border-r bg-white hover:bg-gray-100", {
          "cursor-pointer": canUndo,
        })}
        title="Undo"
        onClick={onUndo}
      >
        <UndoOutlined className="p-2 text-gray-700 align-middle" />
      </div>
      <div
        className={clsx("border-r bg-white hover:bg-gray-100", {
          "cursor-pointer": canRedo,
        })}
        title="Redo"
        onClick={onRedo}
      >
        <RedoOutlined className="p-2 text-gray-700 align-middle" />
      </div>
    </div>
  );
};

export default ControlUndoable;
