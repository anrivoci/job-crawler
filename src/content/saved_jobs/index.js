import React from "react";
import axios from "axios";
import {
  Button,
  Col,
  Empty,
  Input,
  notification,
  Popover,
  Row,
  Table,
  DatePicker,
} from "antd";
import Modal from "antd/lib/modal";
import { CustomModal } from "../../config";
import moment from "moment";

const EditComment = ({ getData, record }) => {
  const [visible, setVisible] = React.useState(false);
  const [state, setState] = React.useState();

  const onChange = (e) => {
    setState(e.target.value);
  };

  const onSave = () => {
    axios
      .patch(`http://34.154.105.51:8080/api/v1/jobs/${record.id}`, {
        saved: true,
        comment: state,
      })
      .then(() => {
        setVisible(false);
        notification.success({
          message: "Edited Successfully",
        });
        getData();
      });
  };

  return (
    <>
      <Button type="link" onClick={() => setVisible(true)}>
        Edit Comment
      </Button>
      <Modal
        width={400}
        okText="Save"
        title="Edit Comment"
        onOk={onSave}
        onCancel={() => setVisible(false)}
        visible={visible}
      >
        <Input placeholder={record.comment} onChange={onChange} />
      </Modal>
    </>
  );
};

const SavedJobs = () => {
  const [data, setData] = React.useState([]);
  const [searchKey, setSearchKey] = React.useState("");
  const [date, setDate] = React.useState({
    startDate: null,
    endDate: null,
  });

  React.useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(
        `http://34.154.105.51:8080/api/v1/jobs?offset=0&limit=1000&saved=true`
      )
      .then((r) => setData(r.data));
  };

  const config = [
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
        const onRemove = () => {
          axios
            .patch(`https://34.154.105.51:443/api/v1/jobs/${record.id}`, {
              saved: false,
              comment: " ",
            })
            .then(() => {
              notification.success({
                message: "Notification Title",
              });
              getData();
            });
        };
        return (
          <Popover
            placement="bottom"
            content={
              <Row>
                <Col xs={24}>
                  <EditComment getData={getData} record={record} />
                </Col>
                <Col xs={24}>
                  <Button
                    type="link"
                    style={{ color: "lightcoral" }}
                    onClick={onRemove}
                  >
                    Remove
                  </Button>
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

  const handleChange = (attr) => (e) => {
    const value = moment(e, "DD.MM.YYYY").format();
    setDate((prev) => ({
      ...prev,
      [attr]: value,
    }));
  };

  let filteredData = data;

  if (searchKey)
    filteredData = data.filter((item) => {
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
    filteredData = data.filter((item) => {
      const value = moment(item.articleDate, "DD.MM.YYYY").format();
      return value > date.startDate && value < date.endDate;
    });
  else filteredData = data;

  return (
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
        {!data ? (
          <Empty />
        ) : (
          <Table
            style={{ overflow: "auto" }}
            columns={config}
            dataSource={filteredData}
          />
        )}
      </Col>
    </Row>
  );
};

export default SavedJobs;
