import {Space, Spin, Table} from "antd";


export const LocationsTable = (props: any) => {
    let { locations, isFetching, tableSchema } = props;
    if (!locations) return <></>;

    return (
        <div>
            <Table
                rowKey="uuid"
                dataSource={locations}
                columns={tableSchema}
                loading={{ indicator: <Spin />, spinning: isFetching }}
            />
        </div>
    );
};