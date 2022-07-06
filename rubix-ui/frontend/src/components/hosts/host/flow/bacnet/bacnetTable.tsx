import {Spin, Table} from "antd";

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
        <Table
            rowKey="uuid"
            dataSource={data}
            columns={columns}
            loading={{ indicator: <Spin />, spinning: isFetching }}
        />
    );
};
