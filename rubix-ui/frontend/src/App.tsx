import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { network} from "./components/hosts/network";
import {EventsOn} from "../wailsjs/runtime";


function App() {
    EventsOn("os-time", (val) => {
        console.log(val, "time")
    });

    return (
        <div id="App">
            <div>
                <network.NetwokrsComponent />
            </div>
        </div>
    )

}

export default App;
