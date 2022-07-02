import {Spin, Table} from "antd";

export const NetworksTable = (props: any) => {
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
