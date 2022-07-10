import {Button, Input, Menu, MenuProps, Select} from "antd";
import {useState} from "react";
import {BackupFactory} from "../../backups/factory";
import {OpenURL} from "../../../../wailsjs/go/main/App";
import {openNotificationWithIcon} from "../../../utils/utils";
import {assistmodel, storage} from "../../../../wailsjs/go/models";
import Host = assistmodel.Host;

type MenuItem = Required<MenuProps>["items"][number];

export const SidePanel = (props: any) => {
    const {collapsed, selectedHost, connUUID, sidePanelHeight, fetchBackups} = props;
    const [isSaveBackup, setIsSaveBackup] = useState(false);
    const [isRestoreBackup, setIsRestoreBackup] = useState(false);
    const [comment, setComment] = useState<any>();
    const [backup, setBackup] = useState();
    let backupFactory = new BackupFactory();

    const getItem = (label: React.ReactNode, key: React.Key): MenuItem => {
        return {
            key,
            label,
        } as MenuItem;
    };

    const navigateToNewTab = (host: Host) => {
        try {
            const {ip} = host;
            let source = `http://${ip}:1313/`;
            if (host.https) {
                source = `https://${ip}:1313/`;
            }
            OpenURL(source);
        } catch (err: any) {
            openNotificationWithIcon("error", err.message);
        }
    };

    const saveBackupHandle = async (host: Host) => {
        setIsSaveBackup(true);
        try {
            backupFactory.connectionUUID = connUUID;
            backupFactory.hostUUID = host.uuid;
            if (comment.length < 2) {
                openNotificationWithIcon("error", "please enter a comment");
                return
            }
            await backupFactory.WiresBackup(comment as unknown as string);
            openNotificationWithIcon("success", `saved backup: ${host.name}`);
        } catch (err: any) {
            openNotificationWithIcon("error", err.message);
        } finally {
            setIsSaveBackup(false);
        }
    };

    const restoreBackupHandle = async (host: Host) => {
        setIsRestoreBackup(true);
        try {
            backupFactory.connectionUUID = connUUID;
            backupFactory.hostUUID = host.uuid;
            backupFactory.uuid = backup as unknown as string;
            await backupFactory.WiresRestore();
            openNotificationWithIcon("success", `uploaded backup: ${host.name}`);
        } catch (err: any) {
            openNotificationWithIcon("error", err.message);
        } finally {
            setIsRestoreBackup(false);
        }
    };
    const {Option} = Select;

    const onChange = (value: any) => {
        setBackup(value)
    };

    const onChangeComment = (value:any) => {
        setComment(value.target.value)
    };

    const items: MenuItem[] = [
        getItem(
            <Button type="primary" onClick={() => navigateToNewTab(selectedHost)}>
                open Rubix-Wires
            </Button>,
            "1"
        ),
        getItem(
            <Input.Group compact>
                <Button
                    type="primary"
                    onClick={() => saveBackupHandle(selectedHost)}
                    loading={isSaveBackup}
                >
                    save backup
                </Button>,
                <Input
                    style={{width: "250px", margin: "5px", float: "right"}}
                    placeholder="enter a comment" maxLength={150}
                    onChange={onChangeComment}
                    value={comment}
                />

            </Input.Group>,
            "2"
        ),
        getItem(
            <>
                <Select
                    showSearch
                    placeholder="select a backup"
                    style={{width: "250px", margin: "5px", float: "right"}}
                    optionFilterProp="children"
                    onChange={onChange}
                    filterOption={(input, option) =>
                        (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {fetchBackups.map((data: storage.Backup) => <Option key={data.uuid} value={data.uuid}>{data.user_comment}</Option>)}
                </Select>
                <Button
                    type="primary"
                    onClick={() => restoreBackupHandle(selectedHost)}
                    loading={isRestoreBackup}
                >
                    restore backup
                </Button>,
            </>,

            "3"
        ),
    ];

    return (
        <Menu
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            inlineCollapsed={collapsed}
            items={items}
            style={{ height: sidePanelHeight + "px", width: "600px",  margin: "1px" }}
        />
    );
};