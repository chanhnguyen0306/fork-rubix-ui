import {main, model} from "../../../../../../../wailsjs/go/models";
import {
   DeleteWriterCloneBulk,
   GetWriterClones,

} from "../../../../../../../wailsjs/go/main/App";

export class WritersClonesFactory {
  hostUUID!: string;
  connectionUUID!: string;

  async GetAll(): Promise<Array<model.Writer>> {
    return await GetWriterClones(this.connectionUUID, this.hostUUID);
  }

  async BulkDelete(uuids: Array<main.UUIDs>): Promise<model.Writer> {
    return await DeleteWriterCloneBulk(this.connectionUUID, this.hostUUID, uuids);
  }

}
