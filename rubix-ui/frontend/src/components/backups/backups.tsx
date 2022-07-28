import { useEffect, useState } from "react";
import { storage } from "../../../wailsjs/go/models";
import { BackupFactory } from "./factory";
import { BackupsTable } from "./views/table";
import {
  RbExportButton,
  RbImportButton,
  RbRefreshButton,
} from "../../common/rb-table-actions";

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
      <RbRefreshButton refreshList={fetch} />
      <RbExportButton showModal={fetch} />
      <RbImportButton showModal={fetch} />
      <BackupsTable
        data={backups}
        isFetching={isFetching}
        setIsFetching={setIsFetching}
        fetch={fetch}
      />
    </>
  );
};
