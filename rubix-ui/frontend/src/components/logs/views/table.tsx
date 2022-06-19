import {useNavigate} from "react-router-dom";
import {Spin, Table} from "antd";

export const LogsTable = (props: any) => {
    const {
        connections,
        isFetching,
    } = props;
    if (!connections) return <></>;


    const navigate = useNavigate();

    const columns = [
        {
            title: "uuid",
            dataIndex: "uuid",
            key: "uuid",
        },
        {
            title: "Timestamp",
            dataIndex: "time",
            key: "time",
        },
        {
            title: "Table",
            dataIndex: "function",
            key: "function",
        },
        {
            title: "Action Type",
            dataIndex: "type",
            key: "type",
        }
    ];

    return (
        <div>
            <Table
                rowKey="uuid"
                dataSource={connections}
                columns={columns}
                loading={{ indicator: <Spin />, spinning: isFetching }}
            />
        </div>
    );
};
