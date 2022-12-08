import { Card } from "antd";
import { rumodel } from "../../../../../wailsjs/go/models";

export const Completion = (props: ICompletion) => {
  const { loading, installResponse } = props;

  return (
    <Card style={{ marginTop: 10, marginBottom: 10 }}>
      {loading ? "Installing..." : installResponse.code == 0 ? "Completed!" : installResponse.msg}
    </Card>
  );
};

interface ICompletion {
  loading: boolean;
  installResponse: rumodel.Response;
}
