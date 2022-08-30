import React from 'react';
import { Button, Col, Row, Select, Table, Input, Tabs, Empty, Spin, Popover } from "antd";
import { Actions, CustomModal } from "../config";
import axios from "axios";
import SavedJobs from "./saved_jobs";

const options = [
  {
    id: 1,
    key: "TUM",
    name: "Technische Universität Munich",
  },
  {
    id: 2,
    key: "TUB",
    name: "Technische Universität Berlin",
  },
];

const Content = () => {
  const [selected, setSelected] = React.useState([]);
  const [searchKey, setSearchKey] = React.useState('');
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false)

  const getData = () => {
    let params;

    if (selected.length === 1 && selected.includes('TUM'))
      params = `&webPageId=TUM`
    else if (selected.length === 1 && selected.includes('TUB'))
      params = `&webPageId=TUB`
    else
      params = ''

    axios
      .get(`http://34.154.105.51:8080/api/v1/jobs?offset=0&limit=1000&saved=false${params}`)
      .then((res) => {
        setData(res.data);
      });
  }

  const testColumns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Job Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Job Description",
      dataIndex: "jobDescription",
      key: "jobDescription",
      render: (record) => {
        return <CustomModal record={record}/>;
      },
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "My Comments",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: 'Actions',
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <Popover placement='bottom' trigger="click" content={<Row>
            <Col xs={24}>
              <Button type='link' onClick={() => {
                window.open(record?.url)
              }
              }>
                View Details
              </Button>
            </Col>
            <Col xs={24}>
              <Actions record={record} getData={getData}/>
            </Col>
          </Row>}>
            <Button>More Actions</Button>
          </Popover>
        )
      }
    }
  ];

  const handleClick = () => {
    getData()
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
      <Col xs={24}>
        <Row justify='center' align='middle' gutter={[8, 8]}>
          <Col>
            <Select
              allowClear
              mode="multiple"
              onChange={(e) => setSelected(e)}
              placeholder="Select University"
              style={{
                width: "300px",
              }}
            >
              {options.map((option) => (
                <Select.Option key={option.id} value={option.key}>
                  {option.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Button type='primary' disabled={!selected.length} onClick={handleClick}>Get Data</Button>
          </Col>
          <Col>
            <Button onClick={onProcess} disabled={!data.length}>Process New Jobs</Button>
          </Col>
        </Row>
      </Col>
      <Col xs={24}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab='All Jobs' key='1'>
            {data.length === 0 ? <Empty/> : (
              <Spin spinning={loading}>
                <Row gutter={[8, 8]}>
                  <Col xs={24}>
                    <Input.Search
                      placeholder="Search By Job Title,Category,Language or Location"
                      onChange={(e) => setSearchKey(e.target.value)}
                    />
                  </Col>
                  <Col xs={24}>
                    <Table
                      style={{overflow: 'auto'}}
                      columns={testColumns}
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