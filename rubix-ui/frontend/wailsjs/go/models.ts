export namespace assitcli {
	
	export class Response {
	    code: number;
	    message: any;
	
	    static createFrom(source: any = {}) {
	        return new Response(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.code = source["code"];
	        this.message = source["message"];
	    }
	}

}

export namespace storage {
	
	export class RubixConnection {
	    uuid: string;
	    name: string;
	    description: string;
	    customer: string;
	    username: string;
	    password: string;
	    ip: string;
	    port: number;
	    https: boolean;
	
	    static createFrom(source: any = {}) {
	        return new RubixConnection(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.uuid = source["uuid"];
	        this.name = source["name"];
	        this.description = source["description"];
	        this.customer = source["customer"];
	        this.username = source["username"];
	        this.password = source["password"];
	        this.ip = source["ip"];
	        this.port = source["port"];
	        this.https = source["https"];
	    }
	}

}

export namespace model {
	
	export class Host {
	    uuid: string;
	    name: string;
	    network_uuid?: string;
	    enable?: boolean;
	    ip: string;
	    port: number;
	    https?: boolean;
	    username: string;
	    password: string;
	    rubix_port: number;
	    wires_port: number;
	    rubix_username: string;
	    rubix_password: string;
	    rubix_https?: boolean;
	    is_localhost?: boolean;
	    ping_enable?: boolean;
	    ping_frequency: number;
	    is_offline: boolean;
	    offline_count: number;
	
	    static createFrom(source: any = {}) {
	        return new Host(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.uuid = source["uuid"];
	        this.name = source["name"];
	        this.network_uuid = source["network_uuid"];
	        this.enable = source["enable"];
	        this.ip = source["ip"];
	        this.port = source["port"];
	        this.https = source["https"];
	        this.username = source["username"];
	        this.password = source["password"];
	        this.rubix_port = source["rubix_port"];
	        this.wires_port = source["wires_port"];
	        this.rubix_username = source["rubix_username"];
	        this.rubix_password = source["rubix_password"];
	        this.rubix_https = source["rubix_https"];
	        this.is_localhost = source["is_localhost"];
	        this.ping_enable = source["ping_enable"];
	        this.ping_frequency = source["ping_frequency"];
	        this.is_offline = source["is_offline"];
	        this.offline_count = source["offline_count"];
	    }
	}
	export class Network {
	    uuid: string;
	    name: string;
	    location_uuid?: string;
	    hosts: Host[];
	
	    static createFrom(source: any = {}) {
	        return new Network(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.uuid = source["uuid"];
	        this.name = source["name"];
	        this.location_uuid = source["location_uuid"];
	        this.hosts = this.convertValues(source["hosts"], Host);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Location {
	    uuid: string;
	    name: string;
	    description: string;
	    networks: Network[];
	
	    static createFrom(source: any = {}) {
	        return new Location(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.uuid = source["uuid"];
	        this.name = source["name"];
	        this.description = source["description"];
	        this.networks = this.convertValues(source["networks"], Network);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	

}

export namespace main {
	
	
	export class ConnectionSchema {
	    // Go type: schema.UUID
	    uuid: any;
	    // Go type: schema.Name
	    name: any;
	    // Go type: schema.Description
	    description: any;
	    // Go type: schema.IP
	    ip: any;
	    // Go type: schema.Port
	    port: any;
	    // Go type: schema.HTTPS
	    https: any;
	    // Go type: schema.Username
	    username: any;
	    // Go type: schema.Password
	    password: any;
	
	    static createFrom(source: any = {}) {
	        return new ConnectionSchema(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.uuid = this.convertValues(source["uuid"], null);
	        this.name = this.convertValues(source["name"], null);
	        this.description = this.convertValues(source["description"], null);
	        this.ip = this.convertValues(source["ip"], null);
	        this.port = this.convertValues(source["port"], null);
	        this.https = this.convertValues(source["https"], null);
	        this.username = this.convertValues(source["username"], null);
	        this.password = this.convertValues(source["password"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

