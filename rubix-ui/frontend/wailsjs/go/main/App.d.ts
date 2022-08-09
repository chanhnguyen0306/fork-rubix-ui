// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {main} from '../models';
import {model} from '../models';
import {datelib} from '../models';
import {storage} from '../models';
import {assistmodel} from '../models';
import {store} from '../models';
import {assitcli} from '../models';
import {networking} from '../models';
import {edge} from '../models';

export function GetServerNetworking(arg1:string):Promise<any>;

export function PingRubixAssist(arg1:string):Promise<boolean>;

export function DeleteConsumerBulk(arg1:string,arg2:string,arg3:Array<main.UUIDs>):Promise<any>;

export function DeleteHostNetworkBulk(arg1:string,arg2:Array<main.UUIDs>):Promise<any>;

export function DeleteStreamBulk(arg1:string,arg2:string,arg3:Array<main.UUIDs>):Promise<any>;

export function GetConsumerClones(arg1:string,arg2:string):Promise<Array<model.Consumer>>;

export function GetPcTime():Promise<datelib.Time>;

export function DeleteConnectionBulk(arg1:Array<main.UUIDs>):Promise<any>;

export function GetPoints(arg1:string,arg2:string):Promise<Array<model.Point>>;

export function GetProducerClones(arg1:string,arg2:string):Promise<Array<model.Producer>>;

export function UpdateConnection(arg1:string,arg2:storage.RubixConnection):Promise<storage.RubixConnection>;

export function EditDevice(arg1:string,arg2:string,arg3:string,arg4:model.Device):Promise<model.Device>;

export function GetBackupsByApplication(arg1:string,arg2:string,arg3:boolean):Promise<Array<storage.Backup>>;

export function GetFlowNetworkSchema(arg1:string,arg2:string,arg3:string):Promise<any>;

export function GetNetworkWithPoints(arg1:string,arg2:string,arg3:string):Promise<model.Network>;

export function ImportNetwork(arg1:string,arg2:string,arg3:boolean,arg4:boolean,arg5:model.Network):Promise<model.Network>;

export function PingHost(arg1:string,arg2:string):Promise<boolean>;

export function DeleteAllConnections():Promise<main.DeleteAllConnections>;

export function EditNetwork(arg1:string,arg2:string,arg3:string,arg4:model.Network):Promise<model.Network>;

export function GetLocation(arg1:string,arg2:string):Promise<assistmodel.Location>;

export function GetNetworks(arg1:string,arg2:string,arg3:boolean):Promise<Array<model.Network>>;

export function GetPcGetNetworks():Promise<any>;

export function DeleteFlowNetwork(arg1:string,arg2:string,arg3:string):Promise<any>;

export function DeleteStream(arg1:string,arg2:string,arg3:string):Promise<any>;

export function GetPcGetNetworksSchema():Promise<any>;

export function GitDownloadRelease(arg1:string,arg2:string):Promise<store.Release>;

export function AddConnection(arg1:storage.RubixConnection):Promise<storage.RubixConnection>;

export function GetPluginByName(arg1:string,arg2:string,arg3:string):Promise<model.PluginConf|Error>;

export function GetBackup(arg1:string):Promise<storage.Backup>;

export function GetBackups():Promise<Array<storage.Backup>>;

export function GetConnection(arg1:string):Promise<storage.RubixConnection>;

export function GetGitToken(arg1:string,arg2:boolean):Promise<string>;

export function GetNetworkBackupsByUUID(arg1:string,arg2:string,arg3:string):Promise<Array<storage.Backup>>;

export function ImportDevicesBulk(arg1:string,arg2:string,arg3:string,arg4:string):Promise<main.BulkAddResponse>;

export function AddHostNetwork(arg1:string,arg2:assistmodel.Network):Promise<assistmodel.Network>;

export function AddNetwork(arg1:string,arg2:string,arg3:model.Network):Promise<model.Network>;

export function AddRelease(arg1:string,arg2:string):Promise<store.Release>;

export function DeleteHost(arg1:string,arg2:string):Promise<assitcli.Response>;

export function DeletePointBulk(arg1:string,arg2:string,arg3:Array<main.UUIDs>):Promise<any>;

export function GetPoint(arg1:string,arg2:string,arg3:string):Promise<model.Point>;

export function GetStreamClones(arg1:string,arg2:string):Promise<Array<model.StreamClone>>;

export function DeleteLocationBulk(arg1:string,arg2:Array<main.UUIDs>):Promise<any>;

export function EditPoint(arg1:string,arg2:string,arg3:string,arg4:model.Point):Promise<model.Point>;

export function GetDevices(arg1:string,arg2:string,arg3:boolean):Promise<Array<model.Device>>;

export function GetFlowNetworkClones(arg1:string,arg2:string,arg3:boolean):Promise<Array<model.FlowNetworkClone>>;

export function GetLocations(arg1:string):Promise<Array<assistmodel.Location>>;

