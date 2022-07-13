
import ReactMarkdown from "react-markdown";



export const DocsRubixHardware = () => {
    const markdown = `

# Rubix Products
There are two version of the rubix-compute range, one with IO (hardware inputs and outputs) and one without.
Logic programming can be done on the rubix-compute through an inbuilt program called  **[rubix-wires](https://desk.zoho.com.au/portal/nubeio/en/kb/articles/getting-started-guide-rubix-wires)**


## rubix-compute
link to doc **[rubix-compute](https://desk.zoho.com.au/portal/nubeio/en/kb/articles/rubix-compute-datasheet)**.


### basic specs

- &check; Web Based Programming through Wires
- &check; Multi Protocol (bacnet, modbus, database, mqtt, rest-api)
- &check; LoRaWan server
- &check; LoRa enabled
- &check; rs485 (2x off)
- &check; Rj45 network ports (2x off)
- &check; inbuilt histoires

### point count
- &cross; Max 100
- &cross; Max 500
- &check; Max 1000
- &cross; Max 2000



## rubix-compute-io

link to doc **[rubix-compute-io](https://desk.zoho.com.au/portal/nubeio/en/kb/articles/rubix-compute-io-datasheet)**.

### basic specs

- &check; Web Based Programming through Wires
- &check; Multi Protocol (bacnet, modbus, database, mqtt, rest-api)
- &check; LoRaWan server
- &check; LoRa enabled
- &check; rs485 (2x off)
- &check; Rj45 network ports (2x off)
- &check; inbuilt histoires

### point count
- &cross; Max 100
- &cross; Max 500
- &check; Max 1000
- &cross; Max 2000


### basic specs


- &cross; Web Based Programming through Wires
- &cross; Multi Protocol (bacnet, modbus, database, mqtt, rest-api)
- &cross; LoRaWan server
- &check; LoRa enabled
- &check; rs485 (1x off)
- &cross; Rj45 network ports (2x off)

### point count
- &cross; Max 100
- &cross; Max 500
- &check; Max 1000
- &cross; Max 2000


## IO-16
- link to doc **[IO-16](https://desk.zoho.com.au/portal/nubeio/en/kb/articles/rubix-io-installation-and-user-manual)**.



`

    return (
        <>
            <p style={{ textAlign: 'left' }} >
            <ReactMarkdown
                components={{
                    // Map `h1` (`# heading`) to use `h2`s.
                    h1: 'h1',
                    // Rewrite *will be blue*
                    em: ({node, ...props}) => <i style={{color: 'blue'}} {...props} />
                }}
                children={markdown}
            />
                </p>
        </>

    );
};


