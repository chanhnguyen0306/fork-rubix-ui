import {Button, Spin, Table, Tag} from "antd";
import {PlayCircleOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {model} from "../../../../../../../wailsjs/go/models";
import {FlowPluginFactory} from "../factory";

export const FlowPluginsTable = (props: any) => {
  const { data, isFetching } = props;
  const [plugins, setPlugins] = useState([] as string[]);
  if (!data) return <></>;

  for (const val of data) {
    if (val.enabled){ // react is crap and can't render a bool
      val.enabled = "enabled"
    } else {
      val.enabled = "disabled"
    }
  }

  let factory = new FlowPluginFactory();
  const enable = async () => {

    if (plugins.length > 0){
      try {
        console.log(plugins)
        // let res = await factory.BulkEnable(plugins);
        // console.log(res)

      } catch (error) {
        console.log(error);

      } finally {

      }
    }


  };


  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setPlugins(selectedRowKeys)
    },
    onSelect: (record: any, selected: any, selectedRows: any) => {
      // console.log(record, selected, selectedRows);
      // setPlugins(selectedRows)
      // console.log(11111, plugins)

    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      // console.log(selected, selectedRows, changeRows);
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
      <>
      <Button
          type="primary"
          onClick={enable}
          style={{margin: "5px", float: "right"}}
      >
        <PlayCircleOutlined/> Enable Plugins
      </Button>
    <Table
      rowKey="uuid"
      rowSelection={rowSelection}
      dataSource={data}
      columns={columns}
      loading={{ indicator: <Spin />, spinning: isFetching }}
    />
      </>
  );
};
