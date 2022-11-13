import React, { useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { externaltoken } from "../../../wailsjs/go/models";
import { CommonTokenFactory } from "./factory";


export const TokenGeneratorModal = (props: ITokenGeneratorModal) => {
  const { isModalVisible, jwtToken, onCloseModal, factory, fetchToken } = props;

  const [loading, setLoading] = useState(false);
  const [isTokenCreated, setIsTokenCreated] = useState(false);
  const [generatedToken, setGeneratedToken] = useState({} as externaltoken.ExternalToken);

  const handleClose = () => {
    onCloseModal();
    if (isTokenCreated) {
      fetchToken().catch(console.error);
    }
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const response = await factory.TokenGenerate(jwtToken, values.token_name);
      setGeneratedToken(response);
      setIsTokenCreated(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      centered
      title="Generate Token"
      visible={isModalVisible}
      maskClosable={false}
      footer={null}
      onCancel={handleClose}
      style={{ textAlign: "start" }}
      width="50%"
    >
      {
        generatedToken && Object.keys(generatedToken).length !== 0 &&
        <div>
          Generated token of <code>{generatedToken.name}</code> is:<br />
          <i><code>{generatedToken.token}</code></i>
          <br />
          <br />
        </div>
      }
      <Form
        name="basic"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Token name"
          name="token_name"
          rules={[{
            required: true,
            message: "Please input your token name!"
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Generate
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

interface ITokenGeneratorModal {
  isModalVisible: boolean;
  jwtToken: string;
  onCloseModal: any;
  factory: CommonTokenFactory;
  fetchToken: any;
}

export default TokenGeneratorModal;
