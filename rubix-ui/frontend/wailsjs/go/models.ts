export namespace assitcli {
  export class Response {
    code: number;
    message: any;

    static createFrom(source: any = {}) {
      return new Response(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.code = source["code"];
      this.message = source["message"];
    }
  }
}

export namespace edge {
  export class InterfaceNames {
    interface_names: string[];

    static createFrom(source: any = {}) {
      return new InterfaceNames(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.interface_names = source["interface_names"];
    }
  }
  export class InternetIP {
    ip_address: string;
    ok: boolean;

    static createFrom(source: any = {}) {
      return new InternetIP(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.ip_address = source["ip_address"];
      this.ok = source["ok"];
    }
  }
}

export namespace networking {
  export class InterfaceNames {
    interface_names: string[];

    static createFrom(source: any = {}) {
      return new InterfaceNames(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.interface_names = source["interface_names"];
    }
  }
}

export namespace datelib {
  export class Time {
    // Go type: time.Time
    date_stamp: any;
    time_local: string;
    time_utc: string;
    current_day: string;
    current_day_utc: string;
    date_format_local: string;
    date_format_utc: string;
    system_time_zone: string;

    static createFrom(source: any = {}) {
      return new Time(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.date_stamp = this.convertValues(source["date_stamp"], null);
      this.time_local = source["time_local"];
      this.time_utc = source["time_utc"];
      this.current_day = source["current_day"];
      this.current_day_utc = source["current_day_utc"];
      this.date_format_local = source["date_format_local"];
      this.date_format_utc = source["date_format_utc"];
      this.system_time_zone = source["system_time_zone"];
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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

export namespace storage {
  export class Backup {
    uuid: string;
    connection_uuid: string;
    connection_name: string;
    user_comment: string;
    host_uuid: string;
    host_name: string;
    backup_info: string;
    // Go type: time.Time
    time: any;
    application: string;
    data?: any;

    static createFrom(source: any = {}) {
      return new Backup(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.uuid = source["uuid"];
      this.connection_uuid = source["connection_uuid"];
      this.connection_name = source["connection_name"];
      this.user_comment = source["user_comment"];
      this.host_uuid = source["host_uuid"];
      this.host_name = source["host_name"];
      this.backup_info = source["backup_info"];
      this.time = this.convertValues(source["time"], null);
      this.application = source["application"];
      this.data = source["data"];
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
      if ("string" === typeof source) source = JSON.parse(source);
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
  export class Job {
    uuid: string;
    name: string;
    description?: string;
    frequency?: string;
    // Go type: time.Time
    start_date?: any;
    // Go type: time.Time
    end_date?: any;
    enable?: boolean;
    destroy_after_completed?: boolean;
    plugin_conf_id?: string;
    // Go type: time.Time
    created_on?: any;
    // Go type: time.Time
    updated_on?: any;

    static createFrom(source: any = {}) {
      return new Job(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.uuid = source["uuid"];
      this.name = source["name"];
      this.description = source["description"];
      this.frequency = source["frequency"];
      this.start_date = this.convertValues(source["start_date"], null);
      this.end_date = this.convertValues(source["end_date"], null);
      this.enable = source["enable"];
      this.destroy_after_completed = source["destroy_after_completed"];
      this.plugin_conf_id = source["plugin_conf_id"];
      this.created_on = this.convertValues(source["created_on"], null);
      this.updated_on = this.convertValues(source["updated_on"], null);
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
  export class MqttConnection {
    uuid: string;
    enabled?: boolean;
    master?: boolean;
    name?: string;
    host?: string;
    port?: number;
    authentication?: boolean;
    username?: string;
    password?: string;
    keepalive?: number;
    qos?: number;
    retain?: boolean;
    attempt_reconnect_on_unavailable?: boolean;
    attempt_reconnect_secs?: number;
    timeout?: number;
    integration_uuid: string;

    static createFrom(source: any = {}) {
      return new MqttConnection(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.uuid = source["uuid"];
      this.enabled = source["enabled"];
      this.master = source["master"];
      this.name = source["name"];
      this.host = source["host"];
      this.port = source["port"];
      this.authentication = source["authentication"];
      this.username = source["username"];
      this.password = source["password"];
      this.keepalive = source["keepalive"];
      this.qos = source["qos"];
      this.retain = source["retain"];
      this.attempt_reconnect_on_unavailable =
        source["attempt_reconnect_on_unavailable"];
      this.attempt_reconnect_secs = source["attempt_reconnect_secs"];
      this.timeout = source["timeout"];
      this.integration_uuid = source["integration_uuid"];
    }
  }
  export class Integration {
    uuid: string;
    name: string;
    description?: string;
    enable?: boolean;
    fault?: boolean;
    message_level?: string;
    message_code?: string;
    message?: string;
    // Go type: time.Time
    last_ok?: any;
    // Go type: time.Time
    last_fail?: any;
    ip: string;
    port: number;
    username: string;
    password: string;
    token: string;
    plugin_name: string;
    integration_type: string;
    plugin_conf_id: string;
    mqtt_connections: MqttConnection[];
    // Go type: time.Time
    created_on?: any;
    // Go type: time.Time
    updated_on?: any;

    static createFrom(source: any = {}) {
      return new Integration(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.uuid = source["uuid"];
      this.name = source["name"];
      this.description = source["description"];
      this.enable = source["enable"];
      this.fault = source["fault"];
      this.message_level = source["message_level"];
      this.message_code = source["message_code"];
      this.message = source["message"];
      this.last_ok = this.convertValues(source["last_ok"], null);
      this.last_fail = this.convertValues(source["last_fail"], null);
      this.ip = source["ip"];
      this.port = source["port"];
      this.username = source["username"];
      this.password = source["password"];
      this.token = source["token"];
      this.plugin_name = source["plugin_name"];
      this.integration_type = source["integration_type"];
      this.plugin_conf_id = source["plugin_conf_id"];
      this.mqtt_connections = this.convertValues(
        source["mqtt_connections"],
        MqttConnection
      );
      this.created_on = this.convertValues(source["created_on"], null);
      this.updated_on = this.convertValues(source["updated_on"], null);
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
  export class ConsumerHistory {
    uuid: string;
    consumer_uuid: string;
    producer_uuid: string;
    data_store: number[];
    // Go type: time.Time
    timestamp: any;

    static createFrom(source: any = {}) {
      return new ConsumerHistory(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.uuid = source["uuid"];
      this.consumer_uuid = source["consumer_uuid"];
      this.producer_uuid = source["producer_uuid"];
      this.data_store = source["data_store"];
      this.timestamp = this.convertValues(source["timestamp"], null);
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
  export class Writer {
    uuid: string;
    sync_uuid: string;
    writer_thing_class?: string;
    writer_thing_type?: string;
    writer_thing_uuid?: string;
    writer_thing_name?: string;
    data_store?: number[];
    connection: string;
    message: string;
    // Go type: time.Time
    created_on?: any;
    // Go type: time.Time
    updated_on?: any;
    consumer_uuid?: string;
    present_value?: number;

    static createFrom(source: any = {}) {
      return new Writer(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.uuid = source["uuid"];
      this.sync_uuid = source["sync_uuid"];
      this.writer_thing_class = source["writer_thing_class"];
      this.writer_thing_type = source["writer_thing_type"];
      this.writer_thing_uuid = source["writer_thing_uuid"];
      this.writer_thing_name = source["writer_thing_name"];
      this.data_store = source["data_store"];
      this.connection = source["connection"];
      this.message = source["message"];
      this.created_on = this.convertValues(source["created_on"], null);
      this.updated_on = this.convertValues(source["updated_on"], null);
      this.consumer_uuid = source["consumer_uuid"];
      this.present_value = source["present_value"];
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
  export class Consumer {
    uuid: string;
    name: string;
    description?: string;
    enable?: boolean;
    sync_uuid: string;
    producer_uuid?: string;
    producer_thing_name?: string;
    producer_thing_uuid?: string;
    producer_thing_class?: string;
    producer_thing_type?: string;
    producer_thing_ref?: string;
    consumer_application?: string;
    current_writer_uuid?: string;
    stream_clone_uuid?: string;
    data_store?: number[];
    writers?: Writer[];
    consumer_histories?: ConsumerHistory[];
    tags?: Tag[];
    connection: string;
    message: string;
    // Go type: time.Time
    created_on?: any;
    // Go type: time.Time
    updated_on?: any;

    static createFrom(source: any = {}) {
      return new Consumer(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.uuid = source["uuid"];
      this.name = source["name"];
      this.description = source["description"];
      this.enable = source["enable"];
      this.sync_uuid = source["sync_uuid"];
      this.producer_uuid = source["producer_uuid"];
      this.producer_thing_name = source["producer_thing_name"];
      this.producer_thing_uuid = source["producer_thing_uuid"];
      this.producer_thing_class = source["producer_thing_class"];
      this.producer_thing_type = source["producer_thing_type"];
      this.producer_thing_ref = source["producer_thing_ref"];
      this.consumer_application = source["consumer_application"];
      this.current_writer_uuid = source["current_writer_uuid"];
      this.stream_clone_uuid = source["stream_clone_uuid"];
      this.data_store = source["data_store"];
      this.writers = this.convertValues(source["writers"], Writer);
      this.consumer_histories = this.convertValues(
        source["consumer_histories"],
        ConsumerHistory
      );
      this.tags = this.convertValues(source["tags"], Tag);
      this.connection = source["connection"];
      this.message = source["message"];
      this.created_on = this.convertValues(source["created_on"], null);
      this.updated_on = this.convertValues(source["updated_on"], null);
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
  export class StreamClone {
    uuid: string;
    sync_uuid: string;
    name: string;
    description?: string;
    enable?: boolean;
    // Go type: time.Time
    created_on?: any;
    // Go type: time.Time
    updated_on?: any;
    source_uuid: string;
    connection: string;
    message: string;
    flow_network_clone_uuid: string;
    consumers: Consumer[];
    tags: Tag[];

    static createFrom(source: any = {}) {
      return new StreamClone(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.uuid = source["uuid"];
      this.sync_uuid = source["sync_uuid"];
      this.name = source["name"];
      this.description = source["description"];
      this.enable = source["enable"];
      this.created_on = this.convertValues(source["created_on"], null);
      this.updated_on = this.convertValues(source["updated_on"], null);
      this.source_uuid = source["source_uuid"];
      this.connection = source["connection"];
      this.message = source["message"];
      this.flow_network_clone_uuid = source["flow_network_clone_uuid"];
      this.consumers = this.convertValues(source["consumers"], Consumer);
      this.tags = this.convertValues(source["tags"], Tag);
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
  export class CommandGroup {
    uuid: string;
    name: string;
    enable?: boolean;
    description?: string;
    command_use?: string;
    stream_uuid?: string;
    write_value?: string;
    write_priority?: string;
    write_priority_array?: string;
    write_json?: string;
    start_date?: string;
    end_date?: string;
    value?: string;
    priority?: string;
    // Go type: time.Time
    created_on?: any;
    // Go type: time.Time
    updated_on?: any;

    static createFrom(source: any = {}) {
      return new CommandGroup(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.uuid = source["uuid"];
      this.name = source["name"];
      this.enable = source["enable"];
      this.description = source["description"];
      this.command_use = source["command_use"];
      this.stream_uuid = source["stream_uuid"];
      this.write_value = source["write_value"];
      this.write_priority = source["write_priority"];
      this.write_priority_array = source["write_priority_array"];
      this.write_json = source["write_json"];
      this.start_date = source["start_date"];
      this.end_date = source["end_date"];
      this.value = source["value"];
      this.priority = source["priority"];
      this.created_on = this.convertValues(source["created_on"], null);
      this.updated_on = this.convertValues(source["updated_on"], null);
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
  export class ProducerHistory {
    id: number;
    producer_uuid?: string;
    current_writer_uuid: string;
    present_value?: number;
    data_store?: number[];
    // Go type: time.Time
    timestamp?: any;

    static createFrom(source: any = {}) {
      return new ProducerHistory(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.id = source["id"];
      this.producer_uuid = source["producer_uuid"];
      this.current_writer_uuid = source["current_writer_uuid"];
      this.present_value = source["present_value"];
      this.data_store = source["data_store"];
      this.timestamp = this.convertValues(source["timestamp"], null);
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
  export class WriterClone {
    uuid: string;
    sync_uuid: string;
    writer_thing_class?: string;
    writer_thing_type?: string;
    writer_thing_uuid?: string;
    writer_thing_name?: string;
    data_store?: number[];
    connection: string;
    message: string;
    // Go type: time.Time
    created_on?: any;
    // Go type: time.Time
    updated_on?: any;
    producer_uuid: string;
    flow_framework_uuid?: string;
    source_uuid: string;

    static createFrom(source: any = {}) {
      return new WriterClone(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.uuid = source["uuid"];
      this.sync_uuid = source["sync_uuid"];
      this.writer_thing_class = source["writer_thing_class"];
      this.writer_thing_type = source["writer_thing_type"];
      this.writer_thing_uuid = source["writer_thing_uuid"];
      this.writer_thing_name = source["writer_thing_name"];
      this.data_store = source["data_store"];
      this.connection = source["connection"];
      this.message = source["message"];
      this.created_on = this.convertValues(source["created_on"], null);
      this.updated_on = this.convertValues(source["updated_on"], null);
      this.producer_uuid = source["producer_uuid"];
      this.flow_framework_uuid = source["flow_framework_uuid"];
      this.source_uuid = source["source_uuid"];
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
  export class Producer {
    uuid: string;
    name: string;
    description?: string;
    enable?: boolean;
    sync_uuid: string;
    producer_thing_name?: string;
    producer_thing_uuid?: string;
    producer_thing_class?: string;
    producer_thing_type?: string;
    producer_application?: string;
    current_writer_uuid: string;
    enable_history?: boolean;
    stream_uuid?: string;
    writer_clones?: WriterClone[];
    producer_histories?: ProducerHistory[];
    tags?: Tag[];
    history_type?: string;
    history_interval?: number;
    // Go type: time.Time
    created_on?: any;
    // Go type: time.Time
    updated_on?: any;

    static createFrom(source: any = {}) {
      return new Producer(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.uuid = source["uuid"];
      this.name = source["name"];
      this.description = source["description"];
      this.enable = source["enable"];
      this.sync_uuid = source["sync_uuid"];
      this.producer_thing_name = source["producer_thing_name"];
      this.producer_thing_uuid = source["producer_thing_uuid"];
      this.producer_thing_class = source["producer_thing_class"];
      this.producer_thing_type = source["producer_thing_type"];
      this.producer_application = source["producer_application"];
      this.current_writer_uuid = source["current_writer_uuid"];
      this.enable_history = source["enable_history"];
      this.stream_uuid = source["stream_uuid"];
      this.writer_clones = this.convertValues(
        source["writer_clones"],
        WriterClone
      );
      this.producer_histories = this.convertValues(
        source["producer_histories"],
        ProducerHistory
      );
      this.tags = this.convertValues(source["tags"], Tag);
      this.history_type = source["history_type"];
      this.history_interval = source["history_interval"];
      this.created_on = this.convertValues(source["created_on"], null);
      this.updated_on = this.convertValues(source["updated_on"], null);
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
  export class FlowNetwork {
    uuid: string;
    sync_uuid: string;
    name: string;
    description?: string;
    global_uuid?: string;
    client_id?: string;
    client_name?: string;
    site_id?: string;
    site_name?: string;
    device_id?: string;
    device_name?: string;
    is_remote?: boolean;
    fetch_histories?: boolean;
    fetch_hist_frequency?: number;
    delete_histories_on_fetch?: boolean;
    is_master_slave?: boolean;
    flow_https?: boolean;
    flow_username?: string;
    flow_password?: string;
    flow_token?: string;
    is_token_auth?: boolean;
    is_error?: boolean;
    error_msg?: string;
    connection: string;
    message: string;
    // Go type: time.Time
    created_on?: any;
    // Go type: time.Time
    updated_on?: any;
    flow_network_parent_uuid: string;
    flow_ip?: string;
    flow_port?: number;
    flow_token_local?: string;
    streams: Stream[];

    static createFrom(source: any = {}) {
      return new FlowNetwork(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.uuid = source["uuid"];
      this.sync_uuid = source["sync_uuid"];
      this.name = source["name"];
      this.description = source["description"];
      this.global_uuid = source["global_uuid"];
      this.client_id = source["client_id"];
      this.client_name = source["client_name"];
      this.site_id = source["site_id"];
      this.site_name = source["site_name"];
      this.device_id = source["device_id"];
      this.device_name = source["device_name"];
      this.is_remote = source["is_remote"];
      this.fetch_histories = source["fetch_histories"];
      this.fetch_hist_frequency = source["fetch_hist_frequency"];
      this.delete_histories_on_fetch = source["delete_histories_on_fetch"];
      this.is_master_slave = source["is_master_slave"];
      this.flow_https = source["flow_https"];
      this.flow_username = source["flow_username"];
      this.flow_password = source["flow_password"];
      this.flow_token = source["flow_token"];
      this.is_token_auth = source["is_token_auth"];
      this.is_error = source["is_error"];
      this.error_msg = source["error_msg"];
      this.connection = source["connection"];
      this.message = source["message"];
      this.created_on = this.convertValues(source["created_on"], null);
      this.updated_on = this.convertValues(source["updated_on"], null);
      this.flow_network_parent_uuid = source["flow_network_parent_uuid"];
      this.flow_ip = source["flow_ip"];
      this.flow_port = source["flow_port"];
      this.flow_token_local = source["flow_token_local"];
      this.streams = this.convertValues(source["streams"], Stream);
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
  export class Stream {
    uuid: string;
    sync_uuid: string;
    name: string;
    description?: string;
    enable?: boolean;
    // Go type: time.Time
    created_on?: any;
    // Go type: time.Time
    updated_on?: any;
    flow_networks: FlowNetwork[];
    producers: Producer[];
    command_groups: CommandGroup[];
    tags: Tag[];

    static createFrom(source: any = {}) {
      return new Stream(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.uuid = source["uuid"];
      this.sync_uuid = source["sync_uuid"];
      this.name = source["name"];
      this.description = source["description"];
      this.enable = source["enable"];
      this.created_on = this.convertValues(source["created_on"], null);
      this.updated_on = this.convertValues(source["updated_on"], null);
      this.flow_networks = this.convertValues(
        source["flow_networks"],
        FlowNetwork
      );
      this.producers = this.convertValues(source["producers"], Producer);
      this.command_groups = this.convertValues(
        source["command_groups"],
        CommandGroup
      );
      this.tags = this.convertValues(source["tags"], Tag);
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
  export class Tag {
    tag: string;
    networks?: Network[];
    devices?: Device[];
    points?: Point[];
    streams?: Stream[];
    stream_clones?: StreamClone[];
    producers?: Producer[];
    consumers?: Consumer[];

    static createFrom(source: any = {}) {
      return new Tag(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.tag = source["tag"];
      this.networks = this.convertValues(source["networks"], Network);
      this.devices = this.convertValues(source["devices"], Device);
      this.points = this.convertValues(source["points"], Point);
      this.streams = this.convertValues(source["streams"], Stream);
      this.stream_clones = this.convertValues(
        source["stream_clones"],
        StreamClone
      );
      this.producers = this.convertValues(source["producers"], Producer);
      this.consumers = this.convertValues(source["consumers"], Consumer);
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
  export class Priority {
    point_uuid?: string;
    _1?: number;
    _2?: number;
    _3?: number;
    _4?: number;
    _5?: number;
    _6?: number;
    _7?: number;
    _8?: number;
    _9?: number;
    _10?: number;
    _11?: number;
    _12?: number;
    _13?: number;
    _14?: number;
    _15?: number;
    _16?: number;

    static createFrom(source: any = {}) {
      return new Priority(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.point_uuid = source["point_uuid"];
      this._1 = source["_1"];
      this._2 = source["_2"];
      this._3 = source["_3"];
      this._4 = source["_4"];
      this._5 = source["_5"];
      this._6 = source["_6"];
      this._7 = source["_7"];
      this._8 = source["_8"];
      this._9 = source["_9"];
      this._10 = source["_10"];
      this._11 = source["_11"];
      this._12 = source["_12"];
      this._13 = source["_13"];
      this._14 = source["_14"];
      this._15 = source["_15"];
      this._16 = source["_16"];
    }
  }
  export class Point {
    uuid: string;
    name: string;
    description?: string;
    enable?: boolean;
    // Go type: time.Time
    created_on?: any;
    // Go type: time.Time
    updated_on?: any;
    thing_class?: string;
    thing_reference?: string;
    thing_type?: string;
    fault?: boolean;
    message_level?: string;
    message_code?: string;
    message?: string;
    // Go type: time.Time
    last_ok?: any;
    // Go type: time.Time
    last_fail?: any;
    present_value?: number;
    original_value?: number;
    write_value?: number;
    write_value_original?: number;
    current_priority?: number;
    write_priority?: number;
    is_output?: boolean;
    is_type_bool?: boolean;
    in_sync?: boolean;
    fallback?: number;
    device_uuid?: string;
    writeable?: boolean;
    math_on_present_value?: string;
    math_on_write_value?: string;
    cov?: number;
    object_type?: string;
    object_id?: number;
    data_type?: string;
    object_encoding?: string;
    io_number?: string;
    io_type?: string;
    address_id?: number;
    address_length?: number;
    address_uuid?: string;
    use_next_available_address?: boolean;
    decimal?: number;
    limit_min?: number;
    limit_max?: number;
    scale_in_min?: number;
    scale_in_max?: number;
    scale_out_min?: number;
    scale_out_max?: number;
    unit_type?: string;
    unit?: string;
    unit_to?: string;
    is_producer?: boolean;
    is_consumer?: boolean;
    // Go type: Priority
    priority?: any;
    tags?: Tag[];
    value_updated_flag?: boolean;
    point_priority_use_type?: string;
    write_mode?: string;
    write_required?: boolean;
    read_required?: boolean;
    poll_priority: string;
    poll_rate: string;

    static createFrom(source: any = {}) {
      return new Point(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.uuid = source["uuid"];
      this.name = source["name"];
      this.description = source["description"];
      this.enable = source["enable"];
      this.created_on = this.convertValues(source["created_on"], null);
      this.updated_on = this.convertValues(source["updated_on"], null);
      this.thing_class = source["thing_class"];
      this.thing_reference = source["thing_reference"];
      this.thing_type = source["thing_type"];
      this.fault = source["fault"];
      this.message_level = source["message_level"];
      this.message_code = source["message_code"];
      this.message = source["message"];
      this.last_ok = this.convertValues(source["last_ok"], null);
      this.last_fail = this.convertValues(source["last_fail"], null);
      this.present_value = source["present_value"];
      this.original_value = source["original_value"];
      this.write_value = source["write_value"];
      this.write_value_original = source["write_value_original"];
      this.current_priority = source["current_priority"];
      this.write_priority = source["write_priority"];
      this.is_output = source["is_output"];
      this.is_type_bool = source["is_type_bool"];
      this.in_sync = source["in_sync"];
      this.fallback = source["fallback"];
      this.device_uuid = source["device_uuid"];
      this.writeable = source["writeable"];
      this.math_on_present_value = source["math_on_present_value"];
      this.math_on_write_value = source["math_on_write_value"];
      this.cov = source["cov"];
      this.object_type = source["object_type"];
      this.object_id = source["object_id"];
      this.data_type = source["data_type"];
      this.object_encoding = source["object_encoding"];
      this.io_number = source["io_number"];
      this.io_type = source["io_type"];
      this.address_id = source["address_id"];
      this.address_length = source["address_length"];
      this.address_uuid = source["address_uuid"];
      this.use_next_available_address = source["use_next_available_address"];
      this.decimal = source["decimal"];
      this.limit_min = source["limit_min"];
      this.limit_max = source["limit_max"];
      this.scale_in_min = source["scale_in_min"];
      this.scale_in_max = source["scale_in_max"];
      this.scale_out_min = source["scale_out_min"];
      this.scale_out_max = source["scale_out_max"];
      this.unit_type = source["unit_type"];
      this.unit = source["unit"];
      this.unit_to = source["unit_to"];
      this.is_producer = source["is_producer"];
      this.is_consumer = source["is_consumer"];
      this.priority = this.convertValues(source["priority"], null);
      this.tags = this.convertValues(source["tags"], Tag);
      this.value_updated_flag = source["value_updated_flag"];
      this.point_priority_use_type = source["point_priority_use_type"];
      this.write_mode = source["write_mode"];
      this.write_required = source["write_required"];
      this.read_required = source["read_required"];
      this.poll_priority = source["poll_priority"];
      this.poll_rate = source["poll_rate"];
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
  export class Device {
    uuid: string;
    name: string;
    description?: string;
    enable?: boolean;
    fault?: boolean;
    message_level?: string;
    message_code?: string;
    message?: string;
    // Go type: time.Time
    last_ok?: any;
    // Go type: time.Time
    last_fail?: any;
    // Go type: time.Time
    created_on?: any;
    // Go type: time.Time
    updated_on?: any;
    thing_class?: string;
    thing_reference?: string;
    thing_type?: string;
    manufacture?: string;
    model?: string;
    address_id?: number;
    zero_mode?: boolean;
    poll_delay_points_ms: number;
    address_uuid?: string;
    host?: string;
    port?: number;
    device_mac?: number;
    device_object_id?: number;
    network_number?: number;
    max_adpu?: number;
    segmentation?: string;
    device_mask?: number;
    type_serial?: boolean;
    transport_type?: string;
    supports_rpm?: boolean;
    supports_wpm?: boolean;
    network_uuid?: string;
    number_of_devices_permitted?: number;
    points?: Point[];
    tags?: Tag[];
    fast_poll_rate?: number;
    normal_poll_rate?: number;
    slow_poll_rate?: number;

    static createFrom(source: any = {}) {
      return new Device(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.uuid = source["uuid"];
      this.name = source["name"];
      this.description = source["description"];
      this.enable = source["enable"];
      this.fault = source["fault"];
      this.message_level = source["message_level"];
      this.message_code = source["message_code"];
      this.message = source["message"];
      this.last_ok = this.convertValues(source["last_ok"], null);
      this.last_fail = this.convertValues(source["last_fail"], null);
      this.created_on = this.convertValues(source["created_on"], null);
      this.updated_on = this.convertValues(source["updated_on"], null);
      this.thing_class = source["thing_class"];
      this.thing_reference = source["thing_reference"];
      this.thing_type = source["thing_type"];
      this.manufacture = source["manufacture"];
      this.model = source["model"];
      this.address_id = source["address_id"];
      this.zero_mode = source["zero_mode"];
      this.poll_delay_points_ms = source["poll_delay_points_ms"];
      this.address_uuid = source["address_uuid"];
      this.host = source["host"];
      this.port = source["port"];
      this.device_mac = source["device_mac"];
      this.device_object_id = source["device_object_id"];
      this.network_number = source["network_number"];
      this.max_adpu = source["max_adpu"];
      this.segmentation = source["segmentation"];
      this.device_mask = source["device_mask"];
      this.type_serial = source["type_serial"];
      this.transport_type = source["transport_type"];
      this.supports_rpm = source["supports_rpm"];
      this.supports_wpm = source["supports_wpm"];
      this.network_uuid = source["network_uuid"];
      this.number_of_devices_permitted = source["number_of_devices_permitted"];
      this.points = this.convertValues(source["points"], Point);
      this.tags = this.convertValues(source["tags"], Tag);
      this.fast_poll_rate = source["fast_poll_rate"];
      this.normal_poll_rate = source["normal_poll_rate"];
      this.slow_poll_rate = source["slow_poll_rate"];
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
  export class Network {
    uuid: string;
    name: string;
    description?: string;
    enable?: boolean;
    fault?: boolean;
    message_level?: string;
    message_code?: string;
    message?: string;
    // Go type: time.Time
    last_ok?: any;
    // Go type: time.Time
    last_fail?: any;
    // Go type: time.Time
    created_on?: any;
    // Go type: time.Time
    updated_on?: any;
    manufacture?: string;
    model?: string;
    writeable_network?: boolean;
    thing_class?: string;
    thing_reference?: string;
    thing_type?: string;
    transport_type?: string;
    plugin_conf_id?: string;
    plugin_name?: string;
    auto_mapping_networks_selection: string;
    auto_mapping_flow_network_uuid: string;
    auto_mapping_flow_network_name: string;
    auto_mapping_enable_histories?: boolean;
    number_of_networks_permitted?: number;
    network_interface: string;
    ip: string;
    port?: number;
    network_mask?: number;
    address_id: string;
    address_uuid: string;
    serial_port?: string;
    serial_baud_rate?: number;
    serial_stop_bits?: number;
    serial_parity?: string;
    serial_data_bits?: number;
    serial_timeout?: number;
    serial_connected?: boolean;
    host?: string;
    devices?: Device[];
    tags?: Tag[];
    max_poll_rate?: number;

    static createFrom(source: any = {}) {
      return new Network(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.uuid = source["uuid"];
      this.name = source["name"];
      this.description = source["description"];
      this.enable = source["enable"];
      this.fault = source["fault"];
      this.message_level = source["message_level"];
      this.message_code = source["message_code"];
      this.message = source["message"];
      this.last_ok = this.convertValues(source["last_ok"], null);
      this.last_fail = this.convertValues(source["last_fail"], null);
      this.created_on = this.convertValues(source["created_on"], null);
      this.updated_on = this.convertValues(source["updated_on"], null);
      this.manufacture = source["manufacture"];
      this.model = source["model"];
      this.writeable_network = source["writeable_network"];
      this.thing_class = source["thing_class"];
      this.thing_reference = source["thing_reference"];
      this.thing_type = source["thing_type"];
      this.transport_type = source["transport_type"];
      this.plugin_conf_id = source["plugin_conf_id"];
      this.plugin_name = source["plugin_name"];
      this.auto_mapping_networks_selection =
        source["auto_mapping_networks_selection"];
      this.auto_mapping_flow_network_uuid =
        source["auto_mapping_flow_network_uuid"];
      this.auto_mapping_flow_network_name =
        source["auto_mapping_flow_network_name"];
      this.auto_mapping_enable_histories =
        source["auto_mapping_enable_histories"];
      this.number_of_networks_permitted =
        source["number_of_networks_permitted"];
      this.network_interface = source["network_interface"];
      this.ip = source["ip"];
      this.port = source["port"];
      this.network_mask = source["network_mask"];
      this.address_id = source["address_id"];
      this.address_uuid = source["address_uuid"];
      this.serial_port = source["serial_port"];
      this.serial_baud_rate = source["serial_baud_rate"];
      this.serial_stop_bits = source["serial_stop_bits"];
      this.serial_parity = source["serial_parity"];
      this.serial_data_bits = source["serial_data_bits"];
      this.serial_timeout = source["serial_timeout"];
      this.serial_connected = source["serial_connected"];
      this.host = source["host"];
      this.devices = this.convertValues(source["devices"], Device);
      this.tags = this.convertValues(source["tags"], Tag);
      this.max_poll_rate = source["max_poll_rate"];
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
  export class PluginConf {
    uuid: string;
    name: string;
    module_path: string;
    enabled: boolean;
    has_network: boolean;
    networks: Network;
    // Go type: Integration
    integration: any;
    jobs: Job[];

    static createFrom(source: any = {}) {
      return new PluginConf(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.uuid = source["uuid"];
      this.name = source["name"];
      this.module_path = source["module_path"];
      this.enabled = source["enabled"];
      this.has_network = source["has_network"];
      this.networks = this.convertValues(source["networks"], Network);
      this.integration = this.convertValues(source["integration"], null);
      this.jobs = this.convertValues(source["jobs"], Job);
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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

export namespace assistmodel {
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
    wires_port: number;
    ssh_port: number;
    ssh_username: string;
    ssh_password: string;
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
      if ("string" === typeof source) source = JSON.parse(source);
      this.uuid = source["uuid"];
      this.name = source["name"];
      this.network_uuid = source["network_uuid"];
      this.enable = source["enable"];
      this.ip = source["ip"];
      this.port = source["port"];
      this.https = source["https"];
      this.username = source["username"];
      this.password = source["password"];
      this.wires_port = source["wires_port"];
      this.ssh_port = source["ssh_port"];
      this.ssh_username = source["ssh_username"];
      this.ssh_password = source["ssh_password"];
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
      if ("string" === typeof source) source = JSON.parse(source);
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
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
      if ("string" === typeof source) source = JSON.parse(source);
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
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
      if ("string" === typeof source) source = JSON.parse(source);
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
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
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
