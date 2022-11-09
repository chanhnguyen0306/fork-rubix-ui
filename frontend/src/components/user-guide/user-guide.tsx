import { ChangeEvent, useEffect, useState } from "react";
import { JsonTable } from "react-json-to-html";
import { useParams } from "react-router-dom";
import { FlowFactory } from "../rubix-flow/factory";

export const UserGuide = () => {
  const [nodeHelps, setNodeHelps] = useState<any>();
  const [filterHelps, setFilterHelps] = useState<any>();
  const [search, setSearch] = useState("");
  const { connUUID = "", hostUUID = "" } = useParams();
  const isRemote = connUUID && hostUUID ? true : false;

  const factory = new FlowFactory();

  const fetchNodeHelp = async () => {
    const res = (await factory.NodesHelp(connUUID, hostUUID, isRemote)) || {};
    console.log(res);

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
      <div className="grid place-items-center">
        <input
          className="bg-gray-600 disabled:bg-gray-700 py-1 px-2 rounded"
          value={search}
          onChange={handleChangeSearch}
          placeholder="Search name..."
        />
        {filterHelps &&
          filterHelps.map((item: any, i: number) => (
            <div key={i} className="text-black mb-5 pb-2">
              <h1 className="my-5">{item.name}</h1>
              <div className="text-left">
                <JsonTable json={item} />
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default UserGuide;
