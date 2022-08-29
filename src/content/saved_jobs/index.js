import React from 'react';
import axios from "axios";
import { Table, Empty, Input, Col, Row, Button, notification } from "antd";
import Modal from "antd/lib/modal";

const CustomModal = ({record}) => {
  const [visible, setVisible] = React.useState(false);

  const div = document.createElement("div");
  div.innerHTML = record;
  const text = div.textContent || div.innerText || "";

  return (
    <>
      <p style={{cursor: "pointer"}} onClick={() => setVisible(true)}>
        {text.substring(0, 40) + "..."}
      </p>
      <Modal
        width={800}
        title="Job Description"
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        visible={visible}
      >
        {text}
      </Modal>
    </>
  );
};

const config = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
    defaultSortOrder: 'ascend',
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: "Title",
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
      const onRemove = () => {
        axios.patch(`http://34.154.105.51:8080/api/v1/jobs/${record.id}`, {
          saved: false,
          comment: ' '
        }).then(() => {
          notification.success({
            message: 'Notification Title',
          })
        })
      }
      return (
        <Button style={{backgroundColor: 'lightcoral', color: 'white'}} onClick={onRemove}>
          Remove
        </Button>
      )
    }
  },
]

const SavedJobs = () => {
  const [data, setData] = React.useState([]);
  const [searchKey, setSearchKey] = React.useState('')

  React.useEffect(() => {
    axios.get(`http://34.154.105.51:8080/api/v1/jobs?offset=0&limit=1000&saved=true`).then(r => setData(r.data))
  }, []);

  let filteredData = data;

  if (searchKey)
    filteredData = data.filter((item) => {
      return item.title && item.title.toString().toLowerCase().includes(searchKey.toLowerCase()) ||
        item.category && item.category.toString().toLowerCase().includes(searchKey.toLowerCase()) ||
        item.location && item.location.toString().toLowerCase().includes(searchKey.toLowerCase()) ||
        item.language && item.language.toString().toLowerCase().includes(searchKey.toLowerCase())
    })

  return (
    <Row gutter={[8, 8]}>
      <Col xs={24}>
        <Input.Search
          placeholder="Search By Title,Language,Location or Category"
          onChange={(e) => setSearchKey(e.target.value)}
        />
      </Col>
      <Col xs={24}>
        {!data ? <Empty/> : (
          <Table
            columns={config}
            dataSource={filteredData}
          />
        )}
      </Col>
    </Row>
  );
};

export default SavedJobs;