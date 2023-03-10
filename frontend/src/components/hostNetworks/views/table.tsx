import { Space, Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { backend, amodel } from "../../../../wailsjs/go/models";
import RbTable from "../../../common/rb-table";
import {
  RbAddButton,
  RbDeleteButton,
  RbRefreshButton,
} from "../../../common/rb-table-actions";
import { HOST_NETWORK_HEADERS } from "../../../constants/headers";
import { ROUTES } from "../../../constants/routes";
import { isObjectEmpty } from "../../../utils/utils";
import { LocationFactory } from "../../locations/factory";
import { NetworksFactory } from "../factory";
import { CreateEditModal } from "./create";
import { ArrowRightOutlined, FormOutlined } from "@ant-design/icons";
import Network = amodel.Network;
import Location = amodel.Location;
import UUIDs = backend.UUIDs;

export const NetworksTable = () => {
  const { connUUID = "", locUUID = "" } = useParams();
  const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<UUIDs>);
  const [networks, setNetworks] = useState([] as Network[]);
  const [locations, setLocations] = useState([] as Location[]);
  const [currentNetwork, setCurrentNetwork] = useState({} as Network);
  const [networkSchema, setNetworkSchema] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  const factory = new NetworksFactory();
  const locationFactory = new LocationFactory();
  factory.connectionUUID = locationFactory.connectionUUID = connUUID;

  const columns = [
    ...HOST_NETWORK_HEADERS,
    {
      title: "Location",
      dataIndex: "location_uuid",
      key: "location_uuid",
      render: (location_uuid: string) => (
        <span>{getLocationNameByUUID(location_uuid)}</span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, network: amodel.Network) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <a
              onClick={() => {
                showModal(network);
              }}
            >
              <FormOutlined />
            </a>
          </Tooltip>
          <Link
            to={ROUTES.LOCATION_NETWORK_HOSTS.replace(":connUUID", connUUID)
              .replace(":locUUID", locUUID)
              .replace(":netUUID", network.uuid)}
          >
            <Tooltip title="View">
              <ArrowRightOutlined />
            </Tooltip>
          </Link>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedUUIDs(selectedRows);
    },
  };

  useEffect(() => {
    if (locations.length === 0) {
      fetchLocations();
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [locUUID, connUUID]);

  const fetch = async () => {
    try {
      setIsFetching(true);
      const res = await factory.GetAll();
      const networksByLocUUID = res.filter((n) => n.location_uuid === locUUID);
      setNetworks(networksByLocUUID);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchLocations = async () => {
    const res = await locationFactory.GetAll();
    setLocations(res);
  };

  const getSchema = async () => {
    setIsLoadingForm(true);
    const res = await factory.Schema();
    res.properties = {
      ...res.properties,
      location_uuid: {
        title: "location",
        type: "string",
        anyOf: locations.map((l: amodel.Location) => {
          return { type: "string", enum: [l.uuid], title: l.name };
        }),
        default: locUUID,
      },
    };
    setNetworkSchema(res);
    setIsLoadingForm(false);
  };

  const bulkDelete = async () => {
    await factory.BulkDelete(selectedUUIDs);
    fetch();
  };

  const getLocationNameByUUID = (location_uuid: string) => {
    const location = locations.find(
      (l: amodel.Location) => l.uuid === location_uuid
    );
    return location ? location.name : "";
  };

  const showModal = (network: amodel.Network) => {
    setCurrentNetwork(network);
    setIsModalVisible(true);
    if (isObjectEmpty(networkSchema)) {
      getSchema();
    }
  };

  const onCloseModal = () => {
    setIsModalVisible(false);
    setCurrentNetwork({} as amodel.Network);
  };

  return (
    <div>
      <RbRefreshButton refreshList={fetch} />
      <RbAddButton handleClick={() => showModal({} as amodel.Network)} />
      <RbDeleteButton bulkDelete={bulkDelete} />
      <RbTable
        rowKey="uuid"
        rowSelection={rowSelection}
        dataSource={networks}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
      <CreateEditModal
        networks={networks}
        currentNetwork={currentNetwork}
        schema={networkSchema}
        isModalVisible={isModalVisible}
        isLoadingForm={isLoadingForm}
        onCloseModal={onCloseModal}
        refreshList={fetch}
      />
    </div>
  );
};
