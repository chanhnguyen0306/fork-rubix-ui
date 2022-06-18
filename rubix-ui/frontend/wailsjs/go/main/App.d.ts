// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {model} from '../models';
import {storage} from '../models';
import {assitcli} from '../models';
import {main} from '../models';

export function GetHostNetwork(arg1:string,arg2:string):Promise<model.Network>;

export function GetNetworkSchema(arg1:string):Promise<any>;

export function UpdateConnection(arg1:string,arg2:storage.RubixConnection):Promise<storage.RubixConnection>;

export function UpdateLocation(arg1:string,arg2:string,arg3:model.Location):Promise<model.Location>;

export function DeleteLocation(arg1:string,arg2:string):Promise<assitcli.Response>;

export function GetHost(arg1:string,arg2:string):Promise<model.Host>;

export function GetLocationSchema(arg1:string):Promise<any>;

export function GetHosts(arg1:string):Promise<Array<model.Host>>;

export function GetLocation(arg1:string,arg2:string):Promise<model.Location>;

export function PingHost(arg1:string,arg2:string):Promise<boolean>;

export function AddHostNetwork(arg1:string,arg2:model.Network):Promise<model.Network>;

export function DeleteConnection(arg1:string):Promise<string>;

export function GetTime(arg1:string,arg2:string):Promise<any>;

export function PingRubixAssist(arg1:string):Promise<boolean>;

export function DeleteAllConnections():Promise<main.DeleteAllConnections>;

export function EditHostNetwork(arg1:string,arg2:string,arg3:model.Network):Promise<model.Network>;

export function GetConnection(arg1:string):Promise<storage.RubixConnection>;

export function GetHostNetworks(arg1:string):Promise<Array<model.Network>>;

export function GetHostSchema(arg1:string):Promise<any>;

export function GetLocations(arg1:string):Promise<Array<model.Location>>;

export function AddConnection(arg1:storage.RubixConnection):Promise<storage.RubixConnection>;

export function AddLocation(arg1:string,arg2:model.Location):Promise<model.Location>;

export function DeleteHostNetwork(arg1:string,arg2:string):Promise<assitcli.Response>;

export function GetConnectionSchema():Promise<main.ConnectionSchema>;

export function GetConnections():Promise<Array<storage.RubixConnection>>;

export function AddHost(arg1:string,arg2:model.Host):Promise<model.Host>;

export function DeleteHost(arg1:string,arg2:string):Promise<assitcli.Response>;

export function EditHost(arg1:string,arg2:string,arg3:model.Host):Promise<model.Host>;
