import { Button, Form, Modal, Space, Spin, Table } from "antd";
import { model } from "../../../../../../../wailsjs/go/models";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { RedoOutlined } from "@ant-design/icons";

export const FlowNetworkTable = (props: any) => {
  const { data, isFetching, connUUID, hostUUID, showModal } = props;
  if (!data) return <></>;
  const navigate = useNavigate();
  const columns = [
    {
      title: "uuid",
      dataIndex: "uuid",
      key: "uuid",
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "network-type",
      dataIndex: "plugin_name",
      key: "plugin_name",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, network: model.Network) => (
        <Space size="middle">
          <a
            onClick={() =>
              navigate(`/flow/networks/${network.uuid}`, {
                // opens devices
                state: {
                  connUUID: connUUID,
                  hostUUID: hostUUID,
                  networkUUID: network.uuid,
                },
              })
            }
          >
            View
          </a>
          <a // edit
            onClick={() => {
              showModal(network);
            }}
          >
            Edit
          </a>
          <a
            onClick={() => {
              // deleteNetwork(network.uuid);
            }}
          >
            Delete
          </a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        rowKey="uuid"
        dataSource={data}
        columns={columns}
        loading={{ indicator: <Spin />, spinning: isFetching }}
      />
    </>
  );
};
