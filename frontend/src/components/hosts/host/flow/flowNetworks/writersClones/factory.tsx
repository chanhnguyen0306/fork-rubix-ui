import {backend, model} from "../../../../../../../wailsjs/go/models";
import {
   DeleteWriterCloneBulk,
   GetWriterClones,

} from "../../../../../../../wailsjs/go/backend/App";

export class WritersClonesFactory {
  hostUUID!: string;
  connectionUUID!: string;

  async GetAll(): Promise<Array<model.Writer>> {
    return await GetWriterClones(this.connectionUUID, this.hostUUID);
  }

  async BulkDelete(uuids: Array<backend.UUIDs>): Promise<model.Writer> {
    return await DeleteWriterCloneBulk(this.connectionUUID, this.hostUUID, uuids);
  }

}
