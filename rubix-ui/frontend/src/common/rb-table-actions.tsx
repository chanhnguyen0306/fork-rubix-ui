import { Button, Popconfirm } from "antd";
import {
  PlusOutlined,
  RedoOutlined,
  DeleteOutlined,
  ImportOutlined,
  ExportOutlined,
} from "@ant-design/icons";

const btn: React.CSSProperties = { margin: "5px", float: "right" };

export const RbAddButton = (props: any) => {
  const { showModal } = props;
  return (
    <Button className="nube-green white--text" onClick={showModal} style={btn}>
      <PlusOutlined /> Create
    </Button>
  );
};

export const RbRefreshButton = (props: any) => {
  const { refreshList } = props;
  return (
    <Button
      className="nube-primary white--text"
      onClick={refreshList}
      style={btn}
    >
      <RedoOutlined /> Refresh
    </Button>
  );
};

export const RbDeleteButton = (props: any) => {
  const { bulkDelete } = props;
  return (
    <Popconfirm title="Delete" onConfirm={bulkDelete}>
      <Button className="danger white--text" style={btn}>
        <DeleteOutlined /> Delete
      </Button>
    </Popconfirm>
  );
};

export const RbImportButton = (props: any) => {
  const { showModal } = props;
  return (
    <Button
      className="nube-primary white--text"
      onClick={showModal}
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
      style={btn}
      disabled={disabled}
    >
      <ExportOutlined /> Export
    </Button>
  );
};
