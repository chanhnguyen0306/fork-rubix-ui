import { ChangeEvent, FC, useState } from "react";
import { Modal } from "./Modal";

export const NUMBER_REFRESH = "number-refresh-values";

export const getNumberRefresh = () => +(localStorage.getItem(NUMBER_REFRESH) || 5);

export type SettingRefreshModalProps = {
  open?: boolean;
  onClose: () => void;
  onNumberRefresh: (value: number) => void;
};

export const SettingRefreshModal: FC<SettingRefreshModalProps> = ({
  open = false,
  onClose,
  onNumberRefresh,
}) => {
  const [numberRefresh, setNumberRefresh] = useState<string>(
    localStorage.getItem(NUMBER_REFRESH) || "5"
  );

  const handleBlurValue = (e: ChangeEvent<HTMLInputElement>) => {
    const value = isNaN(+e.target.value)
      ? 1
      : Math.max(1, Math.min(60, Number(e.target.value)));

    setNumberRefresh(value.toString());
  };

  const handleSave = () => {
    onNumberRefresh(+numberRefresh);
    onClose();
  };

  return (
    <Modal
      title="Settings"
      actions={[
        { label: "Cancel", onClick: onClose },
        { label: "Save", onClick: handleSave },
      ]}
      open={open}
      onClose={onClose}
    >
      <div className="py-4 px-2">
        <label className="pr-2">Refresh time (second):</label>
        <input
          type="number"
          className="border border-gray-300 p-2"
          value={numberRefresh}
          onChange={(e) => setNumberRefresh(e.target.value)}
          onBlur={handleBlurValue}
        />
      </div>
    </Modal>
  );
};
