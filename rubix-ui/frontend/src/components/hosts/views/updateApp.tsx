import React, { useEffect, useState } from "react";
import RbModal from "../../../common/rb-modal";
import { Select } from "antd";
import { ReleasesFactory } from "../../release/factory";

let releaseFactory = new ReleasesFactory();

const { Option } = Select;

const UpdateApp = (props: any) => {
  const { isOpen, closeDialog, handleUpdate, isLoading } = props;

  const [releases, updateReleases] = useState([] as any);
  const [release, updateRelease] = useState("");

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = () => {
    releaseFactory.GetReleases().then((releases) => {
      updateReleases(releases || []);
    });
  };

  const handleOk = () => {
    if (!release) {
      return;
    }

    return handleUpdate(release);
  };

  return (
    <RbModal
      title={<span>Update App</span>}
      handleOk={handleOk}
      isOpen={isOpen}
      cancelText="Close"
      isLoading={isLoading}
      close={closeDialog}
    >
      <Select
        showSearch
        value={release}
        onChange={(v) => updateRelease(v)}
        style={{ width: "100%" }}
        placeholder="Select a version"
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option!.children as unknown as string)
            .toLowerCase()
            .includes(input.toLowerCase())
        }
      >
        {releases.map((release: any) => (
          <Option key={release.release} value={release.release}>
            {release.release}
          </Option>
        ))}
      </Select>
    </RbModal>
  );
};

export default UpdateApp;
