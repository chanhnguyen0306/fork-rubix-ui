import { Col, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import PageWrapper from "../../common/rb-page-wrapper";
import { SettingsFactory } from "../settings/factory";
import { ReleasesFactory } from "./factory";
import AppTable from "./views/table";

let releasesFactory = new ReleasesFactory();
let settingsFactory = new SettingsFactory();

const { Option } = Select;

type AppStoreProps = {};

// TODO take this token from settings
const UUID = "set_123456789ABC";

function useReleases() {
  const [releases, updateReleases] = useState([] as any);
  const [token, updateToken] = useState("");
  const [isTokenValid, updateIsTokenValid] = useState(false);

  const fetchReleases = () => {
    return releasesFactory
      .GitReleases(token)
      .then((releases) => {
        updateReleases(releases);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchGitToken = () => {
    return settingsFactory
      .GitTokenDecoded(UUID)
      .then((token) => {
        updateToken(token);
        updateIsTokenValid(true);
      })
      .catch((err) => {
        updateIsTokenValid(false);
      });
  };
  useEffect(() => {
    fetchGitToken();
  }, []);

  useEffect(() => {
    if (isTokenValid) {
      fetchReleases();
    }
  }, [isTokenValid]);

  return {
    token,
    releases,
  };
}

function AppStore(props: AppStoreProps): React.ReactElement {
  const { token, releases } = useReleases();
  const [selectedRelease, updateSelectedRelease] = useState({});

  const onChange = (value: string) => {
    const release = releases.find((val: any) => val.name === value);
    if (!release) {
      return;
    }

    updateSelectedRelease({ ...release });
  };

  return (
    <PageWrapper pageTitle="App Store">
      <Row>
        <Col span={4}>
          <Select
            showSearch
            style={{width: '100%'}}
            placeholder="Select a version"
            optionFilterProp="children"
            onChange={onChange}
            filterOption={(input, option) =>
              (option!.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {releases.map((release: any) => (
              <Option key={release.name} value={release.name}>
                {release.name}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      <AppTable token={token} selectedRelease={selectedRelease} />
    </PageWrapper>
  );
}

export default AppStore;
