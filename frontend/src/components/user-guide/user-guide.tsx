import { Card, Input } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import { JsonTable } from "react-json-to-html";
import { useParams } from "react-router-dom";
import { FlowFactory } from "../rubix-flow/factory";
import "./user-guide.css";

const NodeHelpTable = (props: any) => {
  const { item } = props;
  const data = { ...item }; //cloneDeep
  delete data.name;
  return (
    <div className="help-list_item__table">
      <JsonTable json={data} />
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
    console.log(res);
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
          style={{ maxWidth: 800 }}
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
