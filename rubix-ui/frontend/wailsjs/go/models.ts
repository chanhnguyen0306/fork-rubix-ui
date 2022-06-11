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
	export class LocationUUID {
	    type: string;
	    required: boolean;
	    binding: string;
	
	    static createFrom(source: any = {}) {
	        return new LocationUUID(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.type = source["type"];
	        this.required = source["required"];
	        this.binding = source["binding"];
	    }
	}
	export class HostSchema {
	    // Go type: schema.UUID
	    uuid: any;
	    // Go type: schema.Name
	    name: any;
	    // Go type: schema.Description
	    description: any;
	    // Go type: schema.Enable
	    enable: any;
	    // Go type: schema.Product
	    product: any;
	    // Go type: LocationUUID
	    network_uuid: any;
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
	    // Go type: schema.Password
	    is_offline: any;
	    // Go type: schema.Password
	    offline_count: any;
	
	    static createFrom(source: any = {}) {
	        return new HostSchema(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.uuid = this.convertValues(source["uuid"], null);
	        this.name = this.convertValues(source["name"], null);
	        this.description = this.convertValues(source["description"], null);
	        this.enable = this.convertValues(source["enable"], null);
	        this.product = this.convertValues(source["product"], null);
	        this.network_uuid = this.convertValues(source["network_uuid"], null);
	        this.ip = this.convertValues(source["ip"], null);
	        this.port = this.convertValues(source["port"], null);
	        this.https = this.convertValues(source["https"], null);
	        this.username = this.convertValues(source["username"], null);
	        this.password = this.convertValues(source["password"], null);
	        this.is_offline = this.convertValues(source["is_offline"], null);
	        this.offline_count = this.convertValues(source["offline_count"], null);
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
	export class LocationSchema {
	    // Go type: schema.UUID
	    uuid: any;
	    // Go type: schema.Name
	    name: any;
	    // Go type: schema.Description
	    description: any;
	
	    static createFrom(source: any = {}) {
	        return new LocationSchema(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.uuid = this.convertValues(source["uuid"], null);
	        this.name = this.convertValues(source["name"], null);
	        this.description = this.convertValues(source["description"], null);
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
	export class NetworkSchema {
	    // Go type: schema.UUID
	    uuid: any;
	    // Go type: schema.Name
	    name: any;
	    // Go type: schema.Description
	    description: any;
	    // Go type: LocationUUID
	    location_uuid: any;
	
	    static createFrom(source: any = {}) {
	        return new NetworkSchema(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.uuid = this.convertValues(source["uuid"], null);
	        this.name = this.convertValues(source["name"], null);
	        this.description = this.convertValues(source["description"], null);
	        this.location_uuid = this.convertValues(source["location_uuid"], null);
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

export namespace assist {
	
	export class Response {
	    status_code: number;
	    message: any;
	
	    static createFrom(source: any = {}) {
	        return new Response(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.status_code = source["status_code"];
	        this.message = source["message"];
	    }
	}

}

