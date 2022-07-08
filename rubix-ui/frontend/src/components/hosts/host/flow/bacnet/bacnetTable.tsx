import {Spin} from "antd";

import RbTable from "../../../../../common/rb-table";
import {useState} from "react";
import {main, model} from "../../../../../../wailsjs/go/models";

export const BacnetWhoIsTable = (props: any) => {
    const { data, isFetching } = props;
    const [selectedUUIDs, setSelectedUUIDs] = useState([] as Array<model.Device>);


    const rowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            setSelectedUUIDs(selectedRows);
        },
    };

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
            rowSelection={rowSelection}
            dataSource={data}
            columns={columns}
            loading={{ indicator: <Spin />, spinning: isFetching }}
        />
    );
};
