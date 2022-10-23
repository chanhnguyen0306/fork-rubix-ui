import { Spin } from "antd";
import RbTable from "../../../common/rb-table";
import { WIRES_CONNECTIONS_HEADERS } from "../../../constants/headers";
import { FlowFactory } from "../../rubix-flow/factory";

export const WiresConnectionsTable = (props: any) => {
  const { data, isFetching, refreshList } = props;
  let factory = new FlowFactory();

  const columns = WIRES_CONNECTIONS_HEADERS;

  return (
    <>
      <RbTable
        rowKey="uuid"
        dataSource={data}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </>
  );
};
