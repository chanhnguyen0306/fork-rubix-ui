import { Button, Card, Form, Input, Modal } from "antd";
import { useParams } from "react-router-dom";
import { EdgeBiosTokenFactory } from "../../edgebios/token/factory";
import { useState } from "react";

export const TokenModal = (props: any) => {
  const [jwtToken, setJwtToken] = useState("");
  const [tokens, setTokens] = useState([]);
  const { connUUID = "" } = useParams();
  const { isModalVisible, selectedHost, onCloseModal } = props;

  const factory = new EdgeBiosTokenFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = selectedHost.uuid;

  const handleClose = () => {
    onCloseModal();
  };

  const onFinish = async (values: any) => {
    try {
      const response = await factory.EdgeBiosLogin(values.username, values.password)
      setJwtToken(response.access_token)
      console.log("jwtToken", jwtToken)
      const tokens = await factory.EdgeBiosTokens(jwtToken)
      console.log("tokens", tokens)
      setTokens(tokens)
    } catch (error) {
      console.log(error);
    } finally {
      console.log("completed querying tokens...")
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal
      centered
      title={selectedHost.name}
      visible={isModalVisible}
      maskClosable={false}
      footer={null}
      onCancel={handleClose}
      style={{ textAlign: "start" }}
      width="50%"
    >
      <Card title="External Tokens">
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>




      </Card>
    </Modal>
  );
};
