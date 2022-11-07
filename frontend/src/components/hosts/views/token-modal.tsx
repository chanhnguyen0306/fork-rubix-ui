import { Button, Card, Form, Input, Modal, Spin } from "antd";
import { useParams } from "react-router-dom";
import { EdgeBiosTokenFactory } from "../../edgebios/token/factory";
import { useEffect, useState } from "react";
import TokenView from "./token-view";
import { externaltoken } from "../../../../wailsjs/go/models";
import ExternalToken = externaltoken.ExternalToken;

export const TokenModal = (props: any) => {
  const { connUUID = "" } = useParams();
  const { isModalVisible, selectedHost, onCloseModal } = props;

  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<ExternalToken[]>([]);
  const [refreshingToken, setRefreshingToken] = useState(false)

  const factory = new EdgeBiosTokenFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = selectedHost.uuid;

  const handleClose = () => {
    onCloseModal();
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true)
      const response = await factory.EdgeBiosLogin(values.username, values.password)
      setJwtToken(response.access_token)
    } catch (error) {
      console.log("error:", error);
    } finally {
      setLoading(false)
    }
  };

  function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  const fetchToken = async () => {
    if (jwtToken != "") {
      setRefreshingToken(true)
      await sleep(1000)
      try {
        const tokens = await factory.EdgeBiosTokens(jwtToken)
        setTokens(tokens || undefined) // restrict to pass null to child
      } finally {
        setRefreshingToken(false)
      }
    }
  }

  useEffect(() => {
    fetchToken().catch(console.error);
  }, [jwtToken])

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
      <Spin tip="refreshing tokens..." spinning={refreshingToken}>
        <Card title="External Tokens">
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{
                required: true,
                message: 'Please input your username!'
              }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{
                required: true,
                message: 'Please input your password!'
              }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>

          <TokenView jwtToken={jwtToken} tokens={tokens} factory={factory}
                     fetchToken={fetchToken} />
        </Card>
      </Spin>
    </Modal>
  );
};
