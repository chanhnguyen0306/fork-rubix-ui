import {Spin} from "antd";

import RbTable from "../../../../../common/rb-table";

export const BacnetWhoIsTable = (props: any) => {
    const { data, isFetching } = props;
    // if (!data) return <></>;

    const columns = [

        {
            title: "name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "device id",
            dataIndex: "device_object_id",
            key: "device_object_id",
        },
        {
            title: "ip",
            dataIndex: "host",
            key: "host",
        },
        {
            title: "port",
            dataIndex: "port",
            key: "port",
        },
    ];
    return (
        <RbTable
            rowKey="uuid"
            dataSource={data}
            columns={columns}
            loading={{ indicator: <Spin />, spinning: isFetching }}
        />
    );
};
