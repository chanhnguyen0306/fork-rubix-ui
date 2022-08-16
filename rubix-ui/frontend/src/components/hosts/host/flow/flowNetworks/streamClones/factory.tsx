import { main, model } from "../../../../../../../wailsjs/go/models";
import {
  GetStreamClones,
  DeleteStreamBulkClones,
} from "../../../../../../../wailsjs/go/main/App";
import { Helpers } from "../../../../../../helpers/checks";

import StreamClone = model.StreamClone;
import UUIDs = main.UUIDs;

function hasUUID(uuid: string): Error {
  return Helpers.IsUndefined(uuid, "host or connection uuid") as Error;
}

export class FlowStreamCloneFactory {
  hostUUID!: string;
  connectionUUID!: string;

  async GetAll(): Promise<Array<StreamClone>> {
    let resp: Promise<Array<StreamClone>> = {} as Promise<Array<StreamClone>>;
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    await GetStreamClones(this.connectionUUID, this.hostUUID)
      .then((res) => {
        resp = res as unknown as Promise<Array<StreamClone>>;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }

  async BulkDelete(uuids: Array<UUIDs>): Promise<any> {
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    let resp: Promise<any> = {} as Promise<any>;
    await DeleteStreamBulkClones(this.connectionUUID, this.hostUUID, uuids)
      .then((res) => {
        resp = res as Promise<any>;
      })
      .catch((err) => {
        return resp;
      });
    return resp;
  }
}
