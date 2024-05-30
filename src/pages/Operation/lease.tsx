import { PlusOutlined } from '@ant-design/icons';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, Drawer, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';

import ExitLeaseOrderModel from './components/ExitLeaseOrderModel';
import LeaseModel from './components/LeaseModel';
import LeaseOrderModel from './components/LeaseOrderModel';
import { ProductLeaseItem, ProductLeaseOrderItem, ProductLeaseOrderParams } from './data';
import {
  addProductLease,
  addProductLeaseOrder,
  queryPartnerSelect,
  queryProductLeaseList,
  queryProductLeaseOrderList,
  removeProductLease,
  updateProductLease,
} from './service';

const ProductLease: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [orderVisible, setOrderVisible] = useState<boolean>(false);
  const [exitOrderVisible, setExitOrderVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ProductLeaseItem>();
  const [showDetail, setShowDetail] = useState<boolean>(false);

  //国际化
  const intl = useIntl();

  const partnerListOptions = {};

  //读取合作商数据
  const { data: partnerData } = useRequest(() => {
    return queryPartnerSelect({
      current: 1,
      pageSize: 100000,
    });
  });
  if (partnerData) {
    partnerData.map((item) => {
      partnerListOptions[item.id] = {
        text: item.name,
        value: item.id,
      };
      partnerListOptions[item.id] = item.name;
    });
  }

  /**
   * Product 操作
   * @param fields
   * @returns
   */
  const handleAction = async (fields: ProductLeaseItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      if (fields.id != null) {
        const { success } = await updateProductLease({
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
        const { success } = await addProductLease({
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

  /**
   * Product 操作
   * @param fields
   * @returns
   */
  const handleLeaseOrderAction = async (fields: ProductLeaseItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      if (fields.id != null) {
        if (fields.action === 'RENEWAL') {
          const { success } = await addProductLeaseOrder({
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
          return false;
        }

        if (fields.action === 'EXITLEASE') {
          const { success } = await addProductLeaseOrder({
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
          return false;
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

  const handleRemove = (selectedRows: ProductLeaseItem) => {
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
          const { success } = await removeProductLease({
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
    setOrderVisible(false);
    setExitOrderVisible(false);
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
  };

  const cparams: ProductLeaseOrderParams = {
    productLeaseId: currentRow?.id,
  };

  const tcolumns: ProColumns<ProductLeaseOrderItem>[] = [
    {
      title: <FormattedMessage id="pages.create.time" />,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: '150px',
      fieldProps: { size: 'small' },
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '租赁数量',
      dataIndex: 'num',
      valueType: 'digit',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      valueType: 'money',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'action',
      valueType: 'select',
      hideInSearch: true,
      ellipsis: true,
      valueEnum: {
        RENEWAL: {
          text: '续租',
          action: 'RENEWAL',
        },
        EXITLEASE: {
          text: '退租',
          action: 'EXITLEASE',
        },
        ADDDEPOSIT: {
          text: '增保证金',
          action: 'ADDDEPOSIT',
        },
      },
    },

    {
      title: '备注',
      dataIndex: 'inro',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
  ];

  const columns: ProColumns<ProductLeaseItem>[] = [
    {
      title: '关键字搜索',
      dataIndex: 'keywords',
      hideInForm: true,
      hideInTable: true,
      hideInDescriptions: true,
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入车辆编号、姓名或手机号',
      },
    },

    {
      title: <FormattedMessage id="pages.create.time" />,
      dataIndex: 'createTime',
      hideInSearch: true,
      valueType: 'dateTime',
      width: '180px',
    },

    {
      title: '电动车编号',
      dataIndex: ['product', 'number'],
      hideInForm: true,
      hideInSearch: true,
      copyable: true,
      valueType: 'text',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },

    {
      title: '租赁人',
      dataIndex: ['leaseUser', 'label'],
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
    },

    {
      title: '付款方式',
      dataIndex: 'payType',
      valueType: 'select',
      hideInForm: true,
      hideInSearch: true,
      valueEnum: {
        DAY: {
          text: '按天计费',
          payType: 'DAY',
        },
        MONTH: {
          text: '按月计费',
          payType: 'MONTH',
        },
      },
    },

    {
      title: '累计租期(天)',
      dataIndex: 'numTotal',
      valueType: 'digit',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
      fieldProps: { value: currentRow?.numTotal + '天' },
    },
    {
      title: '累计租金',
      dataIndex: 'amountTotal',
      valueType: 'money',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '单价',
      dataIndex: 'price',
      valueType: 'money',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '保证金',
      dataIndex: 'deposit',
      valueType: 'money',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      hideInForm: true,
      valueEnum: {
        FINISH: {
          text: '退租完成',
          type: 'FINISH',
        },
        NORMAL: {
          text: '租赁中',
          type: 'NORMAL',
        },
        LATE: {
          text: '已逾期',
          type: 'LATE',
        },
      },
    },
    {
      title: '合作商',
      dataIndex: 'partnerId',
      valueType: 'select',
      hideInForm: true,
      hideInTable:true,
      hideInDescriptions:true,
      width: 'sm',
      valueEnum: partnerListOptions,
    },

    {
      title: '合作商',
      dataIndex: ['leaseUser','partner','name'],
      valueType: 'text',
      hideInForm: true,
      hideInSearch:true,
      width: 'sm',
    },

    {
      title: '起租时间',
      dataIndex: 'startTime',
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },

    {
      title: '结束时间',
      dataIndex: 'endTime',
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },

    {
      title: <FormattedMessage id="pages.option" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      render: (_, record) => {
        if (record?.state !== 'FINISH') {
          return [
            <a
              key="renewal"
              onClick={() => {
                setCurrentRow(record);
                setOrderVisible(true);
              }}
            >
              <FormattedMessage id="pages.renewal" />
            </a>,

            <a
              key="exitLease"
              onClick={() => {
                setCurrentRow(record);
                setExitOrderVisible(true);
              }}
            >
              <FormattedMessage id="pages.exitLease" />
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
        } else {
          return '-';
        }
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<ProductLeaseItem>
        actionRef={actionRef}
        rowKey={(record) => record.id}
        search={{
          labelWidth: 120,
        }}
        pagination={paginationProps}
        request={(params) => {
          return queryProductLeaseList({ ...params });
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

      <LeaseModel
        done={done}
        visible={visible}
        current={currentRow || {}}
        onDone={handleDone}
        onSubmit={async (value) => {
          const success = await handleAction(value as ProductLeaseItem);
          if (success) {
            setVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />

      <LeaseOrderModel
        done={done}
        visible={orderVisible}
        current={currentRow || {}}
        onDone={handleDone}
        onSubmit={async (value) => {
          const success = await handleLeaseOrderAction(value as ProductLeaseItem);
          if (success) {
            setOrderVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />

      <ExitLeaseOrderModel
        done={done}
        visible={exitOrderVisible}
        current={currentRow || {}}
        onDone={handleDone}
        onSubmit={async (value) => {
          const success = await handleLeaseOrderAction(value as ProductLeaseItem);
          if (success) {
            setExitOrderVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<ProductLeaseItem>
            column={1}
            key={currentRow.id}
            title="车辆租赁信息"
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<ProductLeaseItem>[]}
          />
        )}

        {currentRow ? (
          <ProTable<ProductLeaseOrderItem, ProductLeaseOrderParams>
            headerTitle="租赁订单"
            search={false}
            pagination={paginationProps}
            options={false}
            params={cparams}
            rowKey={(record) => record.id}
            request={queryProductLeaseOrderList}
            columns={tcolumns}
          />
        ) : (
          ''
        )}
      </Drawer>
    </PageContainer>
  );
};
export default ProductLease;
