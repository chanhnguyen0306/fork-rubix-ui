import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { network } from "./components/hosts/network";

function App() {
  return (
    <div id="App">
      <div>
        <network.NetwokrsComponent />
      </div>
    </div>
  );
}

export default App;
