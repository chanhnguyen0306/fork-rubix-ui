import { Button, Card, Form, FormInstance, Input, Modal, Spin } from "antd";
import { useParams } from "react-router-dom";
import { EdgeBiosTokenFactory } from "../../edgebios/token/factory";
import { createRef, useEffect, useState } from "react";
import TokenView from "./token-view";
import { assistmodel, externaltoken } from "../../../../wailsjs/go/models";
import { PlusOutlined } from "@ant-design/icons";
import TokenGeneratorModal from "./token-generator-modal";
import { useSettings } from "../../settings/use-settings";
import ExternalToken = externaltoken.ExternalToken;
import Host = assistmodel.Host;
import { DARK_THEME, LIGHT_THEME } from "../../../themes/use-theme";

export const TokenModal = (props: ITokenModel) => {
  const { connUUID = "" } = useParams();
  const { isModalVisible, selectedHost, onCloseModal } = props;
  const [settings] = useSettings();

  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<ExternalToken[]>([]);
  const [refreshingToken, setRefreshingToken] = useState(false)
  const [isTokenGenerateModalVisible, setIsTokenGenerateModalVisible] = useState(false);
  const loginFormRef = createRef<FormInstance>();

  const factory = new EdgeBiosTokenFactory();
  factory.connectionUUID = connUUID;
  factory.hostUUID = selectedHost.uuid;

  useEffect(() => {
    setJwtToken("");
    setLoading(false);
    setTokens([]);
    setRefreshingToken(false);
    setIsTokenGenerateModalVisible(false);
    loginFormRef?.current?.resetFields();
  }, [selectedHost])

  const handleClose = () => {
    onCloseModal();
  };

  const onCloseTokenGeneratorModal = () => {
    setIsTokenGenerateModalVisible(false);
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

  const showTokenGenerateModal = (e: any) => {
    setIsTokenGenerateModalVisible(true)
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
        <Card title="Tokens"
              style={{ backgroundColor: settings.theme == LIGHT_THEME ? 'fff' : '' }}
              extra={jwtToken && <Button type="primary" icon={<PlusOutlined />}
                                         size="small"
                                         onClick={showTokenGenerateModal}
              />}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            ref={loginFormRef}
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
          {isTokenGenerateModalVisible &&
            <TokenGeneratorModal isModalVisible={true} jwtToken={jwtToken}
                                 onCloseModal={onCloseTokenGeneratorModal}
                                 factory={factory} fetchToken={fetchToken} />}
        </Card>
      </Spin>
    </Modal>
  );
};

interface ITokenModel {
  isModalVisible: boolean;
  selectedHost: Host;
  onCloseModal: any;
}
