import { List, Popconfirm } from 'antd';
import React, { useState } from 'react';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  RedoOutlined
} from "@ant-design/icons";
import { EdgeBiosTokenFactory } from "../../edgebios/token/factory";
import { externaltoken } from "../../../../wailsjs/go/models";


export const TokenView = (props: ITokenView) => {
  const { jwtToken, tokens = [], factory, fetchToken } = props;

  const [regeneratedToken, setRegeneratedToken] = useState("")
  const [selectedToken, setSelectedToken] = useState({} as externaltoken.ExternalToken)

  const toggleTokenBlockState = async (token: externaltoken.ExternalToken) => {
    setSelectedToken(token)
    await factory.EdgeBiosTokenBlock(jwtToken, token.uuid, !token.blocked)
    fetchToken().catch(console.error);
  }

  const regenerateToken = async (token: externaltoken.ExternalToken) => {
    setSelectedToken(token)
    const externalToken = await factory.EdgeBiosTokenRegenerate(jwtToken, token.uuid)
    setRegeneratedToken(externalToken.token)
    fetchToken().catch(console.error);
  }

  const deleteToken = async (token: externaltoken.ExternalToken) => {
    setSelectedToken(token)
    await factory.EdgeBiosTokenDelete(jwtToken, token.uuid)
    fetchToken().catch(console.error);
  }

  return (
    <>
      {regeneratedToken &&
        <div>
          Regenerated token of {selectedToken.name} is:<br />
          <i>{regeneratedToken}</i>
        </div>
      }
      {tokens.length > 0 && <List
        itemLayout="horizontal"
        dataSource={tokens}
        renderItem={item => (
          <List.Item
            actions={[
              <Popconfirm
                title={`Are you sure to ${item.blocked ? "un" : ""}block this token?`}
                onConfirm={() => toggleTokenBlockState(item)}>
                <a key="list-block">
                  {item.blocked ? <CloseOutlined /> : <CheckOutlined />}
                </a>
              </Popconfirm>,
              <Popconfirm
                title="Are you sure to regenerate/old will get removed out?"
                onConfirm={() => regenerateToken(item)}>
                <a key="list-regenerate">
                  <RedoOutlined />
                </a>
              </Popconfirm>,
              <Popconfirm
                title="Are you sure to delete?"
                onConfirm={() => deleteToken(item)}>
                <a key="list-delete">
                  <DeleteOutlined style={{ color: "red" }} />
                </a>
              </Popconfirm>
            ]}
          >
            <List.Item.Meta
              title={item.name}
              description={item.token}
            />
          </List.Item>
        )}
      />
      }
    </>
  );
};

interface ITokenView {
  jwtToken: string;
  tokens: externaltoken.ExternalToken[];
  factory: EdgeBiosTokenFactory;
  fetchToken: any;
}

export default TokenView;
