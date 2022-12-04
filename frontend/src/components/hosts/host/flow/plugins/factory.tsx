import { backend } from "../../../../../../wailsjs/go/models";
import {
  EdgeEnablePlugins, EdgeGetPlugins, EdgeRestartPlugins,
} from "../../../../../../wailsjs/go/backend/App";
import { Helpers } from "../../../../../helpers/checks";

function hasUUID(uuid: string): Error {
  return Helpers.IsUndefined(uuid, "host or connection uuid") as Error;
}


export class FlowPluginFactory {
  hostUUID!: string;
  connectionUUID!: string;
  uuid!: string;

  async GetAll(): Promise<any> {
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    const plugins = await EdgeGetPlugins(this.connectionUUID, this.hostUUID)
    return plugins.data
  }

  async BulkEnable(pluginNames: Array<string>): Promise<any> {
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    return await EdgeEnablePlugins(this.connectionUUID, this.hostUUID, pluginNames, true)
  }

  async BulkDisable(pluginNames: Array<string>): Promise<any> {
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    return await EdgeEnablePlugins(this.connectionUUID, this.hostUUID, pluginNames, false)
  }

  async RestartBulk(pluginNames: Array<string>): Promise<any> {
    hasUUID(this.connectionUUID);
    hasUUID(this.hostUUID);
    return await EdgeRestartPlugins(this.connectionUUID, this.hostUUID, pluginNames)
  }

  // async InstallPlugin(connUUID: string, hostUUID: string, plugin: amodel.Plugin): Promise<any> {
  //   return await InstallPlugin(connUUID, hostUUID, plugin);
  // }
  //
  // async UnInstallPlugin(connUUID: string, hostUUID: string, plugin: amodel.Plugin): Promise<any> {
  //   return await UnInstallPlugin(connUUID, hostUUID, plugin);
  // }

}
