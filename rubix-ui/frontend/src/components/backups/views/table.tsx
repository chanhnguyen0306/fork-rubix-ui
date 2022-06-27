import { Spin, Table } from "antd";

export const BackupsTable = (props: any) => {
  const { data, isFetching } = props;
  if (!data) return <></>;

  const columns = [
    {
      title: "uuid",
      dataIndex: "uuid",
      key: "uuid",
    },
    {
      title: "Connection Name",
      dataIndex: "connection_name",
      key: "connection_name",
    },
    {
      title: "Host Name",
      dataIndex: "host_name",
      key: "host_name",
    },
    {
      title: "Timestamp",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Application",
      dataIndex: "application",
      key: "application",
    },
    {
      title: "Info",
      dataIndex: "backup_info",
      key: "backup_info",
    },
    {
      title: "Comments",
      dataIndex: "user_comment",
      key: "user_comment",
    },
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
