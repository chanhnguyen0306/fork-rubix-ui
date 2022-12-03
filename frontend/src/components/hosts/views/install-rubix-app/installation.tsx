import { Card, Select } from "antd";
import { InstallAppFactory } from "./factory";
import { amodel, rumodel } from "../../../../../wailsjs/go/models";
import { useEffect, useState } from "react";
import Host = amodel.Host;
import InstalledApps = rumodel.InstalledApps;

export const Installation = (props: IInstallation) => {
  const {
    installFactory,
    host,
    app,
    installedVersion,
    setLoading,
    selectedVersion,
    setSelectedVersion
  } = props;
  const [versions, setVersions] = useState([]);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const versions = await installFactory
        .GetRubixAppVersions(
          host.uuid,
          app.app_name || "",
          app.min_version || "",
          app.max_version || "");
      setVersions(versions);
    } finally {
      setLoading(false);
    }
  };

  const onChangeVersion = (version: string) => {
    setSelectedVersion(version);
  };

  useEffect(() => {
    setSelectedVersion(installedVersion);
  }, [installedVersion]);

  useEffect(() => {
    fetchVersions().then();
  }, [host, app]);

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
  app: InstalledApps;
  installedVersion: string;
  installFactory: InstallAppFactory;
  setLoading: any;
  selectedVersion: string,
  setSelectedVersion: any;
}
