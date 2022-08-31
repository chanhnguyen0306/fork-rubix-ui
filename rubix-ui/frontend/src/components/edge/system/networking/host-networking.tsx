import { Space } from "antd";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ScannerTable } from "../../../pc/networking/scanner-table";
import { HostNetworkingFactory } from "./factory";
import { EditModal } from "./views/edit";

export const HostNetworking = () => {
  const { connUUID = "", hostUUID = "" } = useParams();
  const [data, setData] = useState([] as Array<any>);
  const [currentItem, setCurrentItem] = useState({});
  const [rcSchema, setRCSchema] = useState({} as any);
  const [schema, setSchema] = useState({} as any);
  const [isFetching, setIsFetching] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const factory = new HostNetworkingFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = hostUUID;

  const extraColumns = [
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, item: any) => (
        <Space size="middle">
          {item.editable ? (
            <a
              onClick={() => {
                showModal(item);
              }}
            >
              Edit
            </a>
          ) : null}
        </Space>
      ),
    },
  ] as never[];

  useEffect(() => {
    fetchRCSchema();
  }, []);

  useEffect(() => {
    fetch();
  }, [Object.keys(rcSchema).length]);

  const fetch = async () => {
    try {
      setIsFetching(true);
      let networks = await factory.GetNetworks();
      networks = networks.map((network: any, index: number) => {
        return {
          ...network,
          editable: Object.keys(rcSchema).includes(network.interface),
          id: index,
        };
      });
      setData(networks);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchRCSchema = async () => {
    try {
      const rcSchema = await factory.GetRcNetworkSchema();
      setRCSchema(rcSchema);
    } catch (error) {
      console.log(error);
    }
  };

  const showModal = (net: any) => {
    let schema = {};
    Object.keys(rcSchema[net.interface]).forEach((key) => {
      const prefix = key.split("_")[0] + "_";
      const newKey = key.replace(prefix, "");
      schema = { ...schema, [newKey]: rcSchema[net.interface][key] };
    });
    schema = {
      properties: schema,
    };
    setCurrentItem(net);
    setSchema(schema);
    setIsModalVisible(true);
  };

  return (
    <>
      <ScannerTable
        data={data}
        isFetching={isFetching}
        rowKey="id"
        extraColumns={extraColumns}
      />

      <EditModal
        currentItem={currentItem}
        isModalVisible={isModalVisible}
        schema={schema}
        onCloseModal={() => setIsModalVisible(false)}
        refreshList={fetch}
      />
    </>
  );
};
