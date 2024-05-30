import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import PartnerModel from './components/PartnerModel';
import { PartnerItem } from './data';
import { addPartner, queryPartnerList, removePartner, updatePartner } from './service';

const Spot: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<PartnerItem>();

  //国际化
  const intl = useIntl();

  const handleAction = async (fields: PartnerItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      if (fields.id != null) {
        const { success } = await updatePartner({
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
        const { success } = await addPartner({
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
      console.log(error);
      message.error(
        intl.formatMessage({
          id: 'pages.tip.error',
        }),
      );
      return false;
    }
  };

  const handleRemove = (selectedRows: PartnerItem) => {
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
          const { success } = await removePartner({
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

  const handleDone = () => {
    setDone(false);
    setVisible(false);
    setCurrentRow(undefined);
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
  };

  const columns: ProColumns<PartnerItem>[] = [
    {
      title: <FormattedMessage id="pages.create.time" />,
      dataIndex: 'createTime',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'dateTime',
      width: 'md',
    },

    {
      title: <FormattedMessage id="pages.partner.name" />,
      dataIndex: 'name',
      hideInForm: true,
      hideInSearch: true,
      copyable: true,
      valueType: 'text',
      width: 'md',
    },

    {
      title: <FormattedMessage id="pages.partner.state" />,
      dataIndex: 'state',
      valueType: 'select',
      hideInForm: true,
      valueEnum: {
        STOP: {
          text: '停用',
          state: 'STOP',
        },
        NORMAL: {
          text: '正常',
          state: 'NORMAL',
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
            key="edit"
            onClick={() => {
              setCurrentRow(record);
              setVisible(true);
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
    <div>
      <PageContainer>
        <ProTable<PartnerItem>
          actionRef={actionRef}
          rowKey={(record) => record.id}
          search={false}
          pagination={paginationProps}
          request={(params) => {
            return queryPartnerList({ ...params });
          }}
          columns={columns}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              size="small"
              onClick={() => {
                setVisible(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="pages.new" />
            </Button>,
          ]}
        />

        <PartnerModel
          done={done}
          visible={visible}
          current={currentRow || {}}
          onDone={handleDone}
          onSubmit={async (value) => {
            const success = await handleAction(value as PartnerItem);
            if (success) {
              setVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        />
      </PageContainer>
    </div>
  );
};
export default Spot;
