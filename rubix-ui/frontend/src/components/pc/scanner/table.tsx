import {useEffect, useState} from "react";
import {model} from "../../../../wailsjs/go/models";
import {useLocation, useParams} from "react-router-dom";
import {
    Scanner
} from "../../../../wailsjs/go/main/App";
import {Button, Space, Spin, Table} from "antd";
import {PlusOutlined} from "@ant-design/icons";

const AddButton = (props: any) => {
    const { showModal } = props;

    return (
        <Button
            type="primary"
            onClick={() => showModal}
            style={{ margin: "5px", float: "right" }}
        >
            <PlusOutlined /> Host
        </Button>
    );
};

export const PcScanner = () => {
    const [hosts, setHosts] = useState([] as []);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchNetworks = async () => {
            setIsFetching(true);
            const res = await Scanner("", "", 0, []);
            setHosts(res);
            setIsFetching(false);

        };
        fetchNetworks()
    }, []);


    return (
        <>
            <h1>Rubix Scanner</h1>
            {/*<AddButton showModal={fetchNetworks} />*/}
            <HostsTable
                hosts={hosts}
                isFetching={isFetching}


            />
        </>
    );
};


const HostsTable =  (props: any) => {
    let { hosts, isFetching} = props;
    if (!hosts) return <></>;
    hosts = hosts["hosts"]

    const columns = [
        {
            title: 'ip',
            dataIndex: 'ip',
            key: 'ip',
        },
        {
            title: 'ports',
            dataIndex: "ports",
            render: (services: any[]) => services.map(service => `${service.service_name}:${service.port}`).join(),
            key: 'ports',
        }
    ]

    return (
        <Table
            rowKey="uuid"
            dataSource={hosts}
            columns={columns}
            loading={{indicator: <Spin/>, spinning: isFetching}}
        />
    );
};
