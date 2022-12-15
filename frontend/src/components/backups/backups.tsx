import { Typography, Card } from "antd";
import { useState, useEffect } from "react";
import { storage } from "../../../wailsjs/go/models";
import { ImportJsonModal } from "../../common/import-json-modal";
import { RbRefreshButton, RbImportButton } from "../../common/rb-table-actions";
import { openNotificationWithIcon } from "../../utils/utils";
import { BackupFactory } from "./factory";
import { BackupsTable } from "./views/table";

const { Title } = Typography;

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
      <Title level={3} style={{ textAlign: "left" }}>
        Backups
      </Title>
      <Card bordered={false}>
        <RbRefreshButton refreshList={fetch} />
        <RbImportButton showModal={() => setIsModalVisible(true)} />
        <BackupsTable
          data={backups}
          isFetching={isFetching}
          setIsFetching={setIsFetching}
          fetch={fetch}
        />
      </Card>

      <ImportJsonModal
        isModalVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onOk={handleImport}
      />
    </>
  );
};
