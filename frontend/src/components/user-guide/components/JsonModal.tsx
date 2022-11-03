import { ChangeEvent, FC, useState } from "react";
import { useOnPressKey } from "../../rubix-flow/hooks/useOnPressKey";

export type JsonModalProps = {
  open?: boolean;
  onSubmit: (json: string) => void;
  onClose: () => void;
};

export const actionColors = {
  primary: "bg-blue-400 hover:bg-blue-500",
  secondary: "bg-gray-400 hover:bg-gray-500",
};

export const JsonModal: FC<JsonModalProps> = ({
  open = false,
  onSubmit,
  onClose,
}) => {
  const [value, setValue] = useState<string>("");

  const handleClose = () => {
    setValue("");
    onClose();
  };

  const handleChangeValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.currentTarget.value);
  };

  const actions = [
    { label: "Cancel", onClick: handleClose },
    { label: "Load", onClick: () => onSubmit(value) },
  ];

  useOnPressKey("Escape", handleClose);

  return (
    <>
      {open && (
        <>
          <div
            className="z-[19] fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
            onClick={handleClose}
          />
          <div
            className="z-[20] absolute top-20 mx-auto border shadow-lg bg-white rounded-md left-1/2"
            style={{
              minWidth: "400px",
              width: "fit-content",
              transform: "translate(-50%, 0%)",
            }}
          >
            <div className="p-3 border-b">
              <h2 className="text-3xl text-center font-bold title black--text">
                JSON
              </h2>
            </div>
            <div className="p-3 text-start black--text">
              <textarea
                autoFocus
                className="border border-gray-300 p-2 align-top"
                placeholder="Paste JSON here"
                value={value}
                onChange={handleChangeValue}
                style={{ height: "50vh", width: "500px" }}
              />
            </div>
            <div className="flex gap-3 p-3 border-t">
              {actions.map((action, ix) => (
                <button
                  key={ix}
                  className={
                    "text-white p-2 w-full cursor-pointer " +
                    (ix === actions.length - 1
                      ? actionColors.primary
                      : actionColors.secondary)
                  }
                  onClick={action.onClick}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};
