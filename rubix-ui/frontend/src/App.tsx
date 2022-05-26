import {useState} from 'react';
import logo from './assets/images/logo-universal.png';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import {Greet} from "../wailsjs/go/main/App";
import { Button } from 'antd';


function App() {
    const [resultText, setResultText] = useState("Please enter  below 👇");
    const [name, setName] = useState('');
    const updateName = (e: any) => setName(e.target.value);
    const updateResultText = (result: string) => setResultText(result);

    function greet() {
        Greet(name).then(updateResultText);
    }

    return (
        <div id="App">
            {/*<img src={logo} id="logo" alt="logo"/>*/}
            <div id="result" className="result">{resultText}</div>
            <div id="input" className="input-box">
                <input id="name" onChange={updateName} autoComplete="off" name="input" type="text"/>
                <Button
                    type="primary"
                    shape="round"
                    style={{ color: 'white', zIndex: 10 }}
                    onClick={e => { e.stopPropagation(); greet()}}
                >
                    X
                </Button>
            </div>
        </div>
    )
}

export default App