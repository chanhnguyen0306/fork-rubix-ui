import { Button, Popconfirm } from "antd";
import {
  PlusOutlined,
  RedoOutlined,
  DeleteOutlined,
  ImportOutlined,
  ExportOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

const btn: React.CSSProperties = { margin: "0 6px 10px 0", float: "left" };

export const RbAddButton = (props: any) => {
  const { handleClick, disabled, label } = props;
  return (
    <Button
      className="nube-green white--text"
      onClick={handleClick}
      disabled={disabled}
      style={btn}
    >
      <PlusOutlined /> {label ? label : "Create"}
    </Button>
  );
};

export const RbRefreshButton = (props: any) => {
  const { refreshList, disabled } = props;
  return (
    <Button
      className="nube-primary white--text"
      onClick={refreshList}
      disabled={disabled}
      style={btn}
    >
      <RedoOutlined /> Refresh
    </Button>
  );
};

export const RbDeleteButton = (props: any) => {
  const { bulkDelete, disabled } = props;
  return (
    <Popconfirm title="Delete" onConfirm={bulkDelete}>
      <Button className="danger white--text" disabled={disabled} style={btn}>
        <DeleteOutlined /> Delete
      </Button>
    </Popconfirm>
  );
};

export const RbImportButton = (props: any) => {
  const { showModal, disabled } = props;
  return (
    <Button
      className="nube-primary white--text"
      onClick={showModal}
      disabled={disabled}
      style={btn}
    >
      <ImportOutlined /> Import
    </Button>
  );
};

export const RbExportButton = (props: any) => {
  const { handleExport, disabled } = props;
  return (
    <Button
      className="export-color white--text"
      onClick={handleExport}
      disabled={disabled}
      style={btn}
    >
      <ExportOutlined /> Export
    </Button>
  );
};

export const RbDownloadButton = (props: any) => {
  const { handleClick, disabled } = props;
  return (
    <Button
      className="download-color white--text"
      onClick={handleClick}
      disabled={disabled}
      style={btn}
    >
      <DownloadOutlined /> Download
    </Button>
  );
};

export const RbRestartButton = (props: any) => {
  const { handleClick, disabled, loading } = props;
  return (
    <Button
      className="restart-color white--text"
      onClick={handleClick}
      disabled={disabled}
      loading={loading}
      style={btn}
    >
      <PlayCircleOutlined /> Restart
    </Button>
  );
};
