import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { network } from "./components/hosts/network";
import { EventsOn } from "../wailsjs/runtime";
import { notification } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

const openNotificationWithIcon = (type: NotificationType, data: any) => {
  notification[type]({
    message: "message",
    description: data,
  });
};

function App() {
  EventsOn("ok", (val) => {
    console.log(val, "networks");
    openNotificationWithIcon("success", val);
  });

  EventsOn("err", (val) => {
    console.log(val, "networks");
    openNotificationWithIcon("error", val);
  });

  return (
    <div id="App">
      <div>
        <network.NetwokrsComponent />
      </div>
    </div>
  );
}

export default App;
