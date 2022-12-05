import { useEffect, useState } from "react";
import { storage } from "../../../wailsjs/go/models";
import { openNotificationWithIcon } from "../../utils/utils";
import { BackupFactory } from "./factory";
import { BackupsTable } from "./views/table";
import { RbImportButton, RbRefreshButton } from "../../common/rb-table-actions";
import { ImportJsonModal } from "../../common/import-json-modal";

export const Backups = () => {
  const [backups, setBackups] = useState([] as storage.Backup[]);
  const [isFetching, setIsFetching] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const factory = new BackupFactory();

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      const res = await factory.GetAll();
      setBackups(res);
    } catch (error) {
      console.log(error);
      setBackups([]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleImport = async (body: any) => {
    try {
      const backup = JSON.parse(body);
      await factory.Import(backup);
      fetch();
      setIsModalVisible(false);
    } catch (error) {
      console.log(error);
      openNotificationWithIcon("error", "Invalid JSON");
    }
  };

  return (
    <>
      <RbRefreshButton refreshList={fetch} />
      <RbImportButton showModal={() => setIsModalVisible(true)} />
      <BackupsTable
        data={backups}
        isFetching={isFetching}
        setIsFetching={setIsFetching}
        fetch={fetch}
      />
      <ImportJsonModal
        isModalVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onOk={handleImport}
      />
    </>
  );
};
