import {Button, Image, Spin, Table, Tabs, Tag} from "antd";
import {PlayCircleOutlined, PlusOutlined, RedoOutlined, StopOutlined,} from "@ant-design/icons";
import {useState} from "react";
import {FlowPluginFactory} from "../factory";
import {FlowNetworkFactory} from "../../networks/factory";
import {isObjectEmpty} from "../../../../../../utils/utils";
import {CreateModal} from "./create";
import {main, model} from "../../../../../../../wailsjs/go/models";

import bacnetLogo from '../../../../../../assets/images/BACnet_logo.png';
import nubeLogo from '../../../../../../assets/images/Nube-logo.png';
import {DisabledColour, DisabledText, EnableColour, EnableText} from "../../../../../../style";


export const FlowPluginsTable = (props: any) => {
    const {data, isFetching, connUUID, hostUUID, refreshList, fetchPlugins} = props;
    const [plugins, setPlugins] = useState([] as Array<model.PluginConf>);
    const [pluginsUUIDs, setPluginsUUIDs] = useState([] as Array<main.PluginUUIDs>);
    const [networkSchema, setNetworkSchema] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoadingForm, setIsLoadingForm] = useState(false);

    let factory = new FlowPluginFactory();
    let flowNetworkFactory = new FlowNetworkFactory();

    const enable = async () => {
        factory.connectionUUID = connUUID;
        factory.hostUUID = hostUUID;
        await factory.BulkEnable(pluginsUUIDs);
        fetchPlugins()
    };

    const disable = async () => {
        factory.connectionUUID = connUUID;
        factory.hostUUID = hostUUID;
        await factory.BulkDisable(pluginsUUIDs);
        fetchPlugins()
    };

    const rowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: Array<model.PluginConf>) => {
            setPluginsUUIDs(selectedRows);
            setPlugins(selectedRows);
        },
    };

    const getSchema = async () => {
        setIsLoadingForm(true);
        if (plugins.length > 0) {
            let plg = plugins.at(0) as unknown as model.PluginConf
            const res = await flowNetworkFactory.Schema(
                connUUID,
                hostUUID,
                plg.name
            );
            const jsonSchema = {
                properties: res,
            };
            setNetworkSchema(jsonSchema);
            setIsLoadingForm(false);
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
        if (isObjectEmpty(networkSchema)) {
            getSchema();
        }
    };
    const columns = [
        {
            title: 'name',
            key: 'name',
            dataIndex: 'name',
            render(name: string) {
                let image = nubeLogo
                if (name == "bacnetmaster") {
                    image = bacnetLogo
                }
                if (name == "bacnet") {
                    image = bacnetLogo
                }
                return (
                    <Image
                        width={70}
                        src={image}
                    />
                );
            },
        },
        {
            title: 'name',
            key: 'name',
            dataIndex: 'name',
            render(plugin_name: string) {
                let colour = "#4d4dff"
                let text = plugin_name.toUpperCase()
                return (
                    <Tag color={colour}>
                        {text}
                    </Tag>
                );
            },
        },
        {
            title: "uuid",
            dataIndex: "uuid",
            key: "uuid",
        },
        {
            title: 'Tags',
            key: 'has_network',
            dataIndex: 'has_network',
            render(has_network: boolean) {
                let colour = "blue"
                let text = "non network plugin"
                if (has_network) {
                    colour = "orange"
                    text = "network driver"
                }
                return (
                    <Tag color={colour}>
                        {text}
                    </Tag>
                );
            },
        },
        {
            title: "status",
            key: "enabled",
            dataIndex: "enabled",
            render(enabled: boolean) {
                let colour = DisabledColour
                let text = DisabledText
                if (enabled) {
                    colour = EnableColour
                    text = EnableText
                }
                return (
                    <Tag color={colour}>
                        {text}
                    </Tag>
                );
            },
        },
    ];
    const {TabPane} = Tabs;

    function callback(key: any) {
        console.log(key);
    }

    return (


        <>
            <Tabs defaultActiveKey="1" tabPosition={"top"} onChange={callback}>
                <TabPane tab="Manage" key="3">
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
                    <Button //add network
                        type="ghost"
                        onClick={showModal}
                        style={{margin: "5px", float: "right"}}
                    >
                        <PlusOutlined/> Add Network
                    </Button>
                    <Button
                        type="primary"
                        onClick={fetchPlugins}
                        style={{margin: "5px", float: "right"}}
                    >
                        <RedoOutlined/> Refresh
                    </Button>
                    <Table
                        rowKey="uuid"
                        rowSelection={rowSelection}
                        dataSource={data}
                        columns={columns}
                        loading={{indicator: <Spin/>, spinning: isFetching}}
                    />
                    <CreateModal
                        isModalVisible={isModalVisible}
                        isLoadingForm={isLoadingForm}
                        connUUID={connUUID}
                        hostUUID={hostUUID}
                        networkSchema={networkSchema}
                        onCloseModal={() => setIsModalVisible(false)}
                    />

                </TabPane>
                <TabPane tab="Tab 2" key="2">
                    Content of Tab Pane 2
                </TabPane>
            </Tabs>


        </>
    );
};