export function DeletePoint(arg1:string,arg2:string,arg3:string):Promise<any>;

export function EditHost(arg1:string,arg2:string,arg3:assistmodel.Host):Promise<assistmodel.Host>;

export function EnablePlugin(arg1:string,arg2:string,arg3:string):Promise<any>;

export function AddProducer(arg1:string,arg2:string,arg3:model.Producer):Promise<model.Producer>;

export function DeleteBackupBulk(arg1:Array<main.UUIDs>):Promise<any>;

export function DeleteConsumer(arg1:string,arg2:string,arg3:string):Promise<any>;

export function DeleteHostBulk(arg1:string,arg2:Array<main.UUIDs>):Promise<any>;

export function DeleteHostNetwork(arg1:string,arg2:string):Promise<assitcli.Response>;

export function GetConnectionSchema():Promise<main.ConnectionSchema>;

export function GetNetwork(arg1:string,arg2:string,arg3:string,arg4:boolean):Promise<model.Network>;

export function DeleteBackup(arg1:string):Promise<string>;

export function DeleteDevice(arg1:string,arg2:string,arg3:string):Promise<any>;

export function DeleteNetworkBulk(arg1:string,arg2:string,arg3:Array<main.UUIDs>):Promise<any>;

export function AddHost(arg1:string,arg2:assistmodel.Host):Promise<assistmodel.Host>;

export function DeleteLogBulk(arg1:Array<main.UUIDs>):Promise<any>;

export function DeleteProducer(arg1:string,arg2:string,arg3:string):Promise<any>;

export function GitListReleases(arg1:string):Promise<Array<store.ReleaseList>>;

export function ImportBackup(arg1:storage.Backup):Promise<string>;

export function GetPlugin(arg1:string,arg2:string,arg3:string):Promise<model.PluginConf>;

export function GetStream(arg1:string,arg2:string,arg3:string):Promise<model.Stream>;

export function GetFlowPointSchema(arg1:string,arg2:string,arg3:string):Promise<any>;

export function GetReleases():Promise<Array<store.Release>>;

export function ImportPointBulk(arg1:string,arg2:string,arg3:string,arg4:string):Promise<main.BulkAddResponse>;

export function DeleteLocation(arg1:string,arg2:string):Promise<assitcli.Response>;

export function GetPcInterfaces():Promise<networking.InterfaceNames>;

export function GetServerTime(arg1:string):Promise<any>;

export function HostRubixScan(arg1:string,arg2:string):Promise<any>;

export function EditProducer(arg1:string,arg2:string,arg3:string,arg4:model.Producer):Promise<model.Producer>;

export function ExportPointBulk(arg1:string,arg2:string,arg3:string,arg4:string,arg5:Array<string>):Promise<storage.Backup>;

export function GetHostInternetIP(arg1:string,arg2:string):Promise<edge.InternetIP>;

export function GetHostActiveNetworks(arg1:string,arg2:string):Promise<any>;

export function GetHosts(arg1:string):Promise<Array<assistmodel.Host>>;

export function GetNetworkDevices(arg1:string,arg2:string,arg3:string):Promise<Array<model.Device>>;

export function AddConsumer(arg1:string,arg2:string,arg3:model.Consumer):Promise<model.Consumer>;

export function DoBackup(arg1:string,arg2:string,arg3:string,arg4:string,arg5:string,arg6:any):Promise<storage.Backup>;

export function GetBackupsNoData():Promise<Array<storage.Backup>>;

export function GetFlowNetworkClone(arg1:string,arg2:string,arg3:string,arg4:boolean):Promise<model.FlowNetworkClone>;

export function GetHost(arg1:string,arg2:string):Promise<assistmodel.Host>;

export function GetRelease(arg1:string):Promise<store.Release>;

export function WiresBackup(arg1:string,arg2:string,arg3:string):Promise<storage.Backup>;

export function OpenURL(arg1:string):void;

export function AddFlowNetwork(arg1:string,arg2:string,arg3:model.FlowNetwork):Promise<model.FlowNetwork>;

export function DeleteFlowNetworkCloneBulk(arg1:string,arg2:string,arg3:Array<main.UUIDs>):Promise<any>;

export function DisablePluginBulk(arg1:string,arg2:string,arg3:Array<main.PluginUUIDs>):Promise<any>;

export function GetConsumer(arg1:string,arg2:string,arg3:string):Promise<model.Consumer>;

export function GetHostNetwork(arg1:string,arg2:string):Promise<assistmodel.Network>;

export function StoreDownloadAll(arg1:string,arg2:string,arg3:boolean):Promise<Array<store.App>>;

export function UpdateLocation(arg1:string,arg2:string,arg3:assistmodel.Location):Promise<assistmodel.Location>;

export function AddDevice(arg1:string,arg2:string,arg3:model.Device):Promise<model.Device>;

export function DeleteDeviceBulk(arg1:string,arg2:string,arg3:Array<main.UUIDs>):Promise<any>;

