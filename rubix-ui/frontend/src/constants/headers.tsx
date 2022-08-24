import { Tag, Image } from "antd";
import { PlayCircleOutlined, BookOutlined } from "@ant-design/icons";
import { pluginLogo } from "../utils/utils";
import imageRC5 from "../assets/images/RC5.png";
import imageRCIO from "../assets/images/RC-IO.png";
import imageEdge28 from "../assets/images/Edge-iO-28.png";

export const FLOW_NETWORKS_HEADERS = [
  {
    key: "uuid",
    title: "uuid",
    dataIndex: "uuid",
  },
  {
    key: "name",
    title: "name",
    dataIndex: "name",
  },
  {
    key: "client_name",
    title: "client name",
    dataIndex: "client_name",
  },
  {
    key: "device_name",
    title: "device name",
    dataIndex: "device_name",
  },
  {
    key: "message",
    title: "message",
    dataIndex: "message",
  },
  {
    key: "connection",
    title: "connection",
    dataIndex: "connection",
  },
];

export const STREAM_HEADERS = [
  {
    key: "uuid",
    title: "uuid",
    dataIndex: "uuid",
  },
  {
    key: "name",
    title: "name",
    dataIndex: "name",
  },
  {
    title: "enable",
    key: "enable",
    dataIndex: "enable",
    render(enable: boolean) {
      let colour = "blue";
      let text = "disabled";
      if (enable) {
        colour = "orange";
        text = "enabled";
      }
      return <Tag color={colour}>{text}</Tag>;
    },
  },
];

export const CONSUMER_HEADERS = [
  {
    key: "uuid",
    title: "uuid",
    dataIndex: "uuid",
  },
  {
    key: "name",
    title: "name",
    dataIndex: "name",
  },
  {
    title: "enable",
    key: "enable",
    dataIndex: "enable",
    render(enable: boolean) {
      let colour = "blue";
      let text = "disabled";
      if (enable) {
        colour = "orange";
        text = "enabled";
      }
      return <Tag color={colour}>{text}</Tag>;
    },
  },
  {
    key: "message",
    title: "message",
    dataIndex: "message",
  },
  {
    key: "producer_thing_class",
    title: "producer thing class",
    dataIndex: "producer_thing_class",
  },
  {
    key: "producer_thing_name",
    title: "producer thing name",
    dataIndex: "producer_thing_name",
  },
];

export const PRODUCER_HEADERS = [
  {
    key: "name",
    title: "name",
    dataIndex: "name",
  },
  {
    key: "producer_application",
    title: "application",
    dataIndex: "producer_application",
  },
  {
    key: "producer_thing_class",
    title: "thing class",
    dataIndex: "producer_thing_class",
  },
  {
    key: "producer_thing_name",
    title: "thing name",
    dataIndex: "producer_thing_name",
  },
  {
    key: "history_type",
    title: "history type",
    dataIndex: "history_type",
    render(plugin_name: string) {
      let colour = "#4d4dff";
      let text = plugin_name.toUpperCase();
      return <Tag color={colour}>{text}</Tag>;
    },
  },
  {
    key: "history_interval",
    title: "history interval",
    dataIndex: "history_interval",
  },
  {
    title: "enable",
    key: "enable",
    dataIndex: "enable",
    render(enabled: boolean) {
      let colour = "blue";
      let text = "disabled";
      if (enabled) {
        colour = "orange";
        text = "enabled";
      }
      return <Tag color={colour}>{text}</Tag>;
    },
  },
  {
    key: "uuid",
    title: "uuid",
    dataIndex: "uuid",
  },
];

export const WRITER_HEADERS = [
  {
    key: "uuid",
    title: "uuid",
    dataIndex: "uuid",
  },
  {
    key: "writer_thing_class",
    title: "writer thing class",
    dataIndex: "writer_thing_class",
  },
  {
    key: "writer_thing_name",
    title: "writer thing name",
    dataIndex: "writer_thing_name",
  },
];

export const CONNECTION_HEADERS = [
  {
    title: "uuid",
    dataIndex: "uuid",
    key: "uuid",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Address",
    dataIndex: "ip",
    key: "ip",
  },
  {
    title: "Port",
    dataIndex: "port",
    key: "port",
  },
  {
    title: "uuid",
    dataIndex: "uuid",
    key: "uuid",
  },
];

