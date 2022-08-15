import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, Spin } from "antd";
import { FlowConsumerFactory } from "../factory";
import { FlowNetworkFactory } from "../../../networks/factory";
import { FlowProducerFactory } from "../../producers/factory";
import { main, model } from "../../../../../../../../wailsjs/go/models";
import { JsonForm } from "../../../../../../../common/json-schema-form";

import Consumer = model.Consumer;
import NetworksList = main.NetworksList;

export const CreateEditModal = (props: any) => {
  const { currentItem, isModalVisible, refreshList, onCloseModal } = props;
  const { connUUID = "", hostUUID = "", streamUUID = "" } = useParams();
  const [formData, setFormData] = useState(currentItem);
  const [networksWithPoints, setNetworksWithPoints] = useState(
    [] as NetworksList[]
  );
  const [jsonSchema, setJsonSchema] = useState({});

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  let factory = new FlowConsumerFactory();
  let producerFactory = new FlowProducerFactory();
  let flowNetworkFactory = new FlowNetworkFactory();
  factory.connectionUUID =
    flowNetworkFactory.connectionUUID =
    producerFactory.connectionUUID =
      connUUID;
  factory.hostUUID =
    flowNetworkFactory.hostUUID =
    producerFactory.hostUUID =
      hostUUID;

  useEffect(() => {
    setFormData(currentItem);
  }, [isModalVisible]);

  useEffect(() => {
    GetNetworksWithPointsDisplay();
  }, []);

  const GetNetworksWithPointsDisplay = async () => {
    try {
      setIsFetching(true);
      const res = await flowNetworkFactory.GetNetworksWithPointsDisplay();
      setNetworksWithPoints(res);
      const jsonSchema = {
        properties: {
          uuid: {
            readOnly: true,
            title: "uuid",
            type: "string",
          },
          name: {
            maxLength: 50,
            minLength: 2,
            title: "name",
            type: "string",
          },
          enable: {
            title: "enable",
            type: "boolean",
          },
          enable_history: {
            title: "enable history",
            type: "boolean",
          },
          producer_thing_class: {
            type: "string",
            enum: ["point", "schedule"],
            default: "point",
          },
          producer_application: {
            type: "string",
            enum: ["mapping"],
            default: "mapping",
          },
          producer_thing_uuid: {
            title: "Point",
            type: "string",
            anyOf: res.map((n) => {
              return { type: "string", enum: [n.point_uuid], title: n.name };
            }),
            default: res[0].point_uuid,
          },
        },
      };
      setJsonSchema(jsonSchema);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (item: any) => {
    try {
      setConfirmLoading(true);
      if (currentItem.uuid) {
        item.uuid = currentItem.uuid;
        await factory.Update(item.uuid, item);
      } else {
        item = {
          ...item,
          stream_uuid: streamUUID,
          history_type: "",
          history_interval: 0,
        };
        await factory.Add(item);
      }
      refreshList();
      onCloseModal();
    } catch (error) {
      console.log(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <Modal
        title={currentItem.uuid ? "Edit " + currentItem.name : "Add"}
        visible={isModalVisible}
        onOk={() => handleSubmit(formData)}
        onCancel={onCloseModal}
        confirmLoading={confirmLoading}
        okText="Save"
        maskClosable={false}
        style={{ textAlign: "start" }}
      >
        <Spin spinning={isFetching}>
          <JsonForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            jsonSchema={jsonSchema}
          />
        </Spin>
      </Modal>
    </>
  );
};
