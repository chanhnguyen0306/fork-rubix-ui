import { useEffect, useState } from "react";
import { Button, Spin, Table } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { AddButton, CreateModal } from "./create";
import { openNotificationWithIcon } from "../../../utils/utils";

const ScannerTable = (props: any) => {
  let { data, isFetching, setSelectedIpPorts } = props;

  if (!data) return <></>;

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedIpPorts(selectedRows);
    },
  };

  const columns = [
    {
      title: "Ip",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "Port",
      dataIndex: "ports",
      render: (services: any[]) =>
        services.map((service, index) => (
          <p key={index}> {`${service.service}: ${service.port}`} </p>
        )),
      key: "ports",
    },
  ];

  return (
    <Table
      rowKey="ip"
      rowSelection={rowSelection}
      dataSource={data}
      columns={columns}
      loading={{ indicator: <Spin />, spinning: isFetching }}
    />
  );
};

export const PcScanner = () => {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedIpPorts, setSelectedIpPorts] = useState([]);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    setIsFetching(true);
    // const res = await Scanner("", "", 0, ["1662"]);
    const res = [
      {
        ip: "192.168.15.194",
        ports: [
          {
            service: "nube-assist",
            port: "1662",
            key: 1,
          },
        ],
      },
      {
        ip: "192.168.15.55",
        ports: [
          {
            service: "nube-assist",
            port: "1662",
            key: 1,
          },
        ],
      },
    ] as any;
    setData(res);
    setIsFetching(false);
  };

  const refreshList = () => {
    fetch();
  };

  const showModal = () => {
    if (selectedIpPorts.length === 0) {
      return openNotificationWithIcon("warning", `Please select Ip`);
    }
    setIsModalVisible(true);
  };

  return (
    <>
      <AddButton showModal={showModal} />
      <Button
        type="primary"
        onClick={refreshList}
        style={{ margin: "5px", float: "right" }}
      >
        <RedoOutlined /> Refresh
      </Button>
      <ScannerTable
        data={data}
        isFetching={isFetching}
        setSelectedIpPorts={setSelectedIpPorts}
      />
      <CreateModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        selectedIpPorts={selectedIpPorts}
        refreshList={refreshList}
      />
    </>
  );
};
