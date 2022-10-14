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
      <button onClick={onUndo} disabled={!canUndo}>
        undo
      </button>
      <button onClick={onRedo} disabled={!canRedo}>
        redo
      </button>
    </div>
  );
};

export default ControlUndoable;
