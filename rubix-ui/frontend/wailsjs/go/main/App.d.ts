// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {assistmodel} from '../models';
import {main} from '../models';
import {model} from '../models';
import {storage} from '../models';
import {assitcli} from '../models';
import {store} from '../models';
import {edge} from '../models';
import {networking} from '../models';
import {datelib} from '../models';

export function AddHost(arg1:string,arg2:assistmodel.Host):Promise<assistmodel.Host>;

export function DeleteLocationBulk(arg1:string,arg2:Array<main.UUIDs>):Promise<any>;

export function EditProducer(arg1:string,arg2:string,arg3:string,arg4:model.Producer):Promise<model.Producer>;

export function GetFlowNetworkSchema(arg1:string,arg2:string,arg3:string):Promise<any>;

export function GetPointsForDevice(arg1:string,arg2:string,arg3:string):Promise<Array<model.Point>>;

export function AddLocation(arg1:string,arg2:assistmodel.Location):Promise<assistmodel.Location>;

export function DeleteAllConnections():Promise<main.DeleteAllConnections>;

export function DeleteFlowNetwork(arg1:string,arg2:string,arg3:string):Promise<any>;

export function DeleteHostNetworkBulk(arg1:string,arg2:Array<main.UUIDs>):Promise<any>;

export function GetDevice(arg1:string,arg2:string,arg3:string,arg4:boolean):Promise<model.Device>;

export function GetFlowNetworkClone(arg1:string,arg2:string,arg3:string,arg4:boolean):Promise<model.FlowNetworkClone>;

export function GetBackupsByApplication(arg1:string,arg2:boolean):Promise<Array<storage.Backup>>;

export function GetNetworks(arg1:string,arg2:string,arg3:boolean):Promise<Array<model.Network>>;

export function GetProducers(arg1:string,arg2:string):Promise<Array<model.Producer>>;

export function DeleteLocation(arg1:string,arg2:string):Promise<assitcli.Response>;

export function DeleteProducer(arg1:string,arg2:string,arg3:string):Promise<any>;

export function GetHostNetworks(arg1:string):Promise<Array<assistmodel.Network>>;

export function GetProducerClones(arg1:string,arg2:string):Promise<Array<model.Producer>>;

export function GetScannerSchema():Promise<any>;

export function WiresBackup(arg1:string,arg2:string,arg3:string):Promise<storage.Backup>;

export function DeleteNetworkBulk(arg1:string,arg2:string,arg3:Array<main.UUIDs>):Promise<any>;

export function UpdateLocation(arg1:string,arg2:string,arg3:assistmodel.Location):Promise<assistmodel.Location>;

export function AddDevice(arg1:string,arg2:string,arg3:model.Device):Promise<model.Device>;

export function AddRelease(arg1:string,arg2:string):Promise<store.Release>;

export function GetStreamClones(arg1:string,arg2:string):Promise<Array<model.StreamClone>>;

export function Scanner(arg1:string,arg2:string,arg3:number,arg4:Array<string>):Promise<any>;

export function AddHostNetwork(arg1:string,arg2:assistmodel.Network):Promise<assistmodel.Network>;

export function DeletePointBulk(arg1:string,arg2:string,arg3:Array<main.UUIDs>):Promise<any>;

export function EditFlowNetwork(arg1:string,arg2:string,arg3:string,arg4:model.FlowNetwork):Promise<model.FlowNetwork>;

export function GetFlowNetworkClones(arg1:string,arg2:string,arg3:boolean):Promise<Array<model.FlowNetworkClone>>;

export function GetHostTime(arg1:string,arg2:string):Promise<any>;

export function GetLocations(arg1:string):Promise<Array<assistmodel.Location>>;

export function EditDevice(arg1:string,arg2:string,arg3:string,arg4:model.Device):Promise<model.Device>;

export function GetLogs():Promise<any>;

export function GetStreams(arg1:string,arg2:string):Promise<Array<model.Stream>>;

export function PingHost(arg1:string,arg2:string):Promise<boolean>;

export function EditNetwork(arg1:string,arg2:string,arg3:string,arg4:model.Network):Promise<model.Network>;

export function GetConsumerClones(arg1:string,arg2:string):Promise<Array<model.Consumer>>;

export function DisablePluginBulk(arg1:string,arg2:string,arg3:Array<main.PluginUUIDs>):Promise<any>;

export function GetBackupsNoData():Promise<Array<storage.Backup>>;

export function BacnetWhois(arg1:string,arg2:string,arg3:string,arg4:string):Promise<model.Device>;

