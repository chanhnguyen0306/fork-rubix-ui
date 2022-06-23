import React, {useEffect, useState} from "react";
import {Scanner} from "../../../../wailsjs/go/main/App";
import {Button, Spin, Table} from "antd";
import {RedoOutlined} from "@ant-design/icons";


export const PcScanner = () => {
    const [data, setData] = useState([] as []);
    const [isFetching, setIsFetching] = useState(true)

    const fetch = async () => {
        setIsFetching(true);
        const res = await Scanner("", "", 0, ["1662"]);
        setData(res);
        setIsFetching(false);
    };


    useEffect(() => {
        setIsFetching(false);
    }, []);

    const refreshList = () => {
        fetch().then().catch(err => {
            console.log(err)
        });
    };
    return (
        <>
            <Button
                type="primary"
                onClick={refreshList}
                style={{margin: "5px", float: "right"}}
            >
                <RedoOutlined/> Refresh
            </Button>
            <ScannerTable
                data={data}
                isFetching={isFetching}
            />
        </>
    );
};


const ScannerTable = (props: any) => {
    let {data, isFetching} = props;



    if (!data) return <></>;
    data = data["hosts"]


    const rowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record: any, selected: any, selectedRows: any) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
            console.log(selected, selectedRows, changeRows);
        },
    };

    console.log(data)

    const columns = [
        {
            title: 'ip',
            dataIndex: 'ip',
            key: 'ip',

        },
        {
            title: 'ports',
            dataIndex: "ports",
            render: (services: any[]) => services.map(service => <p> {`${service.service}:${service.port}`} </p>),
            key: 'ports',
        }
    ]


    return (
        <div>
            <Table
                rowKey={"ip"}
                rowSelection={rowSelection}
                dataSource={data}
                columns={columns}
                loading={{indicator: <Spin/>, spinning: isFetching}}
            />
        </div>
    );
};
