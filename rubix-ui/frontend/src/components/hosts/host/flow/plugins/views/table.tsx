import { Spin, Table } from "antd";

export const FlowPluginsTable = (props: any) => {
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
      dataIndex: "module_path",
      key: "module_path",
    },
    {
      title: "enable",
      dataIndex: "enabled",
      key: "enabled",
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
