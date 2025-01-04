import React, { useState, useContext } from 'react';
import {
  Form, Input, Button, Select, Space, Typography, Card, Row, Col, Tabs, Grid, Switch
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { MessageContext } from '@contexts/MessageContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { getCmsHooks } from '@src/modules/cms/store/services/cmsApi';

const { TextArea } = Input;
const { useBreakpoint } = Grid;
const { TabPane } = Tabs;

const ContentAddPage: React.FC = () => {
  const [form] = Form.useForm();
  const messageApi = useContext(MessageContext);

  const { useCreateContentMutation } = getCmsHooks();
  const [createContent] = useCreateContentMutation();

  const navigate = useNavigate();
  const [body, setBody] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const screens = useBreakpoint();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const tagsArray = values.tags
        ? values.tags.split(',').map((tag: string) => tag.trim())
        : [];

      await createContent({
        ...values,
        body,
        tags: tagsArray,
        status: values.status || 'Draft'
      }).unwrap();

      messageApi?.success('Content created successfully');
      form.resetFields();
      setBody('');
      navigate('/cms/contents');
    } catch (error: any) {
      if (error.data?.errors) {
        const fields = Object.keys(error.data.errors).map((key) => ({
          name: key,
          errors: error.data.errors[key],
        }));
        form.setFields(fields);
      } else {
        messageApi?.error('Failed to create content');
      }
    }
  };

  return (
    <Card>
      <Typography.Title level={2}>Add New Content</Typography.Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Tabs defaultActiveKey="1" style={{ height: '100%' }}>
          <TabPane tab="Basic Info" key="1">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="title"
                  label="Title"
                  rules={[{ required: true, message: 'Please input the title!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="slug"
                  label="Slug"
                  rules={[{ required: true, message: 'Please input the slug!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="contentType"
                  label="Content Type"
                  rules={[{ required: true, message: 'Please select the content type!' }]}
                >
                  <Select>
                    <Select.Option value="page">Page</Select.Option>
                    <Select.Option value="blog">Blog Post</Select.Option>
                    <Select.Option value="news">News</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="language"
                  label="Language"
                  rules={[{ required: true, message: 'Please input the language!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="status"
                  label="Status"
                >
                  <Select>
                    <Select.Option value="Draft">Draft</Select.Option>
                    <Select.Option value="Published">Published</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="tags"
                  label="Tags"
                  rules={[{ required: true, message: 'Please input the tags!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="SEO" key="2">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="metaTitle"
                  label="Meta Title"
                  rules={[{ required: true, message: 'Please input the meta title!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="metaDescription"
                  label="Meta Description"
                  rules={[{ required: true, message: 'Please input the meta description!' }]}
                >
                  <TextArea rows={2} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="metaKeywords"
                  label="Meta Keywords"
                  rules={[{ required: true, message: 'Please input the meta keywords!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Content" key="3">
            <Row gutter={16} justify="space-between" align="middle" style={{ marginBottom: 16 }}>
              <Col>
                <Typography.Title level={4}>Content Editor</Typography.Title>
              </Col>
              <Col>
                <Switch
                  checked={showPreview}
                  onChange={() => setShowPreview(!showPreview)}
                  checkedChildren="Preview On"
                  unCheckedChildren="Preview Off"
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} lg={showPreview ? 12 : 24}>
                <Form.Item
                  rules={[{ required: true, message: 'Please input the body!' }]}
                >
                  <ReactQuill
                    value={body}
                    onChange={setBody}
                    style={{ width: '100%', maxWidth: '1200px', height: '600px' }}
                  />
                </Form.Item>
              </Col>
              {showPreview && (
                <Col
                  xs={24}
                  lg={12}
                  style={{
                    height: '100%',
                    overflow: 'auto',
                    padding: screens.xs ? '48px 8px' : '0px 8px',
                  }}
                >
                  <Card style={{
                    borderRadius: 0,
                    border: '1px solid'
                  }}>
                    <Typography.Title level={5}>Preview</Typography.Title>
                    <div dangerouslySetInnerHTML={{ __html: body }} />
                  </Card>
                </Col>
              )}
            </Row>
          </TabPane>
        </Tabs>
        <Form.Item>
          <Space size="middle" style={{ marginTop: 48 }}>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
            <Button onClick={() => navigate('/cms/contents')}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ContentAddPage;
