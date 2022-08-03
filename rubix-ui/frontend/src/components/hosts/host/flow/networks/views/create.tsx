import { Modal, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { FlowNetworkFactory } from "../factory";
import { FlowPluginFactory } from "../../plugins/factory";
import { JsonForm } from "../../../../../../common/json-schema-form";
import { model } from "../../../../../../../wailsjs/go/models";

import Network = model.Network;
import PluginConf = model.PluginConf;
const { Option } = Select;

export const EditModal = (props: any) => {
  const {
    currentItem,
    isModalVisible,
    isLoadingForm,
    connUUID,
    hostUUID,
    networkSchema,
    onCloseModal,
    refreshList,
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState(currentItem);

  let flowNetworkFactory = new FlowNetworkFactory();

  useEffect(() => {
    setFormData(currentItem);
  }, [currentItem]);

  const edit = async (net: Network) => {
    flowNetworkFactory.connectionUUID = connUUID;
    flowNetworkFactory.hostUUID = hostUUID;
    await flowNetworkFactory.Update(net.uuid, net);
  };

  const handleClose = () => {
    setFormData({});
    onCloseModal();
  };

  const handleSubmit = async (item: any) => {
    setConfirmLoading(true);
    await edit(item);
    setConfirmLoading(false);
    handleClose();
    refreshList();
  };

  return (
    <>
      <Modal
        title={"Edit " + currentItem.name}
        visible={isModalVisible}
        onOk={() => handleSubmit(formData)}
        onCancel={handleClose}
        confirmLoading={confirmLoading}
        okText="Save"
        maskClosable={false} // prevent modal from closing on click outside
        style={{ textAlign: "start" }}
      >
        <Spin spinning={isLoadingForm}>
          <JsonForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            jsonSchema={networkSchema}
          />
        </Spin>
      </Modal>
    </>
  );
};

export const CreateModal = (props: any) => {
  const { isModalVisible, connUUID, hostUUID, onCloseModal, refreshList } =
    props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState({} as Network);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [schema, setSchema] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const [plugins, setPlugins] = useState([] as PluginConf[]);
  const [selectedPlugin, setSelectedPlugin] = useState("");

  let pluginFactory = new FlowPluginFactory();
  let networkFactory = new FlowNetworkFactory();
  networkFactory.connectionUUID = connUUID;
  networkFactory.hostUUID = hostUUID;

  useEffect(() => {
    setFormData({} as Network);
    fetchPlugins();
  }, []);

  useEffect(() => {
    setSchema({});
    setSelectedPlugin("please select plugin...");
  }, [isModalVisible]);

  const fetchPlugins = async () => {
    try {
      pluginFactory.connectionUUID = connUUID;
      pluginFactory.hostUUID = hostUUID;
      const res = (await pluginFactory.GetAll()) || [];
      setPlugins(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const onChange = async (pluginName: string) => {
    setIsLoadingForm(true);
    setSelectedPlugin(pluginName);
    const res = await networkFactory.Schema(connUUID, hostUUID, pluginName);
    const jsonSchema = {
      properties: res,
    };
    setSchema(jsonSchema);
    setIsLoadingForm(false);
  };

  const handleClose = () => {
    setFormData({} as Network);
    onCloseModal();
  };

  const handleSubmit = async (item: Network) => {
    try {
      setConfirmLoading(true);
      item.plugin_name = selectedPlugin;
      await networkFactory.Import(true, true, item);
      refreshList();
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      title="Add New"
      visible={isModalVisible}
      onOk={() => handleSubmit(formData)}
      onCancel={handleClose}
      confirmLoading={confirmLoading}
      okText="Save"
      maskClosable={false} // prevent modal from closing on click outside
      style={{ textAlign: "start" }}
    >
      <Spin spinning={isFetching}>
        <Select
          showSearch
          onChange={onChange}
          style={{ width: "100%", marginBottom: "10px" }}
          value={selectedPlugin}
        >
          {plugins.map((plugin) => (
            <Option key={plugin.uuid} value={plugin.name}>
              {plugin.name}
            </Option>
          ))}
        </Select>
        <Spin spinning={isLoadingForm}>
          <JsonForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            jsonSchema={schema}
          />
        </Spin>
      </Spin>
    </Modal>
  );
};
