import { backend, model } from "../../../../../../../wailsjs/go/models";
import {
  DeleteWriterCloneBulk,
  GetWriterClones,
} from "../../../../../../../wailsjs/go/backend/App";

import WriterClone = model.WriterClone;

export class WriterClonesFactory {
  hostUUID!: string;
  connectionUUID!: string;

  async GetAll(): Promise<Array<WriterClone>> {
    return await GetWriterClones(this.connectionUUID, this.hostUUID);
  }

  async BulkDelete(uuids: Array<backend.UUIDs>): Promise<WriterClone> {
    return await DeleteWriterCloneBulk(
      this.connectionUUID,
      this.hostUUID,
      uuids
    );
  }
}