export function DeleteConnectionBulk(arg1:Array<main.UUIDs>):Promise<any>;

export function DeleteDevice(arg1:string,arg2:string,arg3:string):Promise<any>;

export function DeleteProducerBulk(arg1:string,arg2:string,arg3:Array<main.UUIDs>):Promise<any>;

export function DeleteStreamBulk(arg1:string,arg2:string,arg3:Array<main.UUIDs>):Promise<any>;

export function DisablePlugin(arg1:string,arg2:string,arg3:string):Promise<any>;

export function GetConsumer(arg1:string,arg2:string,arg3:string):Promise<model.Consumer>;

export function GetGitToken(arg1:string,arg2:boolean):Promise<string>;

export function GetRelease(arg1:string):Promise<store.Release>;

export function GetLogsWithData():Promise<any>;

export function GetServerTime(arg1:string):Promise<any>;

export function AddConnection(arg1:storage.RubixConnection):Promise<storage.RubixConnection>;

export function DeleteFlowNetworkBulk(arg1:string,arg2:string,arg3:Array<main.UUIDs>):Promise<any>;

export function GetHostInternetIP(arg1:string,arg2:string):Promise<edge.InternetIP>;

export function GetHostNetwork(arg1:string,arg2:string):Promise<assistmodel.Network>;

export function GetPcInterfaces():Promise<networking.InterfaceNames>;

export function GetNetworkDevices(arg1:string,arg2:string,arg3:string):Promise<Array<model.Device>>;

export function GitDownloadRelease(arg1:string,arg2:string):Promise<store.Release>;

export function DeleteConsumer(arg1:string,arg2:string,arg3:string):Promise<any>;

export function GetDevices(arg1:string,arg2:string,arg3:boolean):Promise<Array<model.Device>>;

export function GetHostSchema(arg1:string):Promise<any>;

export function GetPoints(arg1:string,arg2:string):Promise<Array<model.Point>>;

export function StoreDownloadApp(arg1:string,arg2:string,arg3:string,arg4:string,arg5:boolean):Promise<store.InstallResponse>;

export function EnablePlugin(arg1:string,arg2:string,arg3:string):Promise<any>;

export function GetNetworkByPluginName(arg1:string,arg2:string,arg3:string,arg4:boolean):Promise<model.Network>;

export function GetPcGetNetworks():Promise<any>;

export function OpenURL(arg1:string):void;

export function WiresBackupRestore(arg1:string,arg2:string,arg3:string):Promise<any>;

export function AddConsumer(arg1:string,arg2:string,arg3:model.Consumer):Promise<model.Consumer>;

export function DeleteNetwork(arg1:string,arg2:string,arg3:string):Promise<any>;

export function GetConnections():Promise<Array<storage.RubixConnection>>;

export function GetNetwork(arg1:string,arg2:string,arg3:string,arg4:boolean):Promise<model.Network>;

export function GetLocation(arg1:string,arg2:string):Promise<assistmodel.Location>;

export function GetSetting(arg1:string):Promise<storage.Settings>;

export function DeleteBackupBulk(arg1:Array<main.UUIDs>):Promise<any>;

export function DeleteFlowNetworkClone(arg1:string,arg2:string,arg3:string):Promise<any>;

export function EditPoint(arg1:string,arg2:string,arg3:string,arg4:model.Point):Promise<model.Point>;

export function GetFlowNetwork(arg1:string,arg2:string,arg3:string,arg4:boolean):Promise<model.FlowNetwork>;

export function GetFlowPointSchema(arg1:string,arg2:string,arg3:string):Promise<any>;

export function GetHost(arg1:string,arg2:string):Promise<assistmodel.Host>;

export function DeleteConnection(arg1:string):Promise<string>;

export function GetFlowDeviceSchema(arg1:string,arg2:string,arg3:string):Promise<any>;

export function GetProducer(arg1:string,arg2:string,arg3:string):Promise<model.Producer>;

export function DeleteHostBulk(arg1:string,arg2:Array<main.UUIDs>):Promise<any>;

export function DeleteStream(arg1:string,arg2:string,arg3:string):Promise<any>;

export function GetConnection(arg1:string):Promise<storage.RubixConnection>;

export function GetConsumers(arg1:string,arg2:string):Promise<Array<model.Consumer>>;

export function GetHostActiveNetworks(arg1:string,arg2:string):Promise<any>;

export function GitListReleases(arg1:string):Promise<Array<store.ReleaseList>>;

export function AddNetwork(arg1:string,arg2:string,arg3:model.Network):Promise<model.Network>;

