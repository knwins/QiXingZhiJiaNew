import {
  ActionType,
  PageContainer,
  ProForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Card, Col, message, Row } from 'antd';
import React, { useRef } from 'react';
import { useRequest } from 'umi';
import { SiteConfigParams } from './data';
import { getSiteConfig, updateSiteConfig } from './service';

const SiteConfigForm: React.FC = () => {
  const actionRef = useRef<ActionType>();
  //国际化
  const intl = useIntl();

  const { data: currentSiteConfig, loading } = useRequest(() => {
    return getSiteConfig({ id: 1 });
  });

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleFinish = async (fields: any, currentRow?: SiteConfigParams) => {
    try {
      const loadingHiddle = message.loading(
        intl.formatMessage({
          id: 'pages.tip.loading',
        }),
        0,
      );
      const { success } = await updateSiteConfig({
        ...currentRow,
        ...fields,
      });
      loadingHiddle();
      if (success) {
        message.success(
          intl.formatMessage({
            id: 'pages.tip.success',
          }),
        );
        if (actionRef.current) {
          actionRef.current.reload();
        }
        return true;
      }
      return false;
    } catch (error) {
      message.error(
        intl.formatMessage({
          id: 'pages.tip.error',
        }),
      );
      return false;
    }
  };

  return (
    <div>
      {loading ? null : (
        <>
          <PageContainer>
            <ProForm
              hideRequiredMark
              style={{ margin: 'auto', marginTop: 8, maxWidth: '100%' }}
              name="basic"
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{
                ...currentSiteConfig,
              }}
            >
              <ProFormText name="id" hidden={true} />
              <Card bordered={false} title="基本信息" style={{marginBottom:20}}>
                <Row gutter={16}>
                  <Col lg={6} md={12} sm={24}>
                    <ProFormText
                      width="md"
                      label="名称"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: '请输入名称',
                        },
                      ]}
                      placeholder="请输入名称"
                    />
                  </Col>

                  <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <ProFormText
                      width="lg"
                      label="标题"
                      name="title"
                      rules={[
                        {
                          required: true,
                          message: '请输入标题',
                        },
                      ]}
                      placeholder="请输入标题"
                    />
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col lg={6} md={12} sm={24}>
                    <ProFormText
                      width="lg"
                      label="域名"
                      name="domain"
                      rules={[
                        {
                          required: true,
                          message: '请输入域名',
                        },
                      ]}
                      placeholder="域名"
                    />
                  </Col>

                  <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <ProFormText
                      width="lg"
                      label="关键词"
                      name="keywords"
                      rules={[
                        {
                          required: true,
                          message: '请输入关键词',
                        },
                      ]}
                      placeholder="关键词"
                    />
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col lg={24} md={12} sm={24}>
                    <ProFormTextArea
                      label="描述"
                      width="lg"
                      name="description"
                      rules={[
                        {
                          required: true,
                          message: '请输入描述',
                        },
                      ]}
                      placeholder="请输入描述"
                    />
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col lg={24} md={24} sm={24}>
                    <ProFormTextArea
                      width="lg"
                      label="标识参数配置"
                      tooltip="标识参数为系统配置请勿修改"
                      name="arrMark"
                      rules={[
                        {
                          required: true,
                          message: '请输入标识参数',
                        },
                      ]}
                      placeholder="请输入标识参数"
                    />
                  </Col>
                </Row>
              </Card>

              <Card title="其他信息" bordered={false} style={{marginBottom:20}}>
                <ProFormTextArea
                  width="md"
                  label="你想换电Token"
                  name="nxhdToken"
                  rules={[
                    {
                      required: true,
                      message: '请输入你想换电Token',
                    },
                  ]}
                  placeholder="你想换电Token"
                />

                <ProFormTextArea
                  width="md"
                  label="中骏换电Token"
                  name="zjhdToken"
                  rules={[
                    {
                      required: true,
                      message: '请输入中骏换电Token',
                    },
                  ]}
                  placeholder="中骏换电Token"
                />

                <ProFormText
                  width="lg"
                  label="文件上传ServerURL"
                  name="uploadFileServer"
                  rules={[
                    {
                      required: true,
                      message: '请输入文件上传ServerURL',
                    },
                  ]}
                  placeholder="文件上传ServerURL"
                />

                {/* <ProFormText
                  width="sm"
                  label="Android version"
                  name="appAndroidVersion"
                  rules={[
                    {
                      required: true,
                      message: '请输入Android版本号',
                    },
                  ]}
                  placeholder="Android版本号"
                />
                <ProFormText
                  width="lg"
                  label="Android版本更新说明"
                  name="verAndroidMessage"
                  rules={[
                    {
                      required: true,
                      message: '请输入Android版本更新说明',
                    },
                  ]}
                  placeholder="Android版本更新说明"
                />
                <ProFormText
                  width="lg"
                  label="Android版本更新URL"
                  name="verAndroidUrl"
                  rules={[
                    {
                      required: true,
                      message: '请输入Android版本更新说明',
                    },
                  ]}
                  placeholder="Android版本更新说明"
                />

                <ProFormText
                  width="sm"
                  label="现货监测交易对ID"
                  name="monitorSpot"
                  rules={[
                    {
                      required: true,
                      message: '请输入现货监测交易对',
                    },
                  ]}
                  placeholder="现货监测交易对,默认值为0"
                />
                <ProFormText
                  width="sm"
                  label="合约监测交易对ID"
                  name="monitorFuture"
                  rules={[
                    {
                      required: true,
                      message: '请输入合约监测交易对',
                    },
                  ]}
                  placeholder="合约监测交易对,默认值为0"
                /> */}
              </Card>
            </ProForm>
          </PageContainer>
        </>
      )}
    </div>
  );
};

export default SiteConfigForm;
