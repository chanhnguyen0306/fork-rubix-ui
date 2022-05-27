export namespace model {
	
	export class Host {
	    uuid: string;
	    name: string;
	    network_uuid?: string;
	    ip: string;
	    port: number;
	    https?: boolean;
	    username: string;
	    password: string;
	    rubix_port: number;
	    rubix_username: string;
	    rubix_password: string;
	    bios_port: number;
	    is_localhost?: boolean;
	    ping_enable?: boolean;
	    ping_frequency: number;
	    is_offline?: boolean;
	    offline_count: number;
	
	    static createFrom(source: any = {}) {
	        return new Host(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.uuid = source["uuid"];
	        this.name = source["name"];
	        this.network_uuid = source["network_uuid"];
	        this.ip = source["ip"];
	        this.port = source["port"];
	        this.https = source["https"];
	        this.username = source["username"];
	        this.password = source["password"];
	        this.rubix_port = source["rubix_port"];
	        this.rubix_username = source["rubix_username"];
	        this.rubix_password = source["rubix_password"];
	        this.bios_port = source["bios_port"];
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
	    hosts: Host[];
	
	    static createFrom(source: any = {}) {
	        return new Network(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.uuid = source["uuid"];
	        this.name = source["name"];
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

