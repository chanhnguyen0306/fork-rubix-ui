import { Spin, Table } from "antd";

export const FlowNetworkTable = (props: any) => {
  const { data, isFetching } = props;
  if (!data) return <></>;

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
      title: "plugin",
      dataIndex: "plugin",
      key: "plugin",
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
