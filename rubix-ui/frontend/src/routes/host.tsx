import { Button, Form } from "antd";
import { model } from "../../wailsjs/go/models";
import Input from "antd/es/input/Input";

import { AddHost, GetHostNetworks } from "../../wailsjs/go/main/App";

async function addHost(host: model.Host): Promise<model.Host> {
  //we need the network_uuid to pass
  let networks: Array<model.Network> = {} as Array<model.Network>;
  await GetHostNetworks().then((r) => {
    networks = r;
  });
  //now the user would select the network, and we need its uuid
  //host.NetworkUUID = what user selected
  console.log("try and add host", networks);
  let addedHost: model.Host = {} as model.Host;
  await AddHost(host).then((res) => {
    console.log("added host", res.uuid);
    addedHost = res;
  });
  return addedHost;
}

export function AddHostForm() {
  return (
    <div
      style={{
        display: "block",
        width: 700,
        padding: 30,
      }}
    >
      <h4>ReactJS Ant-Design Form Component</h4>
      <Form
        name="name"
        onFinishFailed={() => alert("Failed to submit")}
        onFinish={(e: model.Host) => {
          addHost(e).then((r) => {
            console.log("added a host", r);
          });
        }}
        initialValues={{ remember: true }}
      >
        <Form.Item
          label="Enter username"
          name="name"
          // rules={[{required: true, message: 'Please enter username'}]}
        >
          <Input onChange={(e) => {}} />
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
