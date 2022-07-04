import {Spin, Table, Tag} from "antd";

export const FlowPluginsTable = (props: any) => {
  const { data, isFetching } = props;
  if (!data) return <></>;

  for (const val of data) {
    if (val.enabled){ // react is crap and can't render a bool
      val.enabled = "enabled"
    } else {
      val.enabled = "disabled"
    }
  }

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record: any, selected: any, selectedRows: any) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

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
      title: 'enabled',
      key: 'enabled',
      dataIndex: 'enabled',
      render(enabled:string) {
        return {
          props: {
            style: { background: enabled == "enabled" ? "#e6ffee" : "#d1d1e0" }
          },
          children: <div>{enabled}</div>
        };
      }
    },
  ];

  return (
    <Table
      rowKey="uuid"
      rowSelection={rowSelection}
      dataSource={data}
      columns={columns}
      loading={{ indicator: <Spin />, spinning: isFetching }}
    />
  );
};