export function DeleteBackup(arg1:string):Promise<string>;

export function GetLogsByConnection(arg1:string):Promise<any>;

export function GetFlowNetworks(arg1:string,arg2:string,arg3:boolean):Promise<Array<model.FlowNetwork>>;

export function GetNetworksWithPoints(arg1:string,arg2:string):Promise<model.Network>;

export function EditConsumer(arg1:string,arg2:string,arg3:string,arg4:model.Consumer):Promise<model.Consumer>;

export function GetBacnetDevicePoints(arg1:string,arg2:string,arg3:string,arg4:boolean,arg5:boolean):Promise<Array<model.Point>>;

export function GetNetworkSchema(arg1:string):Promise<any>;

export function DeleteDeviceBulk(arg1:string,arg2:string,arg3:Array<main.UUIDs>):Promise<any>;

export function GetConnectionSchema():Promise<main.ConnectionSchema>;

export function GetPluginsNames(arg1:string,arg2:string):Promise<Array<main.PluginName>>;

export function GetPoint(arg1:string,arg2:string,arg3:string):Promise<model.Point>;

export function GetStream(arg1:string,arg2:string,arg3:string):Promise<model.Stream>;

export function PingRubixAssist(arg1:string):Promise<boolean>;

export function StoreDownloadAll(arg1:string,arg2:string,arg3:boolean):Promise<Array<store.App>>;

export function DeleteFlowNetworkCloneBulk(arg1:string,arg2:string,arg3:Array<main.UUIDs>):Promise<any>;

export function GetBackup(arg1:string):Promise<storage.Backup>;

export function GetPluginByName(arg1:string,arg2:string,arg3:string):Promise<model.PluginConf|Error>;

export function GetPlugins(arg1:string,arg2:string):Promise<Array<model.PluginConf>>;

export function GetServerNetworking(arg1:string):Promise<any>;

export function ImportBackup(arg1:storage.Backup):Promise<string>;

export function DeleteConsumerBulk(arg1:string,arg2:string,arg3:Array<main.UUIDs>):Promise<any>;

export function EditHostNetwork(arg1:string,arg2:string,arg3:assistmodel.Network):Promise<assistmodel.Network>;

export function AddStream(arg1:string,arg2:string,arg3:model.Stream):Promise<model.Stream>;

export function DeleteLogBulk(arg1:Array<main.UUIDs>):Promise<any>;

export function GetHosts(arg1:string):Promise<Array<assistmodel.Host>>;

export function GetPcTime():Promise<datelib.Time>;

export function GetPlugin(arg1:string,arg2:string,arg3:string):Promise<model.PluginConf>;

export function UpdateSettings(arg1:string,arg2:storage.Settings):Promise<storage.Settings>;

export function GetBackups():Promise<Array<storage.Backup>>;

export function GetReleaseByVersion(arg1:string):Promise<store.Release>;

export function UpdateConnection(arg1:string,arg2:storage.RubixConnection):Promise<storage.RubixConnection>;

export function AddPoint(arg1:string,arg2:string,arg3:model.Point):Promise<model.Point>;

export function DeleteHostNetwork(arg1:string,arg2:string):Promise<assitcli.Response>;

export function DeletePoint(arg1:string,arg2:string,arg3:string):Promise<any>;

export function EditHost(arg1:string,arg2:string,arg3:assistmodel.Host):Promise<assistmodel.Host>;

export function GetPcGetNetworksSchema():Promise<any>;

export function HostRubixScan(arg1:string,arg2:string):Promise<any>;

export function AddFlowNetwork(arg1:string,arg2:string,arg3:model.FlowNetwork):Promise<model.FlowNetwork>;

export function AddProducer(arg1:string,arg2:string,arg3:model.Producer):Promise<model.Producer>;

export function EditStream(arg1:string,arg2:string,arg3:string,arg4:model.Stream):Promise<model.Stream>;

export function GetLocationSchema(arg1:string):Promise<any>;

export function DeleteHost(arg1:string,arg2:string):Promise<assitcli.Response>;

export function EnablePluginBulk(arg1:string,arg2:string,arg3:Array<main.PluginUUIDs>):Promise<any>;

export function GetHostInterfaces(arg1:string,arg2:string):Promise<edge.InterfaceNames>;

export function GetLocationTableSchema(arg1:string):Promise<any>;

export function GetReleases():Promise<Array<store.Release>>;

export function ImportNetwork(arg1:string,arg2:string,arg3:boolean,arg4:boolean,arg5:model.Network):Promise<model.Network>;