export function GetBacnetDevicePoints(arg1:string,arg2:string,arg3:string,arg4:boolean,arg5:boolean):Promise<Array<model.Point>>;

export function GetHostTime(arg1:string,arg2:string):Promise<any>;

export function GetProducers(arg1:string,arg2:string):Promise<Array<model.Producer>>;

export function GetPluginsNames(arg1:string,arg2:string):Promise<Array<main.PluginName>>;

export function GetPointsForDevice(arg1:string,arg2:string,arg3:string):Promise<Array<model.Point>>;

export function GetStreams(arg1:string,arg2:string):Promise<Array<model.Stream>>;

export function DeleteFlowNetworkClone(arg1:string,arg2:string,arg3:string):Promise<any>;

export function GetDevice(arg1:string,arg2:string,arg3:string,arg4:boolean):Promise<model.Device>;

export function GetFlowNetwork(arg1:string,arg2:string,arg3:string,arg4:boolean):Promise<model.FlowNetwork>;

export function GetFlowNetworks(arg1:string,arg2:string,arg3:boolean):Promise<Array<model.FlowNetwork>>;

export function GetHostSchema(arg1:string):Promise<any>;

export function GetNetworkByPluginName(arg1:string,arg2:string,arg3:string,arg4:boolean):Promise<model.Network>;

export function UpdateSettings(arg1:string,arg2:storage.Settings):Promise<storage.Settings>;

export function AddLocation(arg1:string,arg2:assistmodel.Location):Promise<assistmodel.Location>;

export function AddStream(arg1:string,arg2:string,arg3:model.Stream):Promise<model.Stream>;

export function DeleteNetwork(arg1:string,arg2:string,arg3:string):Promise<any>;

export function DeleteProducerBulk(arg1:string,arg2:string,arg3:Array<main.UUIDs>):Promise<any>;

export function GetLogs():Promise<any>;

export function DisablePlugin(arg1:string,arg2:string,arg3:string):Promise<any>;

export function EditHostNetwork(arg1:string,arg2:string,arg3:assistmodel.Network):Promise<assistmodel.Network>;

export function GetNetworkBackupsByPlugin(arg1:string,arg2:string,arg3:string):Promise<Array<storage.Backup>>;

export function ExportDevicesBulk(arg1:string,arg2:string,arg3:string,arg4:string,arg5:Array<string>):Promise<storage.Backup>;

export function GetHostInterfaces(arg1:string,arg2:string):Promise<edge.InterfaceNames>;

export function GetLogsByConnection(arg1:string):Promise<any>;

export function GetNetworkSchema(arg1:string):Promise<any>;

export function GetNetworksWithPoints(arg1:string,arg2:string):Promise<model.Network>;

export function AddPoint(arg1:string,arg2:string,arg3:model.Point):Promise<model.Point>;

export function DeleteConnection(arg1:string):Promise<string>;

export function EditStream(arg1:string,arg2:string,arg3:string,arg4:model.Stream):Promise<model.Stream>;

export function Scanner(arg1:string,arg2:string,arg3:number,arg4:Array<string>):Promise<any>;

export function WiresBackupRestore(arg1:string,arg2:string,arg3:string):Promise<any>;

export function DeleteFlowNetworkBulk(arg1:string,arg2:string,arg3:Array<main.UUIDs>):Promise<any>;

export function EditFlowNetwork(arg1:string,arg2:string,arg3:string,arg4:model.FlowNetwork):Promise<model.FlowNetwork>;

export function GetConnections():Promise<Array<storage.RubixConnection>>;

export function GetSetting(arg1:string):Promise<storage.Settings>;

export function BacnetWhois(arg1:string,arg2:string,arg3:string,arg4:string):Promise<model.Device>;

export function EditConsumer(arg1:string,arg2:string,arg3:string,arg4:model.Consumer):Promise<model.Consumer>;

export function GetScannerSchema():Promise<any>;

export function GetConsumers(arg1:string,arg2:string):Promise<Array<model.Consumer>>;

export function GetPlugins(arg1:string,arg2:string):Promise<Array<model.PluginConf>>;

export function StoreDownloadApp(arg1:string,arg2:string,arg3:string,arg4:string,arg5:boolean):Promise<store.InstallResponse>;

export function GetLogsWithData():Promise<any>;

export function GetProducer(arg1:string,arg2:string,arg3:string):Promise<model.Producer>;

export function GetReleaseByVersion(arg1:string):Promise<store.Release>;

export function EnablePluginBulk(arg1:string,arg2:string,arg3:Array<main.PluginUUIDs>):Promise<any>;

export function GetFlowDeviceSchema(arg1:string,arg2:string,arg3:string):Promise<any>;

export function GetHostNetworks(arg1:string):Promise<Array<assistmodel.Network>>;

export function GetLocationSchema(arg1:string):Promise<any>;

export function GetLocationTableSchema(arg1:string):Promise<any>;
