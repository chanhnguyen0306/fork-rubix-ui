import { ChangeEvent, FC, useState } from "react";
import { Switch } from "antd";

import { Modal } from "./Modal";

export const FLOW_SETTINGS = "flow-settings";

export const getFlowSettings = () => {
  const config = JSON.parse(localStorage.getItem(FLOW_SETTINGS) || "{}");
  return {
    refreshTimeout: config?.refreshTimeout || 5,
    showMiniMap: config?.showMiniMap === undefined ? true : config?.showMiniMap,
  };
};

export type FlowSettings = {
  refreshTimeout: number | string;
  showMiniMap: boolean;
};

export type SettingsModalProps = {
  open?: boolean;
  onClose: () => void;
  settings: FlowSettings;
  onSaveSettings: (settings: FlowSettings) => void;
};

export const FlowSettingsModal: FC<SettingsModalProps> = ({
  open = false,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [configs, setConfigs] = useState<FlowSettings>({
    ...settings,
  });

  const onChangeTimeout = (e: ChangeEvent<HTMLInputElement>) => {
    setConfigs({ ...configs, refreshTimeout: e.target.value });
  };

  const handleBlurValue = (e: ChangeEvent<HTMLInputElement>) => {
    const value = isNaN(+e.target.value)
      ? 1
      : Math.max(1, Math.min(60, Number(e.target.value)));

    setConfigs({ ...configs, refreshTimeout: value });
  };

  const onChangeShowMiniMap = () => {
    const newConfig = { ...configs, showMiniMap: !configs.showMiniMap };
    setConfigs(newConfig);
    onSaveSettings(newConfig);
  };

  const handleSave = () => {
    onSaveSettings(configs);
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
        <div className="mb-2">
          <label className="pr-6 mb-0 mr-16 pt-1">Show Mini Map: </label>
          <Switch
            checked={configs.showMiniMap}
            size="small"
            onChange={onChangeShowMiniMap}
          />
        </div>
        <div>
          <label className="pr-2">Refresh time (second):</label>
          <input
            type="number"
            className="border border-gray-300 p-2"
            value={configs.refreshTimeout}
            onChange={onChangeTimeout}
            onBlur={handleBlurValue}
          />
        </div>
      </div>
    </Modal>
  );
};
