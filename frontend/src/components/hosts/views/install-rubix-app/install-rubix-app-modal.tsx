import { Button, message, Modal, Spin, Steps } from "antd";
import { useState } from "react";
import { Installation } from "./installation";
import { InstallAppFactory } from "./factory";
import { amodel, rumodel } from "../../../../../wailsjs/go/models";
import { Completion } from "./completion";
import Host = amodel.Host;
import InstalledApps = rumodel.InstalledApps;

export const InstallRubixAppModal = (props: IInstallRubixAppModal) => {
  const {
    isModalVisible,
    onCloseModal,
    host,
    app,
    installedVersion,
    installFactory,
    fetchAppInfo
  } = props;

  const [isInstalled, setIsInstalled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [installResponse, setInstallResponse] = useState({} as rumodel.Response);

  const install = async () => {
    setCurrent(current + 1);
    setLoading(true);
    const response = await installFactory.InstallRubixApp(
      host.uuid,
      app.app_name || "",
      selectedVersion);
    setInstallResponse(response);
    setLoading(false);
    setIsInstalled(true);
  };

  const complete = async () => {
    setCurrent(0);
    onCloseModal();
    if (isInstalled) {
      fetchAppInfo().catch(console.log);
      setIsInstalled(false);
    }
    await message.success("Processing complete!");
  };

  const handleClose = () => {
    onCloseModal();
  };

  return (
    <Modal
      centered
      title={`Install app ${app.app_name}`}
      visible={isModalVisible}
      maskClosable={false}
      footer={null}
      onCancel={handleClose}
      style={{ textAlign: "start" }}
      width="50%"
    >
      <Steps current={current}>
        <Steps.Step key="installation" title="Installation" />
        <Steps.Step key="completion" title="Completion" />
      </Steps>
      <Spin spinning={loading}>
        {current == 0 &&
          <div className="steps-content">
            <Installation
              host={host}
              installFactory={installFactory}
              setLoading={setLoading}
              selectedVersion={selectedVersion}
              setSelectedVersion={setSelectedVersion}
              app={app}
              installedVersion={installedVersion}
            />
          </div>
        }
        {current == 1 &&
          <div className="steps-content">
            <Completion loading={loading} installResponse={installResponse} />
          </div>
        }
        {current == 2 && <div className="steps-content">Finished</div>}
        <div className="steps-action">
          {current == 0 && (
            <Button type="primary" onClick={() => install()}>
              Install
            </Button>
          )}
          {current === 1 && (
            <Button type="primary" onClick={() => complete()}>
              Done
            </Button>
          )}
        </div>
      </Spin>
    </Modal>
  );
};

interface IInstallRubixAppModal {
  isModalVisible: boolean;
  onCloseModal: any;
  host: Host;
  app: InstalledApps;
  installedVersion: string;
  installFactory: InstallAppFactory;
  fetchAppInfo: any;
}
