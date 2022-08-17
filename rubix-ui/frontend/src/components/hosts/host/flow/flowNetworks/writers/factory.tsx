import {main, model} from "../../../../../../../wailsjs/go/models";
import {
  CreateWriter, DeleteWritersBulk,
  EditWriter,
  GetWriters
} from "../../../../../../../wailsjs/go/main/App";

export class WritersFactory {
  hostUUID!: string;
  connectionUUID!: string;

  async GetAll(): Promise<Array<model.Writer>> {
    return await GetWriters(this.connectionUUID, this.hostUUID);
  }

  async Add(body:model.Writer): Promise<model.Writer> {
    return await CreateWriter(this.connectionUUID, this.hostUUID, body);
  }

  async Edit(uuid: string, body:model.Writer): Promise<model.Writer> {
    return await EditWriter(this.connectionUUID, this.hostUUID, uuid, body, false);
  }

  async BulkDelete(uuids: Array<main.UUIDs>): Promise<model.Writer> {
    return await DeleteWritersBulk(this.connectionUUID, this.hostUUID, uuids);
  }



}
