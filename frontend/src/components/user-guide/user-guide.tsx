import { ChangeEvent, useEffect, useState } from "react";
import { JsonTable } from "react-json-to-html";
import { useParams } from "react-router-dom";
import { FlowFactory } from "../rubix-flow/factory";

export const UserGuide = () => {
  const [json, setJson] = useState<object>({});
  const [nodeHelps, setNodeHelps] = useState<any>();
  const { connUUID = "", hostUUID = "" } = useParams();
  const isRemote = connUUID && hostUUID ? true : false;

  const factory = new FlowFactory();

  const fetchNodeHelp = async () => {
    const res = (await factory.NodesHelp(connUUID, hostUUID, isRemote)) || {};
    setNodeHelps(res);
  };

  const handleChangeNodeHelp = (value: ChangeEvent<HTMLSelectElement>) => {
    const _nodeHelp = nodeHelps.find(
      (item: any) => item.name === value.target.value
    );
    setJson(_nodeHelp);
  };

  useEffect(() => {
    fetchNodeHelp();
  }, []);

  return (
    <>
      <div className="z-[1] text-black">
        <select
          className="flex p-2 mb-3 rounded"
          defaultValue=""
          onChange={handleChangeNodeHelp}
        >
          <option value="">--</option>
          {nodeHelps &&
            nodeHelps.map((item: any, i: number) => {
              return (
                <option key={i} value={item.name}>
                  {item.name}
                </option>
              );
            })}
        </select>
        <JsonTable json={json} />
      </div>
    </>
  );
};

export default UserGuide;
