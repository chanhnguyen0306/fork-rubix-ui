import {useState} from 'react';
import logo from './assets/images/logo-universal.png';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import {GetHosts, Greet, AddHost} from "../wailsjs/go/main/App";
import {Button, Form} from 'antd';
import Input from "antd/es/input/Input";
import {model} from "../wailsjs/go/models";

const Create = ()  => (
    <Form>
        <Form.Item name="username"  rules={[{ required: true }]}>
            <Input  value={"22"}/>
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
    </Form>
);


function App() {
    const [resultText, setResultText] = useState("Please enter  below 👇");
    const [name, setName] = useState('');
    const updateName = (e: any) => setName(e.target.value);
    const updateResultText = (result: string) => setResultText(result);

    const [userName, setUserName] = useState("");

    function greet() {
        Greet(name).then(updateResultText);
    }

    function greet2() {
        GetHosts().then(r => {
            // @ts-ignore
            updateResultText(r.at(0).uuid+name)
        })

        console.log(11111)

        let host :model.Host = {
            bios_port: 0,
            ip: "",
            name: "111111",
            network_uuid:"hos_5c175270fb384918",
            offline_count: 0,
            password: "",
            ping_frequency: 0,
            port: 0,
            rubix_password: "",
            rubix_port: 0,
            rubix_username: "",
            username: "",
            uuid: ""
        }

        AddHost(host).then(r => {
            console.log(r)
        })
    }


    return (
        <div id="App">
            {/*<img src={logo} id="logo" alt="logo"/>*/}
            <div id="result" className="result">{resultText}</div>
            <div id="input" className="input-box">
                <input id="name" onChange={updateName} autoComplete="off" name="input" type="text"/>
                <Button
                    type="primary"
                    shape="round"
                    style={{ color: 'white', zIndex: 10 }}
                    onClick={e => { e.stopPropagation(); greet2()}}
                >
                    X
                </Button>

                <div>
                    <Create/>
                </div>
            </div>
        </div>
    )
}

export default App