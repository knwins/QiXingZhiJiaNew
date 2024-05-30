import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import StoreGroupModel from './components/StoreGroupModel';
import { StoreGroupItem } from './data';
import {
  addStoreGroup,
  queryBusinessSelect,
  queryStoreGroupList,
  removeStoreGroup,
  updateStoreGroup,
} from './service';

const StoreGroup: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<StoreGroupItem>();

  //国际化
  const intl = useIntl();
  let roleGroup = localStorage.getItem('roleGroup');
  //读取属性数据
  const { data: businessData } = useRequest(() => {
    return queryBusinessSelect({
      current: 1,
      pageSize: 100000,
    });
  });

  const businessListOptions = {};
  //Execl导出数据使用
  const businessListData = {};
  if (businessData) {
    businessData.map((item) => {
      businessListOptions[item.id] = {
        text: item.name,
        value: item.id,
      };
      businessListData[item.id] = item.name;
    });
  }

  const handleAction = async (fields: StoreGroupItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      if (fields.id != null) {
        const { success } = await updateStoreGroup({
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
        const { success } = await addStoreGroup({
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

  const handleRemove = (selectedRows: StoreGroupItem) => {
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
          const { success } = await removeStoreGroup({
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

  const columns: ProColumns<StoreGroupItem>[] = [
    {
      title: <FormattedMessage id="pages.store.search.keywords" />,
      dataIndex: 'keywords',
      hideInForm: true,
      hideInTable: true,
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入搜索关键字',
      },
    },
    {
      title: '组名称',
      dataIndex: 'name',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'text',
      width: 'md',
      ellipsis: true,
    },
    {
      title: '群组类别',
      dataIndex: 'useType',
      valueType: 'text',
      hideInForm: true,
      width: 'sm',
      valueEnum: {
        INTERNAL: {
          text: '内部组',
          type: 'INTERNAL',
        },
        EXTERNAL: {
          text: '外部组',
          type: 'EXTERNAL',
        },
      },
    },

    {
      title: '运营商',
      dataIndex: ['business', 'name'],
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      fieldProps: { width: '60px' },
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      fieldProps: { width: '60px' },
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      copyable: true,
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      fieldProps: { width: '60px' },
    },

    {
      title: <FormattedMessage id="pages.product.business" />,
      dataIndex: 'businessId',
      valueType: 'select',
      hideInForm: true,
      fieldProps: { width: '60px' },
      hideInDescriptions: true,
      hideInTable: true,
      valueEnum: businessListOptions,
      hideInSearch: roleGroup == 'SYSTEM_USER' ? false : true,
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
        <ProTable<StoreGroupItem>
          actionRef={actionRef}
          rowKey={(record) => record.id}
          search={{
            labelWidth: 80,
          }}
          pagination={paginationProps}
          request={(params) => {
            const res = queryStoreGroupList({ ...params });
            res.then((value) => {
              params.pageSize = value.total;
            });
            return res;
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

        <StoreGroupModel
          done={done}
          visible={visible}
          current={currentRow || {}}
          onDone={handleDone}
          onSubmit={async (value) => {
            const success = await handleAction(value as StoreGroupItem);
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
export default StoreGroup;
