import { Button, message, Modal, Spin, Steps } from "antd";
import { useEffect, useState } from "react";
import { Installation } from "./installation";
import { InstallFactory } from "./factory";
import { assistmodel } from "../../../../../wailsjs/go/models";
import { Completion } from "./completion";
import Host = assistmodel.Host;

export const InstallRubixEdgeModal = (props: IInstallRubixEdgeModal) => {
  const { isModalVisible, onCloseModal, host, installFactory } = props;

  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selectedVersion, setSelectedVersion] = useState("");

  useEffect(()=> {
    setSelectedVersion("")
  }, [isModalVisible])

  const install = async () => {
    setCurrent(current + 1);
    setLoading(true);
    await installFactory.InstallRubixEdge(host.uuid, selectedVersion);
    setLoading(false);
  };

  const complete = async () => {
    setCurrent(0);
    onCloseModal();
    await message.success("Processing complete!");
  };

  const handleClose = () => {
    onCloseModal();
  };

  return (
    <Modal
      centered
      title="Install Rubix Edge"
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
            />
          </div>
        }
        {current == 1 &&
          <div className="steps-content">
            <Completion loading={loading} />
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

interface IInstallRubixEdgeModal {
  isModalVisible: boolean;
  onCloseModal: any;
  host: Host;
  installFactory: InstallFactory;
}
