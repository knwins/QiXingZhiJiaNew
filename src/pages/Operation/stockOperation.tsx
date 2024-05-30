import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, message, Modal, Space, Table } from 'antd';
import React, { useRef, useState } from 'react';
import StockOperationCommendModel from './components/StockOperationCommendModel';
import StockOperationDetailModel from './components/StockOperationDetailModel';
import StockOperationModel from './components/StockOperationModel';

import { StockOperationItem } from './data';
import {
  addStockOperation,
  queryBusinessSelect,
  queryStockOperationList,
  removeStockOperation,
  removeStockOperationByIds,
  updateStockOperation,
  updateStockOperationCommend,
} from './service';

const StockOperation: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<StockOperationItem>();
  const [exportParams, setExportParams] = useState({}); //导出参数
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showStockOperationCommend, setShowStockOperationCommend] = useState<boolean>(false);

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
        text: item.label,
        value: item.value,
      };
      businessListData[item.id] = item.label;
    });
  }

  const handleCommendAction = async (fields: StockOperationItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      if (fields.operationType != undefined && fields.operationType === 'IN_STORE') {
        const { success } = await updateStockOperationCommend({
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
        const { success } = await addStockOperation({
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

  const handleAction = async (fields: StockOperationItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      if (fields.id != null) {
        const { success } = await updateStockOperation({
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
        const { success } = await addStockOperation({
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

  const handleRemove = (selectedRows: StockOperationItem) => {
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
          const { success } = await removeStockOperation({
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
    setShowStockOperationCommend(false);
    setShowDetail(false);
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
  };

  const columns: ProColumns<StockOperationItem>[] = [
    {
      title: <FormattedMessage id="pages.search.keywords" />,
      dataIndex: 'keywords',
      hideInForm: true,
      hideInTable: true,
      valueType: 'text',
      hideInDescriptions: true,
      fieldProps: {
        placeholder: '关键词搜索',
      },
    },

    {
      title: <FormattedMessage id="pages.product.business" />,
      dataIndex: 'businessId',
      valueType: 'select',
      hideInForm: true,
      hideInTable: true,
      fieldProps: { width: '60px' },
      hideInDescriptions: true,
      valueEnum: businessListOptions,
      hideInSearch: roleGroup == 'SYSTEM_USER' ? false : true,
    },

    {
      title: '操作名称',
      dataIndex: 'name',
      valueType: 'text',
      hideInForm: true,
      width: 'sm',
      hideInDescriptions: true,
      hideInSearch: true,
    },

    {
      title: '操作分类',
      dataIndex: 'operationType',
      valueType: 'select',
      hideInForm: true,
      width: 'sm',
      valueEnum: {
        OUT_STORE: {
          text: '出库',
        },
        IN_STORE: {
          text: '入库',
        },
        STORE_TO_STORE: {
          text: '调拨',
        },
        OTHER: {
          text: '其他',
        },
      },
    },

    {
      title: '运营商',
      dataIndex: ['business', 'label'],
      valueType: 'select',
      hideInForm: true,
      width: 'sm',
      hideInDescriptions: true,
      hideInSearch: true,
    },

    {
      title: '分类',
      dataIndex: 'category',
      valueType: 'select',
      hideInForm: true,
      width: 'sm',
      valueEnum: {
        CELL: {
          text: '电池',
        },
        CABINET: {
          text: '电柜',
        },
        ELECTRIC: {
          text: '电动车',
        },
      },
    },

    {
      title: '数量',
      dataIndex: 'quantity',
      valueType: 'digit',
      hideInForm: true,
      hideInSearch: true,
      fieldProps: { width: '60px' },
    },

    {
      title: '编号文件',
      dataIndex: 'fileUrl',
      valueType: 'text',
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true,
      fieldProps: { width: '60px' },
    },

    {
      title: '备注',
      dataIndex: 'remarks',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      fieldProps: { width: '60px' },
    },
    {
      title: '操作命令',
      dataIndex: 'operationCommend',
      valueType: 'text',
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true,
    },

    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      hideInForm: true,
      width: 'sm',
      valueEnum: {
        COMMAND_WRITE: {
          text: '待执行',
        },
        SYNC_MINIPROGRAM: {
          text: '小程序同步中',
        },
        DONE: {
          text: '完成',
        },
       
      },
    },
    {
      title: <FormattedMessage id="pages.option" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      hideInSearch: true,
      render: (_, record) => {
        return [
          <a
            key="detail"
            onClick={() => {
              if (record.state === 'COMMAND_WRITE') {
                setCurrentRow(record);
                setShowStockOperationCommend(true);
              }else if(record.state === 'SYNC_MINIPROGRAM' || record.state === 'DONE'){
                setCurrentRow(record);
                setShowDetail(true);
              }
            }}
          >
            <FormattedMessage id="pages.detail" />
          </a>,

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

  //批量删除数据
  const handleRemoveByIds = (selectedRowKeys: any, onCleanSelected: any) => {
    Modal.confirm({
      title: intl.formatMessage({
        id: 'pages.tip.title',
      }),
      content: intl.formatMessage({
        id: 'pages.tip.content.delete.all',
      }),
      okText: intl.formatMessage({
        id: 'pages.tip.ok',
      }),
      cancelText: intl.formatMessage({
        id: 'pages.tip.cancel',
      }),
      onOk: async () => {
        try {
          const loadingHidde = message.loading(
            intl.formatMessage({
              id: 'pages.tip.loading',
            }),
          );
          const { success } = await removeStockOperationByIds({
            ids: selectedRowKeys,
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
              handleDone();
              onCleanSelected();
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

  return (
    <div>
      <PageContainer>
        <ProTable<StockOperationItem>
          actionRef={actionRef}
          rowKey={(record) => record.id}
          search={{
            labelWidth: 80,
          }}
          pagination={paginationProps}
          request={(params) => {
            const res = queryStockOperationList({ ...params });
            res.then((value) => {
              params.pageSize = value.total;
              setExportParams(params);
            });
            return res;
          }}
          columns={columns}
          rowSelection={{
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          }}
          tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
            return (
              <Space size={28}>
                <span>
                  已选 {selectedRowKeys.length} 项
                  <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                    取消选择
                  </a>
                </span>
              </Space>
            );
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              size="small"
              onClick={() => {
                setVisible(true);
              }}
            >
              <PlusOutlined /> 新增编号文件
            </Button>,
          ]}
        />

        <StockOperationCommendModel
          done={done}
          visible={showStockOperationCommend}
          current={currentRow || {}}
          onDone={handleDone}
          onSubmit={async (value) => {
            const success = await handleCommendAction(value as StockOperationItem);
            if (success) {
              setShowStockOperationCommend(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        />

        <StockOperationModel
          done={done}
          visible={visible}
          current={currentRow || {}}
          onDone={handleDone}
          onSubmit={async (value) => {
            const success = await handleAction(value as StockOperationItem);
            if (success) {
              setVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        />

        <StockOperationDetailModel
          done={done}
          visible={showDetail}
          current={currentRow || {}}
          onDone={handleDone}
          onSubmit={async (value) => {
            const success = await handleAction(value as StockOperationItem);
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
export default StockOperation;
