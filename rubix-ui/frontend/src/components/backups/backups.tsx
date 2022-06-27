import { storage } from "../../../wailsjs/go/models";
import React, { useEffect, useState } from "react";
import { BackupFactory } from "./factory";
import { BackupsTable } from "./views/table";


import {Button} from "antd";
import {RedoOutlined} from "@ant-design/icons";

export const Backups = () => {
  const [backups, setBackups] = useState([] as storage.Backup[]);
  const [isFetching, setIsFetching] = useState(true);
  let factory = new BackupFactory();

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      let res = await factory.GetAll();
        setBackups(res);
    } catch (error) {
      console.log(error);
        setBackups([]);
    } finally {
      setIsFetching(false);
    }
  };

  return (
      <>
        <Button
            type="primary"
            onClick={fetch}
            style={{margin: "5px", float: "right"}}
        >
          <RedoOutlined/> Refresh
        </Button>
        <BackupsTable
            data={backups}
            isFetching={isFetching}
            setIsFetching={setIsFetching}
        />
      </>

  );
};
