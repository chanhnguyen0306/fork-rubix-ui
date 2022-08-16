import { Modal, Spin, Card } from "antd";
import RbModal from "../../../common/rb-modal";
import { useParams } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Form, Select, Radio, Checkbox } from "formik-antd";
import { ReleasesFactory } from "../../release/factory";
import { Formik } from "formik";

const { Option } = Select;
let releaseFactory = new ReleasesFactory();

const InstallApp = (props: any) => {
  const { isOpen, closeDialog, dialogData } = props;
  const [isInstalling, updateIsInstalling] = useState(false);

  const [releases, updateReleases] = useState([] as any);
  const [availableApps, updateAvailableApps] = useState([] as any);
  console.log(dialogData);
  let {
    connUUID = "",
    hostUUID = "",
    locUUID = "",
    netUUID = "",
  } = useParams();

  useEffect(() => {
    fetchReleases();

    return () => {
      console.log("close hook");
    };
  }, []);

  const fetchReleases = () => {
    releaseFactory.GetReleases().then((releases) => {
      updateReleases(releases);
    });
  };

  const handleOnSelect = (version: any) => {
    const release = releases.find((release: any) => release.release == version);
    if (release && release.apps) {
      updateAvailableApps(release.apps);
      console.log(release.apps);
    }
  };
  const handleSubmit = (values: any) => {
    console.log(values);
    const payloads = Object.keys(values.apps).reduce((acc: any, appName) => {
      if (values.apps[appName].install) {
        acc.push({
          appName: appName,
          connUUID: connUUID,
          hostUUID: dialogData.state.uuid,
          releaseVersion: values.release,
          appVersion: values.release,
          arch: values.apps[appName].arch,
        });
      }

      return acc;
    }, []);

    updateIsInstalling(true);
    console.log(payloads);

    return Promise.all(
      payloads.map((payload: any) =>
        releaseFactory
          .EdgeInstallApp(
            payload.connUUID,
            payload.hostUUID,
            payload.appName,
            payload.appVersion,
            payload.arch,
            payload.appVersion
          )
          .catch((err) => ({ payload, hasError: true, err: err }))
      )
    )
      .then(() => {
        closeDialog();
      })
      .finally(() => {
        updateIsInstalling(false);
      });
  };

  const initialValues: any = {};

  initialValues.apps = {
    ...availableApps.reduce((acc: any, curr: any) => {
      acc = {
        ...acc,
        [curr.name]: {
          arch: "armv7",
          install: false,
        },
      };
      return acc;
    }, {}),
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {(props) => (
        <RbModal
          title={
            <span>
              <UploadOutlined style={{ paddingRight: 5 }} />
              Install App
            </span>
          }
          disabled={isInstalling}
          isLoading={isInstalling}
          handleOk={() => handleSubmit(props.values)}
          isOpen={isOpen}
          close={closeDialog}
        >
          <Spin spinning={isInstalling}>
            {isOpen ? (
              <Form>
                <Select
                  showSearch
                  name="release"
                  style={{ width: "100%" }}
                  placeholder="Select a version"
                  optionFilterProp="children"
                  onSelect={handleOnSelect}
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
                <div style={{ padding: "10px 0" }}>
                  {Array.isArray(availableApps) && availableApps.length > 0 && (
                    <span style={{ padding: "20px 0 10px 0", fontWeight: 500 }}>
                      Apps
                    </span>
                  )}
                  {availableApps.map((app: any) => (
                    <span
                      key={app.name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 0",
                      }}
                    >
                      <span className="flex-2">{app.name}</span>
                      <span className="flex-1">
                        <Checkbox name={`apps.${app.name}.install`}>
                          Install
                        </Checkbox>
                      </span>
                      <span className="flex-3">
                        <Form.Item name="layout">
                          <Radio.Group
                            name={`apps.${app.name}.arch`}
                            options={app.arch}
                            optionType="button"
                            buttonStyle="solid"
                          />
                        </Form.Item>
                      </span>
                    </span>
                  ))}
                </div>
              </Form>
            ) : null}
          </Spin>
        </RbModal>
      )}
    </Formik>
  );
};

export default InstallApp;
