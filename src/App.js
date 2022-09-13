import React from "react";
import CustomContent from "./content";
import { Layout, Menu } from "antd";

const { Header, Content } = Layout;

const App = () => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <div className="logo" onClick={() => window.location.reload()} />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["home"]} />
      </Header>
      <Content className="site-layout" style={{ padding: "80px 20px" }}>
        <div className="site-layout-background">
          <CustomContent />
        </div>
      </Content>
    </Layout>
  );
};

export default App;
