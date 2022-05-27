import {useState} from 'react';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import {host} from "./components/hosts/host";




function App() {

    return (
        <div id="App">
            <div>
                <host.addHost />
            </div>
        </div>
    )
}

export default App