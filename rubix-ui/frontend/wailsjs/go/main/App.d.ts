// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {assitcli} from '../models';
import {model} from '../models';

export function DeleteHostNetwork(arg1:string):Promise<assitcli.Response>;

export function DeleteLocation(arg1:string):Promise<assitcli.Response>;

export function EditHostNetwork(arg1:string,arg2:model.Network):Promise<model.Network>;

export function GetHostNetwork(arg1:string):Promise<model.Network>;

export function GetLocations():Promise<Array<model.Location>>;

export function UpdateLocation(arg1:string,arg2:model.Location):Promise<model.Location>;

export function AddHost(arg1:model.Host):Promise<model.Host>;

export function AddHostNetwork(arg1:model.Network):Promise<model.Network>;

export function EditHost(arg1:string,arg2:model.Host):Promise<model.Host>;

export function GetLocationSchema():Promise<any>;

export function AddLocation(arg1:model.Location):Promise<model.Location>;

export function GetHost(arg1:string):Promise<model.Host>;

export function GetHostNetworks():Promise<Array<model.Network>>;

export function DeleteHost(arg1:string):Promise<assitcli.Response>;

export function GetHostSchema():Promise<any>;

export function GetHosts():Promise<Array<model.Host>>;

export function GetLocation(arg1:string):Promise<model.Location>;

export function GetNetworkSchema():Promise<any>;
