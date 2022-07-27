import { Button, Popconfirm } from "antd";
import { PlusOutlined, RedoOutlined, DeleteOutlined } from "@ant-design/icons";

const btn: React.CSSProperties = { margin: "5px", float: "right" };

export const RbAddButton = (props: any) => {
  const { showModal } = props;
  return (
    <Button type="primary" onClick={showModal} style={btn}>
      <PlusOutlined /> Add
    </Button>
  );
};

export const RbRefreshButton = (props: any) => {
  const { refreshList } = props;
  return (
    <Button type="primary" onClick={refreshList} style={btn}>
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
    <Button type="primary" onClick={showModal} style={btn}>
      <RedoOutlined /> Import
    </Button>
  );
};

export const RbExportButton = (props: any) => {
  const { showModal } = props;
  return (
    <Button type="primary" onClick={showModal} style={btn}>
      <RedoOutlined /> Export
    </Button>
  );
};
