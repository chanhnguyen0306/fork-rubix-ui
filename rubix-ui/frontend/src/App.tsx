import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { location } from "./components/hosts/location";
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
        <location.LocationsComponent />
      </div>
    </div>
  );
}

export default App;
