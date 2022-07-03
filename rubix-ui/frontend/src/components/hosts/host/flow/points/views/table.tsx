import { Spin, Table } from "antd";

export const FlowPointsTable = (props: any) => {
  const {data, isFetching, connUUID, hostUUID, deviceUUID} = props;
  if (!data) return <></>;

  console.log("POINT_TABLE", connUUID, hostUUID, deviceUUID)

  const columns = [
    {
      title: "uuid",
      dataIndex: "uuid",
      key: "uuid",
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "device",
      dataIndex: "device_uuid",
      key: "device_uuid",
    }
  ];

  return (
      <Table
          rowKey="uuid"
          dataSource={data}
          columns={columns}
          loading={{ indicator: <Spin />, spinning: isFetching }}
      />
  );
};
