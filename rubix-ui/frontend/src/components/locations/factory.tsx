import {
  AddLocation,
  DeleteLocationBulk,
  GetLocation,
  GetLocations,
  GetLocationSchema,
  GetLocationTableSchema,
  UpdateLocation,
} from "../../../wailsjs/go/main/App";
import { Helpers } from "../../helpers/checks";
import { assistmodel, main } from "../../../wailsjs/go/models";

function hasUUID(uuid: string): Error {
  return Helpers.IsUndefined(uuid, "Location or connection uuid") as Error;
}

export class LocationFactory {
  uuid!: string;
  connectionUUID!: string;
  private _this!: assistmodel.Location;
  private count!: number;
  private _all!: Array<assistmodel.Location>;

  get all(): Array<assistmodel.Location> {
    return this._all;
  }

  set all(value: Array<assistmodel.Location>) {
    this._all = value;
  }

  get this(): assistmodel.Location {
    return this._this;
  }

  set this(value: assistmodel.Location) {
    this._this = value;
  }

  public GetTotalCount(): number {
    return this.count;
  }

  async Schema(): Promise<any> {
    let all: Promise<any> = {} as Promise<any>;
    await GetLocationSchema(this.connectionUUID)
      .then((res) => {
        all = res as Promise<any>;
      })
      .catch((err) => {
        return undefined;
      });
    return all;
  }

  async TableSchema(): Promise<any> {
    let all: Promise<any> = {} as Promise<any>;
    await GetLocationTableSchema(this.connectionUUID)
      .then((res) => {
        all = res as Promise<any>;
      })
      .catch((err) => {
        return undefined;
      });
    return all;
  }

  // get the first connection uuid
  async GetFist(): Promise<assistmodel.Location> {
    let one: assistmodel.Location = {} as assistmodel.Location;
    await this.GetAll()
      .then((res) => {
        one = res.at(0) as assistmodel.Location;
        this._this = one;
      })
      .catch((err) => {
        return undefined;
      });
    return one;
  }

  async GetAll(): Promise<Array<assistmodel.Location>> {
    let all: Array<assistmodel.Location> = {} as Array<assistmodel.Location>;
    await GetLocations(this.connectionUUID)
      .then((res) => {
        all = res as Array<assistmodel.Location>;
        this.all = all;
      })
      .catch((err) => {
        return undefined;
      });
    return all;
  }

  async GetOne(): Promise<assistmodel.Location> {
    hasUUID(this.uuid);
    let one: assistmodel.Location = {} as assistmodel.Location;
    await GetLocation(this.connectionUUID, this.uuid)
      .then((res) => {
        one = res as assistmodel.Location;
        this._this = one;
      })
      .catch((err) => {
        return undefined;
      });
    return one;
  }

  async Add(): Promise<assistmodel.Location> {
    hasUUID(this.uuid);
    let one: assistmodel.Location = {} as assistmodel.Location;
    await AddLocation(this.connectionUUID, this._this)
      .then((res) => {
        one = res as assistmodel.Location;
        this._this = one;
      })
      .catch((err) => {
        return undefined;
      });
    return one;
  }

  async Update(): Promise<assistmodel.Location> {
    hasUUID(this.uuid);
    let one: assistmodel.Location = {} as assistmodel.Location;
    await UpdateLocation(this.connectionUUID, this.uuid, this._this)
      .then((res) => {
        one = res as assistmodel.Location;
        this._this = one;
      })
      .catch((err) => {
        return undefined;
      });
    return one;
  }

  async BulkDelete(uuids: Array<main.UUIDs>): Promise<any> {
    hasUUID(this.connectionUUID);
    let out: Promise<any> = {} as Promise<any>;
    await DeleteLocationBulk(this.connectionUUID, uuids)
      .then((res) => {
        out = res as Promise<any>;
      })
      .catch((err) => {
        return undefined;
      });
    return out;
  }
}
