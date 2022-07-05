import {Button, Spin, Table} from "antd";
import {PlayCircleOutlined, PlusOutlined, StopOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {FlowPluginFactory} from "../factory";
import {FlowNetworkFactory} from "../../networks/factory";
import {model} from "../../../../../../../wailsjs/go/models";

export const FlowPluginsTable = (props: any) => {
    const {data, isFetching, connUUID, hostUUID} = props;
    const [plugins, setPlugins] = useState([] as string[]);
    if (!data) return <></>;

    for (const val of data) {
        if (val.enabled) { // react is crap and can't render a bool
            val.enabled = "enabled"
        } else {
            val.enabled = "disabled"
        }
    }

    let flowNetworkFactory = new FlowNetworkFactory();
    flowNetworkFactory.Schema(connUUID, hostUUID, "bacnetmaster").then(e => console.log(e))
    // todo pass in the UserSelectedPluginName for flowNetworkFactory.Schema

    let factory = new FlowPluginFactory();
    const enable = async () => {
        factory.connectionUUID = connUUID
        factory.hostUUID = hostUUID
        factory.BulkEnable(plugins);
    };

    const disable = async () => {
        factory.connectionUUID = connUUID
        factory.hostUUID = hostUUID
        factory.BulkDisable(plugins);
    };

    const addNetwork = async () => {
        factory.connectionUUID = connUUID
        factory.hostUUID = hostUUID
        const net = new model.Network;
        flowNetworkFactory.Add(net)
    };


    const rowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            setPlugins(selectedRowKeys)
        },
    };


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
        },
        {
            title: "plugin",
            dataIndex: "module_path",
            key: "module_path",
        },
        {
            title: 'status',
            key: 'enabled',
            dataIndex: 'enabled',
            render(enabled: string) {
                return {
                    props: {
                        style: {background: enabled == "enabled" ? "#e6ffee" : "#d1d1e0"}
                    },
                    children: <div>{enabled}</div>
                };
            }
        },
    ];

    return (
        <>
            <Button
                type="primary"
                onClick={enable}
                style={{margin: "5px", float: "right"}}
            >
                <PlayCircleOutlined/> Enable Plugins
            </Button>
            <Button
                type="ghost"
                onClick={disable}
                style={{margin: "5px", float: "right"}}
            >
                <StopOutlined/> Disable Plugins
            </Button>
            <Button
                type="ghost"
                onClick={addNetwork}
                style={{margin: "5px", float: "right"}}
            >
                <PlusOutlined/> Add Network
            </Button>
            <Table
                rowKey="uuid"
                rowSelection={rowSelection}
                dataSource={data}
                columns={columns}
                loading={{indicator: <Spin/>, spinning: isFetching}}
            />
        </>
    );
};