export const HOST_NETWORK_HEADERS = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Hosts number",
    dataIndex: "hosts",
    key: "hosts",
    render: (hosts: []) => <a>{hosts ? hosts.length : 0}</a>,
  },

  {
    title: "UUID",
    dataIndex: "uuid",
    key: "uuid",
  },
];

export const HOST_HEADERS = [
  {
    title: "product",
    key: "product_type",
    dataIndex: "product_type",
    render(product: string) {
      let image = imageRC5;
      if (product == "RubixCompute") {
        image = imageRC5;
      }
      if (product == "RubixComputeIO") {
        image = imageRCIO;
      }
      if (product == "Edge28") {
        image = imageEdge28;
      }
      return <Image width={70} src={image} />;
    },
  },
  {
    title: "name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "ip",
    dataIndex: "ip",
    key: "ip",
  },
  {
    title: "description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "uuid",
    dataIndex: "uuid",
    key: "uuid",
  },
];

export const NETWORK_HEADERS = [
  {
    title: "network",
    key: "plugin_name",
    dataIndex: "plugin_name",
    render(name: string) {
      let image = pluginLogo(name);
      return <Image width={70} preview={false} src={image} />;
    },
  },
  {
    title: "network-type",
    key: "plugin_name",
    dataIndex: "plugin_name",
    render(plugin_name: string) {
      let colour = "#4d4dff";
      let text = plugin_name.toUpperCase();
      return <Tag color={colour}>{text}</Tag>;
    },
    sorter: (a: any, b: any) => a.plugin_name.localeCompare(b.plugin_name),
  },
  {
    title: "name",
    dataIndex: "name",
    key: "name",
    sorter: (a: any, b: any) => a.name.localeCompare(b.name),
  },
  {
    title: "uuid",
    dataIndex: "uuid",
    key: "uuid",
  },
];

export const FLOW_DEVICE_HEADERS = [
  {
    title: "name",
    dataIndex: "name",
    key: "name",
    sorter: (a: any, b: any) => a.name.localeCompare(b.name),
  },
  {
    title: "uuid",
    dataIndex: "uuid",
    key: "uuid",
  },
];

export const FLOW_POINT_HEADERS = [
  {
    title: "name",
    dataIndex: "name",
    key: "name",
    render(name: string) {
      if (name != undefined) {
        let colour = "#4d4dff";
        return <Tag color={colour}>{name}</Tag>;
      }
    },
    sorter: (a: any, b: any) => a.name.localeCompare(b.name),
  },
  {
    title: "io number",
    dataIndex: "io_number",
    key: "io_number",
    render(io_number: string) {
      if (io_number != undefined) {
        let colour = "#4d4dff";
        let text = io_number.toUpperCase();
        return <Tag color={colour}>{text}</Tag>;
      }
    },
    sorter: (a: any, b: any) => a.io_number - b.io_number,
  },
  {
    title: "object type",
    dataIndex: "object_type",
    key: "object_type",
    render(object_type: string) {
      if (object_type != undefined) {
        let colour = "#4d4dff";
        let text = object_type.toUpperCase();
        return <Tag color={colour}>{text}</Tag>;
      }
    },
  },
  {
    title: "object id",
    dataIndex: "object_id",
    key: "object_id",
    render(object_id: number) {
      if (object_id != undefined) {
        let colour = "#4d4dff";
        return <Tag color={colour}>{object_id}</Tag>;
      }
    },
  },
  {
    title: "io type",
    dataIndex: "io_type",
    key: "io_type",
    render(io_type: string) {
      if (io_type != undefined) {
        let colour = "#4d4dff";
        let text = io_type.toUpperCase();
        return <Tag color={colour}>{text}</Tag>;
      }
    },
  },
  {
    title: "present value",
    dataIndex: "present_value",
    key: "present_value",
    render(present_value: number) {
      if (present_value != undefined) {
        let colour = "#4d4dff";
        return <Tag color={colour}>{present_value}</Tag>;
      }
    },
    sorter: (a: any, b: any) => a.present_value - b.present_value,
  },
  {
    title: "original value value",
    dataIndex: "original_value",
    key: "original_value",
    sorter: (a: any, b: any) => a.original_value - b.original_value,
  },
  {
    title: "write value",
    dataIndex: "write_value",
    key: "write_value",
    sorter: (a: any, b: any) => a.write_value - b.write_value,
  },
  {
    title: "write value original",
    dataIndex: "write_value_original",
    key: "write_value_original",
    sorter: (a: any, b: any) => a.write_value_original - b.write_value_original,
  },
  {
    title: "device-uuid",
    dataIndex: "device_uuid",
    key: "device_uuid",
  },
  {
    title: "uuid",
    dataIndex: "uuid",
    key: "uuid",
  },
];

