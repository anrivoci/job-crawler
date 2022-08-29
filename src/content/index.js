import React from 'react';
import { Button, Col, Row, Select, Table, Input, Tabs, Empty, Spin } from "antd";
import config from "../config";
import axios from "axios";
import SavedJobs from "./saved_jobs";

const options = [
  {
    id: 1,
    name: "TUM",
  },
  {
    id: 2,
    name: "TUB",
  },
];

const Content = () => {
  const [selected, setSelected] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [searchKey, setSearchKey] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const getData = (params) => {
    let newParams = params;
    if (!params)
      newParams = ''

    axios
      .get(
        `http://34.154.105.51:8080/api/v1/jobs?offset=0&limit=1000&saved=false${newParams}`
      )
      .then((res) => {
        setData(res?.data);
      });
  }

  const handleClick = () => {
    let params;

    if (selected.length === 1 && selected.includes("TUM"))
      params = "&webPageId=TUM";
    else if (selected.length === 1 && selected.includes("TUB"))
      params = "&webPageId=TUB";
    else if (selected.length === 2) params = " ";

    getData(params);
  };

  const handleChange = (e) => {
    setSelected(e);
  };

  const onProcess = () => {
    setLoading(true);
    axios.post('http://34.154.105.51:8080/api/v1/jobs/process-all').then(() => {
      getData();
      setLoading(false);
    })
  }

  let searchedData = data;

  if (searchKey)
    searchedData = data.filter((item) => {
      return item.title && item.title.toString().toLowerCase().includes(searchKey.toLowerCase()) ||
        item.category && item.category.toString().toLowerCase().includes(searchKey.toLowerCase()) ||
        item.location && item.location.toString().toLowerCase().includes(searchKey.toLowerCase()) ||
        item.language && item.language.toString().toLowerCase().includes(searchKey.toLowerCase())
    })

  return (
    <Row gutter={[16, 16]} align="middle" justify="center">
      <Col>
        <h1>Select University</h1>
      </Col>
      <Col xs={24} style={{display: 'flex', justifyContent: 'center', gap: 10}}>
        <Select
          onChange={handleChange}
          value={selected}
          allowClear
          placeholder="Select University"
          mode="multiple"
          style={{
            width: "300px",
          }}
        >
          {options.map((option) => (
            <Select.Option key={option.name} value={option.name}>
              {option.name}
            </Select.Option>
          ))}
        </Select>
        <Button type='primary' onClick={handleClick}>Get Data</Button>
        <Button onClick={onProcess} disabled={!data.length}>Process New Jobs</Button>
      </Col>
      <Col xs={24}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab='All Jobs' key='1'>
            {data.length === 0 ? <Empty/> : (
              <Spin spinning={loading}>
                <Row gutter={[8, 8]}>
                  <Col xs={24}>
                    <Input.Search
                      placeholder="Search By Title,Language,Location or Category"
                      onChange={(e) => setSearchKey(e.target.value)}
                    />
                  </Col>
                  <Col xs={24}>
                    <Table
                      columns={config}
                      dataSource={searchedData}
                    />
                  </Col>
                </Row>
              </Spin>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab='Saved Jobs' key='2'>
            <SavedJobs/>
          </Tabs.TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default Content;