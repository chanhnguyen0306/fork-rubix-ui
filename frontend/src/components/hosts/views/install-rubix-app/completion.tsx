import { Card } from "antd";

export const Completion = (props: ICompletion) => {
  const { loading } = props;

  return (
    <Card style={{ marginTop: 10, marginBottom: 10 }}>
      {loading ? "Installing..." : "Completed..."}
    </Card>
  );
};

interface ICompletion {
  loading: boolean;
}