export const PLUGIN_HEADERS = [
  {
    title: "name",
    key: "name",
    dataIndex: "name",
    render(name: string) {
      let image = pluginLogo(name);
      return <Image preview={false} width={70} src={image} />;
    },
  },
  {
    title: "name",
    key: "name",
    dataIndex: "name",
    render(plugin_name: string) {
      let colour = "#4d4dff";
      let text = plugin_name.toUpperCase();
      return <Tag color={colour}>{text}</Tag>;
    },
    sorter: (a: any, b: any) => a.name.localeCompare(b.name),
  },
  {
    title: "Tags",
    key: "has_network",
    dataIndex: "has_network",
    render(has_network: boolean) {
      let colour = "blue";
      let text = "non network plugin";
      if (has_network) {
        colour = "orange";
        text = "network driver";
      }
      return <Tag color={colour}>{text}</Tag>;
    },
    sorter: (a: any, b: any) => a.has_network - b.has_network,
  },
  {
    title: "status",
    key: "enabled",
    dataIndex: "enabled",
    render(enabled: boolean) {
      let colour = "blue";
      let text = "disabled";
      if (enabled) {
        colour = "orange";
        text = "enabled";
      }
      return <Tag color={colour}>{text}</Tag>;
    },
    sorter: (a: any, b: any) => a.enabled - b.enabled,
  },
  {
    title: "uuid",
    dataIndex: "uuid",
    key: "uuid",
  },
];

export const BACNET_HEADERS = [
  {
    title: "name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "device id",
    dataIndex: "device_object_id",
    key: "device_object_id",
  },
  {
    title: "ip",
    dataIndex: "host",
    key: "host",
  },
  {
    title: "port",
    dataIndex: "port",
    key: "port",
  },
];

export const LOG_HEADERS = [
  [
    {
      title: "uuid",
      dataIndex: "uuid",
      key: "uuid",
    },
    {
      title: "Timestamp",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Table",
      dataIndex: "function",
      key: "function",
    },
    {
      title: "Action Type",
      dataIndex: "type",
      key: "type",
    },
  ],
];

export const BACKUP_HEADERS = [
  {
    title: "uuid",
    dataIndex: "uuid",
    key: "uuid",
  },
  {
    title: "connection name",
    dataIndex: "connection_name",
    key: "connection_name",
  },
  {
    title: "connection uuid",
    dataIndex: "connection_uuid",
    key: "connection_uuid",
  },
  {
    title: "host name",
    dataIndex: "host_name",
    key: "host_name",
  },
  {
    title: "host uuid",
    dataIndex: "host_uuid",
    key: "host_uuid",
  },
  {
    title: "timestamp",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "application",
    dataIndex: "application",
    key: "application",
  },
  {
    title: "info",
    dataIndex: "backup_info",
    key: "backup_info",
  },
  {
    title: "Comments",
    dataIndex: "user_comment",
    key: "user_comment",
  },
];

export const SCANNER_HEADERS = [
  {
    title: "Ip",
    dataIndex: "ip",
    key: "ip",
  },
  {
    title: "Port",
    dataIndex: "ports",
    render: (services: any[]) =>
      services.map((service, index) => (
        <p key={index}> {`${service.service}: ${service.port}`} </p>
      )),
    key: "ports",
  },
];

//--------------schema-------------//
export const FLOW_NETWORKS_SCHEMA = {
  name: {
    maxLength: 50,
    minLength: 2,
    title: "name",
    type: "string",
  },
  flow_ip: {
    type: "string",
    title: "flow ip",
    default: "0.0.0.0",
  },
  flow_port: {
    type: "number",
    title: "flow port",
    minLength: 2,
    maxLength: 65535,
    default: 1662,
    help: "ip port, eg port 1660 192.168.15.10:1660",
    readOnly: false,
  },
  flow_https: {
    type: "boolean",
    title: "enable https",
    readOnly: false,
  },
  flow_username: {
    maxLength: 50,
    minLength: 2,
    title: "flow username",
    type: "string",
  },
  flow_password: {
    maxLength: 50,
    minLength: 2,
    title: "flow password",
    type: "string",
  },
  uuid: {
    readOnly: true,
    title: "uuid",
    type: "string",
  },
};
