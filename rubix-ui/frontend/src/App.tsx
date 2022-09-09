import { Layout } from "antd";
import { useState, useEffect } from "react";
import { EventsOff, EventsOn } from "../wailsjs/runtime";
import AppRoutes from "./AppRoutes";
import { MenuSidebar } from "./components/sidebar/sidebar";
import { ThemeProvider } from "./themes/theme-provider";
import { openNotificationWithIcon } from "./utils/utils";
import "./App.css";
import "./index.css";

const { Content } = Layout;

const OK_EVENT = "ok";
const ERR_EVENT = "err";

const getParentKey = (key: React.Key, tree: any): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: any) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

const AppContainer = (props: any) => {
  return (
    <Layout>
      <MenuSidebar />
      <Layout style={{ padding: "0 24px 24px" }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  const [isRegistered, updateIsRegistered] = useState(false);

  useEffect(() => {
    registerNotification();

    return () => {
      EventsOff(OK_EVENT);
      EventsOff(ERR_EVENT);
    };
  }, []);

  const registerNotification = () => {
    if (isRegistered) {
      return;
    }

    updateIsRegistered(true);
    EventsOn(OK_EVENT, (val) => {
      openNotificationWithIcon("success", val);
    });

    EventsOn(ERR_EVENT, (val) => {
      openNotificationWithIcon("error", val);
    });
  };

  return (
    <ThemeProvider>
      <AppContainer>
        <AppRoutes></AppRoutes>
      </AppContainer>
    </ThemeProvider>
  );
};
export default App;
