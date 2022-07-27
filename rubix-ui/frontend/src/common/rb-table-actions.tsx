import { Button, Popconfirm } from "antd";
import { PlusOutlined, RedoOutlined, DeleteOutlined } from "@ant-design/icons";

export const RbAddButton = (props: any) => {
  const { showModal } = props;
  return (
    <Button
      type="primary"
      onClick={showModal}
      style={{ margin: "5px", float: "right" }}
    >
      <PlusOutlined /> Add
    </Button>
  );
};

export const RbRefreshButton = (props: any) => {
  const { refreshList } = props;
  return (
    <Button
      type="primary"
      onClick={refreshList}
      style={{ margin: "5px", float: "right" }}
    >
      <RedoOutlined /> Refresh
    </Button>
  );
};

export const RbDeleteButton = (props: any) => {
  const { bulkDelete } = props;
  return (
    <Popconfirm title="Delete" onConfirm={bulkDelete}>
      <Button type="primary" danger style={{ margin: "5px", float: "right" }}>
        <DeleteOutlined /> Delete
      </Button>
    </Popconfirm>
  );
};
