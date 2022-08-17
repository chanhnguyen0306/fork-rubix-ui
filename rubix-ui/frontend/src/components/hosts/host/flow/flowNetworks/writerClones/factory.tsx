import { main, model } from "../../../../../../../wailsjs/go/models";
import {
  DeleteWriterCloneBulk,
  GetWriterClones,
} from "../../../../../../../wailsjs/go/main/App";

import WriterClone = model.WriterClone;

export class WriterClonesFactory {
  hostUUID!: string;
  connectionUUID!: string;

  async GetAll(): Promise<Array<WriterClone>> {
    return await GetWriterClones(this.connectionUUID, this.hostUUID);
  }

  async BulkDelete(uuids: Array<main.UUIDs>): Promise<WriterClone> {
    return await DeleteWriterCloneBulk(
      this.connectionUUID,
      this.hostUUID,
      uuids
    );
  }
}
