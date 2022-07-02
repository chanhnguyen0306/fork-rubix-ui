
import { Descriptions} from "antd";
export const HostTable = (props: any) => {
  const {data} =
    props;
  return (
      <Descriptions title="Host Info">
        <Descriptions.Item label="uuid">{data.uuid}</Descriptions.Item>
        <Descriptions.Item label="name">{data.name}</Descriptions.Item>
      </Descriptions>
  );
};
