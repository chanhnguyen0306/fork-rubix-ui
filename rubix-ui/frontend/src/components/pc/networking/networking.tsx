import { useEffect, useState } from "react";
import { Spin, Typography } from "antd";
import {
  GetPcGetNetworks,
  GetPcGetNetworksSchema,
} from "../../../../wailsjs/go/main/App";
import RbTable from "../../../common/rb-table";
import { RbRefreshButton } from "../../../common/rb-table-actions";

const { Title } = Typography;

export const PcNetworking = () => {
  const [data, setData] = useState([] as []);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      setIsFetching(true);
      const res = await GetPcGetNetworks();
      setData(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <Title level={3} style={{ textAlign: "left" }}>
        Rubix Scanner
      </Title>
      <RbRefreshButton refreshList={fetch} />
      <ScannerTable data={data} isFetching={isFetching} />
    </>
  );
};

export const ScannerTable = (props: any) => {
  let { data, isFetching, rowKey } = props;
  const [schema, setSchema] = useState([]);
  if (!data) return <></>;

  const columns = schema.sort((a: any, b: any) => {
    if (a.key < b.key) {
      return -1;
    }
    if (a.key > b.key) {
      return 1;
    }
    return 0;
  });

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(selectedRowKeys, selectedRows);
    },
    onSelect: (record: any, selected: any, selectedRows: any) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  useEffect(() => {
    fetchSchema();
  }, []);

  const fetchSchema = async () => {
    const res = await GetPcGetNetworksSchema();
    setSchema(res);
  };

  return (
    <div>
      <RbTable
        rowKey={rowKey ? rowKey : "interface"}
        rowSelection={rowSelection}
        dataSource={data}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </div>
  );
};
