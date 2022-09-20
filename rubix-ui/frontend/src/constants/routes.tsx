interface ROUTE {
  [name: string]: string;
}

export const ROUTES: ROUTE = {
  ROOT: "/",
  LOGS: "/logs",
  BACKUPS: "/backups",
  DOCS: "/docs",
  DOCS_SOFTWARE: "/software",
  DOCS_DIPS: "/switch",
  APP_STORE: "/app-store",
  NETWORKING: "/networking",
  RUBIX_FLOW: "/rubix-flow",
  FLOW_DEVICES: "/flow/networks/:networkUUID",
  FLOW_POINTS: "/flow/devices/:deviceUUID",
  CONNECTIONS: "/connections",
  LOCATIONS: "/connections/:connUUID/locations",
  LOCATION_NETWORKS: "/connections/:connUUID/locations/:locUUID/networks",
  LOCATION_NETWORK_HOSTS:
    "/connections/:connUUID/locations/:locUUID/networks/:netUUID/hosts",
  HOST: "/connections/:connUUID/locations/:locUUID/networks/:netUUID/hosts/:hostUUID",
  DEVICES:
    "/connections/:connUUID/locations/:locUUID/networks/:netUUID/hosts/:hostUUID/plugins/:pluginName/rf-networks/:networkUUID/rf-devices",
  POINTS:
    "/connections/:connUUID/locations/:locUUID/networks/:netUUID/hosts/:hostUUID/plugins/:pluginName/rf-networks/:networkUUID/rf-devices/:deviceUUID/rf-points",
  STREAMS:
    "/connections/:connUUID/locations/:locUUID/networks/:netUUID/hosts/:hostUUID/fl-networks/:flNetworkUUID/streams",
  PRODUCERS:
    "/connections/:connUUID/locations/:locUUID/networks/:netUUID/hosts/:hostUUID/fl-networks/:flNetworkUUID/streams/:streamUUID/producers",
  STREAMCLONES:
    "/connections/:connUUID/locations/:locUUID/networks/:netUUID/hosts/:hostUUID/fl-networks-clone/:flNetworkCloneUUID/streams-clone",
  CONSUMERS:
    "/connections/:connUUID/locations/:locUUID/networks/:netUUID/hosts/:hostUUID/fl-networks-clone/:flNetworkCloneUUID/streams/:streamCloneUUID/consumers",
  WRITERS:
    "/connections/:connUUID/locations/:locUUID/networks/:netUUID/hosts/:hostUUID/fl-networks-clone/:flNetworkCloneUUID/streams-clone/:streamCloneUUID/consumers/:consumerUUID/writers",
  WRITERCLONES:
    "/connections/:connUUID/locations/:locUUID/networks/:netUUID/hosts/:hostUUID/fl-networks/:flNetworkUUID/streams/:streamUUID/producers/:producerUUID/writer-clones",
};
