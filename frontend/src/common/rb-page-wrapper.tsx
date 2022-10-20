import React from 'react';
import { Typography, Card } from "antd";

const { Title } = Typography;

type PageWrapperProps = {
  pageTitle: string;
  cardTitle?: string;
  children: React.ReactNode;
};

function PageWrapper(props: PageWrapperProps) {
  const { pageTitle, cardTitle, children } = props;
  return (
    <>
      <Title level={3} style={{ textAlign: "left" }}>
        {pageTitle}
      </Title>
      <Card type="inner" title={cardTitle}>
        {children}
      </Card>
    </>
  );
}

export default PageWrapper;
