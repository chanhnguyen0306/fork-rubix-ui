import { Card, Input } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import { JsonTable } from "react-json-to-html";
import { useParams } from "react-router-dom";
import { FlowFactory } from "../rubix-flow/factory";
import "./user-guide.css";

const NodeHelpTable = (props: any) => {
  const { item } = props;
  const data = JSON.parse(JSON.stringify(item)); //cloneDeep
  delete data.name;
  if (data.settings) {
    delete data.settings.schema;
    delete data.settings.uiSchema;
  }

  return (
    <div id={`table__${item.name}`} className="help-list_item__table">
      <JsonTable json={data} />
      {item.settings && (
        <div>
          <div className="settings-tr">
            <div id={`settings-label__${item.name}`}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;schema
            </div>
            <div className="settings-value">
              <pre>{JSON.stringify(item.settings.schema, null, 2)}</pre>
            </div>
          </div>
          <div className="settings-divider-tr" />
          <div className="settings-tr">
            <div id={`settings-label__${item.name}`}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;uiSchema
            </div>
            <div className="settings-value">
              <pre>{JSON.stringify(item.settings.uiSchema, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const UserGuide = () => {
  const [nodeHelps, setNodeHelps] = useState<any>();
  const [filterHelps, setFilterHelps] = useState<any>();
  const [search, setSearch] = useState("");
  const { connUUID = "", hostUUID = "" } = useParams();
  const isRemote = connUUID && hostUUID ? true : false;

  const factory = new FlowFactory();

  const fetchNodeHelp = async () => {
    const res = (await factory.NodesHelp(connUUID, hostUUID, isRemote)) || {};
    setNodeHelps(res);
    setFilterHelps(res);
  };

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  useEffect(() => {
    const keyword = search.toLowerCase().trim();
    const newHelps =
      keyword.length > 0
        ? nodeHelps.filter((item: any) =>
            item.name.toLowerCase().includes(keyword)
          )
        : nodeHelps;
    setFilterHelps(newHelps);
  }, [search]);

  useEffect(() => {
    fetchNodeHelp();
  }, []);

  return (
    <>
      <Card bordered={false} className="help-list">
        <Input
          placeholder="Search name..."
          allowClear
          value={search}
          onChange={handleChangeSearch}
          size="large"
        />

        {filterHelps &&
          filterHelps.map((item: any, i: number) => (
            <div key={i} className="help-list_item">
              <div className="help-list_item__title">{item.name}</div>
              <NodeHelpTable item={item} />
            </div>
          ))}
      </Card>
    </>
  );
};

export default UserGuide;
