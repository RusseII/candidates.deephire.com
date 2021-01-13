import React, { useEffect } from 'react';
import { Button, Modal, Form, Input, Typography } from 'antd';

export default ({ visible, onSuccess, companyName, setControlKeys }) => {
    const [form] = Form.useForm();

  const submitForm = () => {
    form
      .validateFields()
      .then(values => {
        // form.resetFields();
        onSuccess(values);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };
  return (
    <Modal
      closable={false}
      visible={visible}
      title="Enter your name to view candidates"
      okText="View Candidates"
      footer={
        <Button type="primary" onClick={submitForm}>
          View Candidates
        </Button>
      }
    >
      <Typography.Paragraph>
        {companyName} shared some candidate videos with you. Please enter your name below to view
        them.
      </Typography.Paragraph>
      <Form
        hideRequiredMark
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form.Item
                    onFocus={() => setControlKeys(false)}
                    onBlur={() => setControlKeys(true)}
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: 'Please enter your full name!',
            },
          ]}
        >
          <Input

            onPressEnter={submitForm}
            placeholder="Enter your full name"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
