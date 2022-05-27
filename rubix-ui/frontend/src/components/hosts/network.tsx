import {Button, Form} from "antd";
import {model} from "../../../wailsjs/go/models";
import Input from "antd/es/input/Input";
import {AddHostNetwork} from "../../../wailsjs/go/main/App";


export namespace network {
    async function addNetwork(host: model.Network):Promise<model.Network> {
        //we need the network_uuid to pass
        let addedHost: model.Network = {} as model.Network
        await AddHostNetwork(host).then(res => {
            console.log("added host", res.uuid)
            addedHost = res
        });
        return addedHost
    }


    export function AddNetworkForm() {
        return (
            <div style={{
                display: 'block', width: 700, padding: 30
            }}>
                <h4>ReactJS Ant-Design Form Component</h4>
                <Form
                    name="name"
                    onFinishFailed={() => alert('Failed to submit')}
                    onFinish={(e:model.Network) => {
                        addNetwork(e).then(r => {
                            console.log("added a host", r)
                        })
                    }}
                    initialValues={{remember: true}}
                >
                    <Form.Item
                        label="Enter username"
                        name="name"
                        // rules={[{required: true, message: 'Please enter username'}]}
                    >
                        <Input
                            onChange={(e) => {
                            }}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit Username
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}