import {
  AddLocation,
  GetLocation,
  GetLocations,
  GetLocationSchema,
  GetLocationTableSchema,
  UpdateLocation,
} from "../../../wailsjs/go/main/App";
import { model } from "../../../wailsjs/go/models";
import { Helpers } from "../../helpers/checks";

function hasUUID(uuid: string): Error {
  return Helpers.IsUndefined(uuid, "Location or connection uuid") as Error;
}

export class LocationFactory {
  uuid!: string;
  connectionUUID!: string;
  private _this!: model.Location;
  private count!: number;
  private _all!: Array<model.Location>;

  get all(): Array<model.Location> {
    return this._all;
  }

  set all(value: Array<model.Location>) {
    this._all = value;
  }

  get this(): model.Location {
    return this._this;
  }

  set this(value: model.Location) {
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
  async GetFist(): Promise<model.Location> {
    let one: model.Location = {} as model.Location;
    await this.GetAll()
      .then((res) => {
        one = res.at(0) as model.Location;
        this._this = one;
      })
      .catch((err) => {
        return undefined;
      });
    return one;
  }

  async GetAll(): Promise<Array<model.Location>> {
    let all: Array<model.Location> = {} as Array<model.Location>;
    await GetLocations(this.connectionUUID)
      .then((res) => {
        all = res as Array<model.Location>;
        this.all = all;
      })
      .catch((err) => {
        return undefined;
      });
    return all;
  }

  async GetOne(): Promise<model.Location> {
    hasUUID(this.uuid);
    let one: model.Location = {} as model.Location;
    await GetLocation(this.connectionUUID, this.uuid)
      .then((res) => {
        one = res as model.Location;
        this._this = one;
      })
      .catch((err) => {
        return undefined;
      });
    return one;
  }

  async Add(): Promise<model.Location> {
    hasUUID(this.uuid);
    let one: model.Location = {} as model.Location;
    await AddLocation(this.connectionUUID, this._this)
      .then((res) => {
        one = res as model.Location;
        this._this = one;
      })
      .catch((err) => {
        return undefined;
      });
    return one;
  }

  async Update(): Promise<model.Location> {
    hasUUID(this.uuid);
    let one: model.Location = {} as model.Location;
    await UpdateLocation(this.connectionUUID, this.uuid, this._this)
      .then((res) => {
        one = res as model.Location;
        this._this = one;
      })
      .catch((err) => {
        return undefined;
      });
    return one;
  }
}
