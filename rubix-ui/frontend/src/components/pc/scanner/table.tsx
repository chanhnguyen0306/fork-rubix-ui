import { useEffect, useState } from "react";
import { Button, Collapse, Modal, Spin, Table } from "antd";
import { RedoOutlined, PlusOutlined } from "@ant-design/icons";
import { JsonForm } from "../../../common/json-form";
const { Panel } = Collapse;

export const PcScanner = () => {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    setIsFetching(true);
    // const res = await Scanner("", "", 0, ["1662"]);
    const res = [
      //this is fake data
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
    setIsModalVisible(true);
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ margin: "5px", float: "right" }}
      >
        <PlusOutlined /> Add
      </Button>
      <Button
        type="primary"
        onClick={refreshList}
        style={{ margin: "5px", float: "right" }}
      >
        <RedoOutlined /> Refresh
      </Button>
      <ScannerTable data={data} isFetching={isFetching} />
      <CreateModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </>
  );
};

const ScannerTable = (props: any) => {
  let { data, isFetching } = props;
  if (!data) return <></>;

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`);
      console.log("selectedRows: ", selectedRows);
    },
    onSelect: (record: any, selected: any, selectedRows: any) => {
      console.log("onSelect", record, selected, selectedRows);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      console.log("onSelectAll", selected, selectedRows, changeRows);
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
        services.map((service) => (
          <p> {`${service.service}: ${service.port}`} </p>
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

const CreateModal = (props: any) => {
  const { isModalVisible, setIsModalVisible } = props;
  const [formData, setFormData] = useState({});

  const schema = {
    properties: {
      uuid: {
        type: "string",
        title: "uuid",
        readOnly: true,
      },
      name: {
        type: "string",
        title: "name",
        minLength: 2,
        maxLength: 50,
      },
      description: {
        type: "string",
        title: "description",
      },
      ip: {
        type: "string",
        title: "ip address",
        default: "192.168.15.194",
        help: "ip address, eg 192.168.15.10 or nube-io.com (https:// is not needed in front of the address)",
      },
      port: {
        type: "number",
        title: "port",
        minLength: 2,
        maxLength: 65535,
        default: 1662,
        help: "ip port, eg port 8080 192.168.15.10:8080",
      },
      https: {
        type: "boolean",
        title: "enable https",
      },
      username: {
        type: "string",
        title: "username",
        minLength: 1,
        maxLength: 50,
        default: "admin",
      },
      password: {
        type: "string",
        title: "password",
      },
    },
  };
  return (
    <Modal
      title="Add New"
      visible={isModalVisible}
      onOk={() => console.log("onOk")}
      onCancel={() => setIsModalVisible(false)}
      okText="Save"
      style={{ textAlign: "start" }}
    >
      <Collapse defaultActiveKey={["1"]}>
        <Panel header="192.168.15.194" key="1">
          <JsonForm
            formData={{ ip: "192.168.15.194" }}
            jsonSchema={schema}
            setFormData={setFormData}
          />
        </Panel>
      </Collapse>
    </Modal>
  );
};
