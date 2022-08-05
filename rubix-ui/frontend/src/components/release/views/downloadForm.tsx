import React, { useEffect, useState } from "react";
import { Card, RadioChangeEvent } from "antd";
import { Formik } from "formik";
import { Form, Radio, Checkbox } from "formik-antd";
import RbModal from "../../../common/rb-modal";
import { AppstoreFilled } from "@ant-design/icons";

import { ReleasesFactory } from "../factory";

let releaseServices = new ReleasesFactory();

const archOptions = [
  { label: "AMD64", value: "amd64" },
  { label: "ARMv7", value: "armv7" },
];

function DownloadForm(props: any) {
  const {
    apps,
    token,
    onSubmit,
    releaseVersion,
    selectedAppsKeys,
    isDownloadModalOpen,
    updateIsDownloadModalOpen,
  } = props;
  if (!isDownloadModalOpen) {
    return null;
  }
  const selectedApps = apps.filter((app: any) =>
    selectedAppsKeys.includes(app.name)
  );

  const [arch, setArch] = useState(archOptions[0].value);
  const handleSubmit = (values: any) => {
    console.log(values);
    // onSubmit(values);
    const payloads = Object.keys(values.apps).map((appName) => ({
      token: token,
      appName: appName,
      releaseVersion: values.releaseVersion,
      arch: values.apps[appName].arch,
      cleanDownload: values.apps[appName].cleanDownload,
    }));
    console.log(payloads);
    Promise.all(
      payloads.map((payload) =>
        releaseServices
          .StoreDownload(
            token,
            payload.appName,
            payload.releaseVersion,
            payload.arch,
            payload.cleanDownload
          )
          .catch((err) => ({ payload, hasError: true, err: err }))
      )
    ).then((res: any) => {
      if (res && res.hasError) {
        console.log("HAS error", res.payload);
      }
    });
  };

  const initialValues = {
    releaseVersion: releaseVersion,
    apps: {
      ...selectedApps.reduce((acc: any, curr: any) => {
        acc = {
          ...acc,
          [curr.name]: {
            arch: "armv7",
            cleanDownload: true,
          },
        };
        return acc;
      }, {}),
    },
  };

  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(props) => (
          <RbModal
            title={
              <span>
                <AppstoreFilled style={{ paddingRight: 5 }} />
                Download App
              </span>
            }
            disabled={false}
            isLoading={false}
            handleOk={() => handleSubmit(props.values)}
            isOpen={isDownloadModalOpen}
            close={() => updateIsDownloadModalOpen(false)}
          >
            <Form>
              {selectedApps.map((selectedApp: any, index: number) => (
                <Card
                  key={selectedApp.name}
                  size="small"
                  style={{ marginBottom: 10 }}
                  title={selectedApp.name}
                >
                  <Form.Item label="Arch" name="layout">
                    <Radio.Group
                      name={`apps.${selectedApp.name}.arch`}
                      options={selectedApp.arch}
                      optionType="button"
                      buttonStyle="solid"
                    />
                  </Form.Item>

                  <Checkbox name={`apps.${selectedApp.name}.cleanDownload`}>
                    Clean Download
                  </Checkbox>
                </Card>
              ))}
            </Form>
          </RbModal>
        )}
      </Formik>
    </div>
  );
}

export default DownloadForm;
