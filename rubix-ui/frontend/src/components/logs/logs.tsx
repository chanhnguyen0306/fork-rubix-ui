import {storage} from "../../../wailsjs/go/models";
import { useEffect, useState } from "react";
import VieLogs = storage.RubixConnection;
import {LogFactory} from "./factory";
import {LogsTable} from "./views/table";



export const Logs = () => {
    const [connections, setConnections] = useState([] as any[]);
    const [connectionSchema, setConnectionSchema] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    let factory = new LogFactory()

    useEffect(() => {
        fetch();
    }, [connections]);

    const fetch = async () => {
        try {
            let res = await factory.GetAll();
            res = !res ? [] : res;
            setConnections(res);
        } catch (error) {
        } finally {
            setIsFetching(false);
        }
    };


    return (
        <>
            <h1>User Logs</h1>
            <LogsTable
                connections={connections}
                isFetching={isFetching}
                setIsFetching={setIsFetching}
            />
        </>
    );
};

