import React from "react";
import {
  Button,
  Col,
  Row,
  Select,
  Table,
  Input,
  Tabs,
  Empty,
  Spin,
  Popover,
  DatePicker,
} from "antd";
import { Actions, CustomModal } from "../config";
import axios from "axios";
import SavedJobs from "./saved_jobs";
import moment from "moment";

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
  const [searchKey, setSearchKey] = React.useState("");
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [date, setDate] = React.useState({
    startDate: null,
    endDate: null,
  });

  let params;

  selected.map((item) => {
    if (selected.length === 1 && selected.includes(item))
      return (params = `&webPageId=${item}`);
    else return (params = " ");
  });

  const getData = () => {
    axios
      .get(
        `http://34.154.105.51:8080/api/v1/jobs?offset=0&limit=1000&saved=false${params}`
      )
      .then((res) => {
        setData(res.data);
      });
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      defaultSortOrder: "ascend",
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
        return <CustomModal record={record} />;
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
      title: "Date",
      dataIndex: "articleDate",
      key: "articleDate",
    },
    {
      title: "My Comments",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <Popover
            placement="bottom"
            trigger="click"
            content={
              <Row>
                <Col xs={24}>
                  <Button
                    type="link"
                    onClick={() => {
                      window.open(record?.url);
                    }}
                  >
                    View Details
                  </Button>
                </Col>
                <Col xs={24}>
                  <Actions record={record} getData={getData} />
                </Col>
              </Row>
            }
          >
            <Button>More Actions</Button>
          </Popover>
        );
      },
    },
  ];

  const handleClick = () => {
    getData();
  };

  const onProcess = () => {
    setLoading(true);
    axios.post("http://34.154.105.51:8080/api/v1/jobs/process-all").then(() => {
      getData();
      setLoading(false);
    });
  };

  const handleChange = (attr) => (e) => {
    const value = moment(e, "DD.MM.YYYY").format();
    setDate((prev) => ({
      ...prev,
      [attr]: value,
    }));
  };

  let searchedData = data;

  if (searchKey)
    searchedData = data.filter((item) => {
      return (
        (item.title &&
          item.title
            .toString()
            .toLowerCase()
            .includes(searchKey.toLowerCase())) ||
        (item.category &&
          item.category
            .toString()
            .toLowerCase()
            .includes(searchKey.toLowerCase())) ||
        (item.location &&
          item.location
            .toString()
            .toLowerCase()
            .includes(searchKey.toLowerCase())) ||
        (item.language &&
          item.language
            .toString()
            .toLowerCase()
            .includes(searchKey.toLowerCase()))
      );
    });
  else if (date.startDate && date.endDate)
    searchedData = data.filter((item) => {
      const value = moment(item.articleDate, "DD.MM.YYYY").format();
      return value > date.startDate && value < date.endDate;
    });
  else searchedData = data;

  return (
    <Row gutter={[16, 16]} align="middle" justify="center">
      <Col>
        <h1>Select University</h1>
      </Col>
      <Col xs={24}>
        <Row justify="center" align="middle" gutter={[8, 8]}>
          <Col xs={24} sm={8}>
            <Select
              allowClear
              mode="multiple"
              onChange={(e) => setSelected(e)}
              placeholder="Select University"
              style={{
                width: "100%",
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
            <Button
              type="primary"
              disabled={!selected.length}
              onClick={handleClick}
            >
              Get Data
            </Button>
          </Col>
          <Col>
            <Button onClick={onProcess} disabled={!data.length}>
              Process New Jobs
            </Button>
          </Col>
        </Row>
      </Col>
      <Col xs={24}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="All Jobs" key="1">
            {data.length === 0 ? (
              <Empty />
            ) : (
              <Spin spinning={loading}>
                <Row gutter={[8, 8]}>
                  <Col xs={24}>
                    <Row gutter={8}>
                      <Col flex="auto">
                        <Row>
                          <Col xs={24}>Search</Col>
                          <Col xs={24}>
                            <Input.Search
                              placeholder="Search By Job Title,Category,Language or Location"
                              onChange={(e) => setSearchKey(e.target.value)}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Row gutter={8}>
                          <Col xs={12}>
                            <Row>
                              <Col xs={24}>From Date</Col>
                              <Col xs={24}>
                                <DatePicker
                                  onChange={handleChange("startDate")}
                                  style={{ width: "100%" }}
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col xs={12}>
                            <Row>
                              <Col xs={24}>To Date</Col>
                              <Col xs={24}>
                                <DatePicker
                                  onChange={handleChange("endDate")}
                                  style={{ width: "100%" }}
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={24}>
                    <Table
                      style={{ overflow: "auto" }}
                      columns={columns}
                      dataSource={searchedData}
                    />
                  </Col>
                </Row>
              </Spin>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Saved Jobs" key="2">
            <SavedJobs />
          </Tabs.TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default Content;
