import React from "react";
import Modal from "antd/lib/modal";
import { Button, Input, Row, Col, Popover } from "antd";
import axios from "axios";

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
        okText='Save'
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

const Actions = ({record}) => {
  const [visible, setVisible] = React.useState(false);
  const [comment, setComment] = React.useState();

  const handleChange = (e) => {
    setComment(e.target.value);
  }

  const onOk = () => {
    axios.patch(`http://34.154.105.51:8080/api/v1/jobs/${record.id}`, {
      comment: comment,
      saved: true,
    }).then(r => setVisible(false))
  }

  return (
    <>
      <Button type='link' onClick={() => setVisible(true)}>Add Comment</Button>
      <Modal
        title='Edit Row'
        visible={visible}
        onOk={onOk}
        onCancel={() => setVisible(false)}
      >
        Add Comment
        <Row justify='end' gutter={[8, 8]}>
          <Col xs={24}>
            <Input
              onChange={handleChange}
              placeholder="Add a comment"
            />
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default [
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
    dataIndex: "comments",
    key: "comments",
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
            <Actions record={record}/>
          </Col>
        </Row>}>
          <Button type="primary" ghost>More Actions</Button>
        </Popover>
      )
    }
  }
];
