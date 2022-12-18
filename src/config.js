import React from "react";
import Modal from "antd/lib/modal";
import { Button, Col, Input, notification, Row } from "antd";
import axios from "axios";

const CustomModal = ({record}) => {
  const [visible, setVisible] = React.useState(false);
  const regex = /(<([^>]+)>)/ig;

  const text = record.replace(regex, "")

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

const Actions = ({record, getData}) => {
  const [visible, setVisible] = React.useState(false);
  const [comment, setComment] = React.useState();

  const handleChange = (e) => {
    setComment(e.target.value);
  }

  const onOk = () => {
    axios.patch(`http://34.154.54.36:9000/api/v1/jobs/${record.id}`, {
      comment: comment,
      saved: true,
    }).then(r => {
      setVisible(false);
      notification.success({
        message: 'Saved Successfully'
      });
      getData();
    })
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

export {
  Actions,
  CustomModal
}