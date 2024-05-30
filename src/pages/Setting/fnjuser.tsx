import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, message, Modal, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import FNJUserModel from './components/FNJUserModel';
import FNJUserPhoneModel from './components/FNJUserPhoneModel';
import type { FNJUserItem } from './data';
import {
  addFNJUser,
  checkUserPhoneFNJ,
  queryFNJUserList,
  refreshFNJUserToken,
  removeFNJUser,
  updateFNJUser,
} from './service';
const { Paragraph } = Typography;

const FNJUser: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [phoneVisible, setPhoneVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<FNJUserItem>();

  //国际化
  const intl = useIntl();

  const handleDone = () => {
    setDone(false);
    setVisible(false);
    setPhoneVisible(false);
    setCurrentRow(undefined);
  };
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
  };

  const handleAction = async (fields: FNJUserItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      if (fields.id != null) {
        const { success } = await updateFNJUser({
          ...fields,
        });

        if (success) {
          message.success(
            intl.formatMessage({
              id: 'pages.tip.success',
            }),
          );
          return true;
        }
      } else {
        const { success } = await addFNJUser({
          ...fields,
        });
        if (success) {
          message.success(
            intl.formatMessage({
              id: 'pages.tip.success',
            }),
          );
          return true;
        }
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

  const handleRemove = (selectedRows: FNJUserItem) => {
    Modal.confirm({
      title: intl.formatMessage({
        id: 'pages.tip.title',
      }),
      content: intl.formatMessage({
        id: 'pages.tip.content',
      }),
      okText: intl.formatMessage({
        id: 'pages.tip.ok',
      }),
      cancelText: intl.formatMessage({
        id: 'pages.tip.cancel',
      }),
      onOk: async () => {
        if (!selectedRows) return true;
        try {
          const loadingHidde = message.loading(
            intl.formatMessage({
              id: 'pages.tip.loading',
            }),
          );
          const { success } = await removeFNJUser({
            id: selectedRows.id,
          });

          if (success) {
            loadingHidde();
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
      },
    });
  };

  const handleCheckUserPhone = async (fields: FNJUserItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      const { success } = await checkUserPhoneFNJ({
        ...fields,
      });
      if (success) {
        message.success("短信验证成功");
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

  const columns: ProColumns<FNJUserItem>[] = [
    {
      title: '登录用户名',
      dataIndex: 'loginName',
      hideInSearch: true,
      valueType: 'text',
      width: 'xs',
    },
    {
      title: '密码',
      dataIndex: 'password',
      hideInSearch: true,
      valueType: 'text',
      width: 'xs',
    },
    {
      title: '浏览器',
      dataIndex: 'equipment',
      hideInSearch: true,
      valueType: 'text',
      width: 'xs',
    },
    {
      title: 'Token',
      dataIndex: 'token',
      hideInSearch: true,
      valueType: 'text',
      width: 'xs',
      ellipsis: true,
    },
    {
      title: '运营商',
      dataIndex: 'businessId',
      hideInSearch: true,
      valueType: 'text',
      width: 'xs',
      valueEnum: {
        1: {
          text: '你想换电',
        },
        3: {
          text: '中骏换电',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.option" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      render: (_, record) => {
        return [
          <a
            key="refresh"
            onClick={async () => {
              const { success, errorMessage } = await refreshFNJUserToken({ id: record.id });
              if (success) {
                message.success('刷新TOKEN成功');
              }
            }}
          >
            刷新TOKEN
          </a>,
          <a
            key="mobileCheck"
            onClick={() => {
              setCurrentRow(record);
              setPhoneVisible(true);
            }}
          >
            短信验证
          </a>,
          <a
            key="edit"
            onClick={() => {
              setVisible(true);
              setCurrentRow(record);
            }}
          >
            <FormattedMessage id="pages.edit" />
          </a>,
          <a
            key="delete"
            onClick={() => {
              handleRemove(record);
            }}
          >
            <FormattedMessage id="pages.delete" />
          </a>,
        ];
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<FNJUserItem>
        actionRef={actionRef}
        rowKey={(record) => record.id}
        search={false}
        pagination={paginationProps}
        request={queryFNJUserList}
        columns={columns}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.new" />
          </Button>,
        ]}
      />
      <FNJUserModel
        done={done}
        visible={visible}
        current={currentRow || {}}
        onDone={handleDone}
        onSubmit={async (value) => {
          const success = await handleAction(value as FNJUserItem);
          if (success) {
            setVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />

      <FNJUserPhoneModel
        done={done}
        visible={phoneVisible}
        current={currentRow || {}}
        onDone={handleDone}
        onSubmit={async (value) => {
          const success = await handleCheckUserPhone(value as FNJUserItem);
          if (success) {
            setPhoneVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />
    </PageContainer>
  );
};
export default FNJUser;
