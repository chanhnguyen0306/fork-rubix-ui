import { Route, Routes, useNavigate } from "react-router-dom";
import React from "react";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import {
    LinkOutlined,
} from "@ant-design/icons";
import { Locations } from "./routes/locations";
import { Networks } from "./routes/networks";
import { Hosts } from "./routes/hosts";
import {Connections} from "./components/connections/connections";
import "./App.css";
import Iframe from "./components/iframe/iframe";
import {Logs} from "./components/logs/logs";
import {HostNetworking} from "./components/system/ips/ips";
import {ConnectionFactory} from "./components/connections/factory";
import {HostsFactory} from "./components/hosts/hosts";

const { Content, Sider } = Layout;

const sidebarItems = [
    { name: "Connections", icon: LinkOutlined, link: "/" },
    { name: "Logs", icon: LinkOutlined, link: "/logs" },
    { name: "iframe", icon: LinkOutlined, link: "/iframe" },
    // { name: "Networks", icon: WifiOutlined, link: "/networks" },
    // { name: "Hosts", icon: ApartmentOutlined, link: "/host" },
];

const menuItems: MenuProps["items"] = sidebarItems.map(
    ({ name, icon, link }) => {
        return {
            key: link,
            icon: React.createElement(icon),
            label: name,
        };
    }
);

const App: React.FC = () => {
    let navigate = useNavigate();
    //con_3B8CD6ECCE77
    // let host = new HostsFactory();
    // let hostUUID = host.GetFistUUID();
    // let con = new ConnectionFactory()
    // let connUUID = con.GetFistUUID()
    // console.log(hostUUID)

    let hostIps = new HostNetworking();
    hostIps.hostUUID = "hos_B609A3CD37B2"
    hostIps.connectionUUID = "con_3B8CD6ECCE77"
    hostIps.GetActive().then(r => console.log(r))

    const onClick = (e: any) => {
        navigate(e.key);
    };

    return (
        <Layout>
            <Sider width={200} style={{height: "100vh"}}>
                <Menu mode="inline" theme="dark" items={menuItems} onClick={onClick}/>
            </Sider>
            <Layout style={{padding: "0 24px 24px"}}>
                <Content
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                    }}
                >
                    <Routes>
                        <Route path="/" element={<Connections/>}/>
                        <Route path="/logs" element={<Logs/>}/>
                        <Route path="/iframe" element={<Iframe source={"https://nube-io.com/"}/>}/>
                        <Route path="/locations/:connUUID" element={<Locations/>}/>
                        <Route path="/networks/:locUUID" element={<Networks/>}/>
                        <Route path="/hosts/:netUUID" element={<Hosts/>}/>
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};
export default App;