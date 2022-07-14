
import ReactMarkdown from "react-markdown";

import image from "../../assets/images/Edge-iO-28.png";


export const DocsSoftware = () => {

    // ![title](../src/assets/images/icon-hardware.png")
    const markdown = `

#  Rubix Products 
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

# Guides



#### GLOBAL
\`\`\`
 -Config: Globals                       - (FC 3,6,16)
     type: UINT16

   -[10001] : Version MAJOR                     (r)
   -[10002] : Version MINOR                     (r)
   -[10003] : Dev Build ID                      (r)
   -[10004] : Production Build                  (r)
   -[10005] : IO Persistence Enable             (r/w)
   -[10006] : IO Persistence Wipe               (r/w)
   -[10007] : Factory Reset                     (w)
   -[10008] : RTC Time            (INT32/DWORD) (r/w)
   -[10010] : RTC Timezone Offset (INT32/DWORD) (r/w)
   -[10012] : LoRa RSSI                         (r)
   -[10013] : Pulse Debounce MS                 (r/w)
   -[10014] : Modbus Watchdog Enable            (r/w)
   -[10015] : Modbus Watchdog Minutes           (r/w)

   -[10101] : Point References Lock             (r/w)
   -[10102] : Commissioning Mode                (r/w)
   -[10103] : App ID                            (r)
   -[10104] : App Version                       (r)
   -[10105] : App Revision                      (r)

\`\`\`

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


