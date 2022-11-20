import { Card, Select } from "antd";
import { InstallFactory } from "./factory";
import { model } from "../../../../../wailsjs/go/models";
import { useEffect, useState } from "react";
import Host = model.Host;

export const Installation = (props: IInstallation) => {
  const {
    installFactory,
    host,
    setLoading,
    selectedVersion,
    setSelectedVersion
  } = props;
  const [versions, setVersions] = useState([]);
  const [installedVersion, setInstalledVersion] = useState("");

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const versions = await installFactory.GetRubixEdgeVersions();
      const _installedVersion = await installFactory.GetInstalledRubixEdgeVersion(host.uuid);
      setInstalledVersion(_installedVersion?.version)
      setVersions(versions);
      if (selectedVersion == "") {
        setSelectedVersion(_installedVersion?.version)
      }
    } finally {
      setLoading(false);
    }
  };

  const onChangeVersion = (version: string) => {
    setSelectedVersion(version);
  };

  useEffect(() => {
    fetchVersions().then();
  }, [host]);

  const options = versions.map(version => {
    return ({ value: version, label: version });
  });

  return (
    <Card style={{ marginTop: 10, marginBottom: 10 }}>
      <b>Installed version:</b> <i>{installedVersion}</i> <br /><br />
      <b>Select version:</b>
      <Select
        value={selectedVersion}
        style={{ width: 100, margin: "0 8px" }}
        onChange={onChangeVersion}
        options={options}
      >
      </Select>
    </Card>
  );
};

interface IInstallation {
  host: Host;
  installFactory: InstallFactory;
  setLoading: any;
  selectedVersion: string,
  setSelectedVersion: any;
}
