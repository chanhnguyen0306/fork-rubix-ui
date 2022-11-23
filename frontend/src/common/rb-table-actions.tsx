import { Button, Popconfirm } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  DeleteOutlined,
  ImportOutlined,
  ExportOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

const btn: React.CSSProperties = {
  margin: "0 6px 10px 0",
  float: "left",
  display: "inline-flex",
};

export const RbAddButton = (props: any) => {
  const { handleClick, disabled, text } = props;
  return (
    <Button
      className="rb-btn nube-green white--text"
      onClick={handleClick}
      disabled={disabled}
      icon={<PlusOutlined />}
      style={btn}
    >
      {text ?? "Create"}
    </Button>
  );
};

export const RbRefreshButton = (props: any) => {
  const { refreshList, disabled, style = {}, text } = props;
  return (
    <Button
      className="rb-btn nube-primary white--text"
      onClick={refreshList}
      disabled={disabled}
      icon={<ReloadOutlined />}
      style={{ ...btn, ...style }}
    >
      {text ?? "Refresh"}
    </Button>
  );
};

export const RbDeleteButton = (props: any) => {
  const { bulkDelete, disabled, text } = props;
  return (
    <Popconfirm title="Delete" onConfirm={bulkDelete}>
      <Button
        className="danger white--text"
        disabled={disabled}
        icon={<DeleteOutlined />}
        style={btn}
      >
        {text ?? "Delete"}
      </Button>
    </Popconfirm>
  );
};

export const RbImportButton = (props: any) => {
  const { showModal, disabled, text } = props;
  return (
    <Button
      className="rb-btn nube-primary white--text"
      onClick={showModal}
      disabled={disabled}
      icon={<ImportOutlined />}
      style={btn}
    >
      {text ?? "Import"}
    </Button>
  );
};

export const RbExportButton = (props: any) => {
  const { handleExport, disabled, text } = props;
  return (
    <Button
      className="rb-btn export-color white--text"
      onClick={handleExport}
      disabled={disabled}
      icon={<ExportOutlined />}
      style={btn}
    >
      {text ?? "Export"}
    </Button>
  );
};

export const RbDownloadButton = (props: any) => {
  const { handleClick, disabled, text } = props;
  return (
    <Button
      className="rb-btn download-color white--text"
      onClick={handleClick}
      disabled={disabled}
      icon={<DownloadOutlined />}
      style={btn}
    >
      {text ?? "Download"}
    </Button>
  );
};

export const RbRestartButton = (props: any) => {
  const { handleClick, disabled, loading, text } = props;
  return (
    <Button
      className="rb-btn restart-color white--text"
      onClick={handleClick}
      disabled={disabled}
      loading={loading}
      icon={<PlayCircleOutlined />}
      style={btn}
    >
      {text ?? "Restart"}
    </Button>
  );
};

export const RbButton = (props: any) => {
  const {
    onClick,
    type,
    icon,
    text,
    disabled = false,
    loading = false,
    style = {},
  } = props;
  console.log(style);

  return (
    <Button
      {...props}
      type={type}
      onClick={onClick}
      icon={icon}
      disabled={disabled}
      loading={loading}
      className="rb-btn"
      style={{ ...btn, ...style }}
    >
      {text}
    </Button>
  );
};
