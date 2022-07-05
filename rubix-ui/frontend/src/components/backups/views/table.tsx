import {notification, Spin, Table} from "antd";
import {EventsOn} from "../../../../wailsjs/runtime";

export const BackupsTable = (props: any) => {
    const {data, isFetching} = props;
    if (!data) return <></>;

    const columns = [
        {
            title: "uuid",
            dataIndex: "uuid",
            key: "uuid",
        },
        {
            title: "connection name",
            dataIndex: "connection_name",
            key: "connection_name",
        },
        {
            title: "connection uuid",
            dataIndex: "connection_uuid",
            key: "connection_uuid",
        },
        {
            title: "host name",
            dataIndex: "host_name",
            key: "host_name",
        },
        {
            title: "host uuid",
            dataIndex: "host_uuid",
            key: "host_uuid",
        },
        {
            title: "timestamp",
            dataIndex: "time",
            key: "time",
        },
        {
            title: "application",
            dataIndex: "application",
            key: "application",
        },
        {
            title: "info",
            dataIndex: "backup_info",
            key: "backup_info",
        },
        {
            title: "Comments",
            dataIndex: "user_comment",
            key: "user_comment",
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {

        },
    };

    return (
        <Table
            rowKey="uuid"
            dataSource={data}
            columns={columns}
            rowSelection={rowSelection}
            loading={{indicator: <Spin/>, spinning: isFetching}}
        />
    );
};
