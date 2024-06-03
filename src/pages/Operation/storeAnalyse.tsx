import { DeleteOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, message, Modal, Space, Table } from 'antd';
import React, { useRef, useState } from 'react';
import StoreAnalyseModel from './components/StoreAnalyseModel';
import { StoreAnalyseItem } from './data';
import {
  addStoreAnalyse,
  queryBusinessSelect,
  queryStoreAnalyseList,
  queryStoreGroupSelect,
  removeStoreAnalyse,
  removeStoreAnalyseByIds,
  updateStoreAnalyse,
} from './service';

const StoreAnaylse: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [done, setDone] = useState<boolean>(false);
  const [editView, setEditView] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<StoreAnalyseItem>();
  const [exportParams, setExportParams] = useState({}); //导出参数

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
    businessData.map((item:any) => {
      businessListOptions[item.id] = {
        text: item.label,
        value: item.value,
      };
      businessListData[item.id] = item.label;
    });
  }

  //读取属性数据
  const { data: storeGroupData } = useRequest(() => {
    return queryStoreGroupSelect({
      current: 1,
      pageSize: 100000,
    });
  });

  const storeGroupListOptions = {};
  //Execl导出数据使用
  const storeGroupDataList = {};
  if (storeGroupData) {
    storeGroupData.map((item:any) => {
      storeGroupListOptions[item.id] = {
        text: item.name,
        value: item.id,
      };
      storeGroupDataList[item.id] = item.name;
    });
  }

  const handleAction = async (fields: StoreAnalyseItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      if (fields.id != null) {
        const { success } = await updateStoreAnalyse({
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
        const { success } = await addStoreAnalyse({
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

  const handleRemove = (selectedRows: StoreAnalyseItem) => {
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
          const { success } = await removeStoreAnalyse({
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
    setEditView(false);
    setCurrentRow(undefined);
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
  };

  const columns: ProColumns<StoreAnalyseItem>[] = [
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
      title: '运营商',
      dataIndex: ['business', 'label'],
      valueType: 'select',
      hideInForm: true,
      width: 'sm',
      hideInSearch: true,
    },

    {
      title: '站点',
      dataIndex: ['store', 'label'],
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      width: 'sm',
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
      title: '产权品牌',
      dataIndex: ['ownership', 'label'],
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      width: 'sm',
    },
    {
      title: '规格',
      dataIndex: ['spec', 'label'],
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      width: 'sm',
    },

    {
      title: '总数量(人工)',
      dataIndex: 'total',
      valueType: 'digit',
      hideInForm: true,
      hideInSearch: true,
      fieldProps: { width: '60px' },
    },
    {
      title: '总数量(系统)',
      dataIndex: 'systemTotal',
      valueType: 'digit',
      hideInForm: true,
      hideInSearch: true,
      fieldProps: { width: '60px' },
    },
    {
      title: '正常',
      dataIndex: 'noneTotal',
      valueType: 'digit',
      hideInForm: true,
      hideInSearch: true,
      fieldProps: { width: '60px' },
    },
    {
      title: '维修',
      dataIndex: 'maintenanceTotal',
      valueType: 'digit',
      hideInForm: true,
      hideInSearch: true,
      fieldProps: { width: '60px' },
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
            key="edit"
            onClick={() => {
              setCurrentRow(record);
              setEditView(true);
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
  const handleRemoveByIds = (selectedRowKeys: any) => {
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
          const { success } = await removeStoreAnalyseByIds({
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
        <ProTable<StoreAnalyseItem>
          actionRef={actionRef}
          rowKey={(record) => record.id}
          search={{
            labelWidth: 80,
          }}
          pagination={paginationProps}
          request={(params) => {
            const res = queryStoreAnalyseList({ ...params });
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
                <span>{`总计数量: ${selectedRows.reduce((pre, item) => pre + item.total, 0)}`}</span>
                <span>{`总计维修数量: ${selectedRows.reduce((pre, item) => pre + item.maintenanceTotal, 0)}`}</span>
              </Space>
            );
          }}
          tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => {
            return (
              <Space size={16}>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    // exportExcel();
                  }}
                >
                  <ExportOutlined />
                  导出
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    handleRemoveByIds(selectedRowKeys);
                  }}
                >
                  <DeleteOutlined />
                  删除
                </Button>
              </Space>
            );
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              size="small"
              onClick={() => {
                setEditView(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="pages.new" />
            </Button>,
          ]}
        />

        <StoreAnalyseModel
          done={done}
          open={editView}
          current={currentRow || {}}
          onDone={handleDone}
          onSubmit={async (value) => {
            const success = await handleAction(value as StoreAnalyseItem);
            if (success) {
              setEditView(false);
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
export default StoreAnaylse;
