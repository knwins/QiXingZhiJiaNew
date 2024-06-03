import { DeleteOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, Drawer, message, Modal, Space, Table } from 'antd/lib';
import React, { useRef, useState, useEffect } from 'react';
import { queryBusinessSelect, queryStoreTreeSelect, syncFNJStoreList } from '../Operation/service';
import { queryOptionSelect } from '../Setting/service';
import StockModel from './components/StockModel';
import { Pagination, StockItem, StockLogItem, StockLogParams } from './data';

import {
  addStock,
  exportStockList,
  getStockDetail,
  queryStockList,
  queryStockLogList,
  removeStock,
  removeStockByIds,
  updateStock,
} from './service';
import { StoreParams } from '../Operation/data';
import { log } from '@antv/g2plot/lib/utils';
const StockCabinet: React.FC = () => {
  const tableRef = React.useRef();
  const actionRef = useRef<ActionType>();
  const [done, setDone] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<StockItem>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [editDetail, setEditDetail] = useState<boolean>(false);
  const [exportParams, setExportParams] = useState({}); //导出参数
  const [searchStoreIds, setSearchStoreIds] = useState<string>('');

  let roleGroup = localStorage.getItem('roleGroup');

  //国际化
  const intl = useIntl();

  //读取属性数据
  const { data } = useRequest(() => {
    return queryOptionSelect({
      category: 'CABINET',
    });
  });

  //读取运营商数据
  const { data: businessData } = useRequest(() => {
    return queryBusinessSelect({});
  });

  const businessListOptions = {};
  const ownershipListOptions = {};

  //Execl导出数据使用
  const businessListData = {};
  const ownershipListData = {};

  if (businessData) {
    businessData.map((item) => {
      businessListOptions[item.id] = {
        text: item.name,
        value: item.id,
      };
      businessListData[item.id] = item.name;
    });
  }


  //读取仓库树数据
  const handleStoreTreeSelect = async (businessId?: any) => {
    if (businessId == '') {
      return;
    }
    const pagination: Pagination = {
      current: 1,
    };
    const options: StoreParams = {
      useType: 'INTERNAL',
      businessId: businessId,
    };

    //读取仓库数据
    const { data: storeTreeData } = await queryStoreTreeSelect({
      ...pagination,
      ...options,
    });
    return storeTreeData;
  };



  /**
   * Stock 操作
   * @param fields
   * @returns
   */
  const handleAction = async (fields: StockItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      if (fields.id != null) {
        const { success } = await updateStock({
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
        const { success } = await addStock({
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

  const handleRemove = (selectedRows: StockItem) => {
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
          const { success } = await removeStock({
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
              actionRef.current?.clearSelected;
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
          const { success } = await removeStockByIds({
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
              onCleanSelected();
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
    setCurrentRow(undefined);
    setEditDetail(false);
  };

  //导出数据
  const exportExcel = async () => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    const { success, data, errorMessage } = await exportStockList({ ...exportParams });
    if (success) {
      loadingHidde();
      window.open(data);
    } else {
      message.error(errorMessage);
    }
  };


  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
  };
  
  const cparams: StockLogParams = {
    stockId: currentRow?.id,
  };

  const columns: ProColumns<StockItem>[] = [
    {
      title: '关键词搜索',
      dataIndex: 'keywords',
      hideInForm: true,
      hideInTable: true,
      hideInDescriptions: true,
      
      valueType: 'text',
      fieldProps: {
        placeholder: '关键词搜索',
      },
    },
    {
      title: '编号',
      dataIndex: 'number',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'text',
      copyable: true,
      ellipsis: true,
      render: (dom, entity) => {
        return (
          <a
            onClick={async () => {
              const { success, data } = await getStockDetail({
                id: entity.id,
              });
              if (success) {
                setCurrentRow(data);
                setShowDetail(true);
              }
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '所属产权',
      dataIndex: ['ownership', 'name'],
      valueType: 'select',
      hideInForm: true,
      hideInSearch: true,
      width: 'lg',
      valueEnum: ownershipListOptions,
    },
    {
      title: '规格',
      dataIndex: 'spec',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      width: 'xs',
    },

    {
      title: '所属站点或仓库',
      dataIndex: ['store', 'name'],
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      ellipsis: true,
      width: 'lg',
    },
    {
      title: '区域',
      dataIndex: ['store', 'storeGroup', 'name'],
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      ellipsis: true,
      hideInTable: true,
      
      width: 'lg',
    },

    {
      title: '运营商',
      dataIndex: 'businessId',
      key:'businessId',
      valueType: 'select',
      width: '80px',
      hideInForm: true,
      hideInTable: true,
      hideInDescriptions: true,
      valueEnum: businessListOptions,
      fieldProps: {
        placeholder: '请选择营商',
      },
      hideInSearch: roleGroup == 'SYSTEM_USER' ? false : true,
    },

    {
      title: '站点(多选)',
      dataIndex: 'searchStoreIds',
      key: 'searchStoreIds',
      valueType: 'cascader',
      dependencies:['businessId'],
      request: async (params) => {
        console.log(params);
        if (params.businessId != undefined) {
          return handleStoreTreeSelect(params.businessId);
        }
      },
      hideInForm: true,
      hideInTable: true,
      hideInDescriptions: true,
      formItemProps:{},
      fieldProps: {
        multiple: true,
        onChange: (value: string[]) => {
          let storeIdsString = '';
          let i = 1;
          value.map((item) => {
            if (item[1] !== undefined) {
              if (i == 1) {
                storeIdsString = item[1];
              } else {
                storeIdsString += ',' + item[1];
              }
            }
            i++;
          });
          setSearchStoreIds(storeIdsString);
        },
        maxTagCount: 'responsive',
        showCheckedStrategy: 'SHOW_CHILD',
        fieldNames: {
          children: 'children',
          label: 'label',
        },
        //options: cascaderOptions,
        dependencies:['businessId'],
        showSearch: true,
      }
    },
    {
      title: '运营商',
      dataIndex: ['business', 'name'],
      valueType: 'text',
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true,
    },

    {
      title: <FormattedMessage id="pages.create.time" />,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 'sm',
      hideInTable: true,
      fieldProps: { size: 'small' },
      hideInSearch: true,
    },

    {
      title: <FormattedMessage id="pages.update.time" />,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      width: 'sm',
      hideInTable: true,
      fieldProps: { size: 'small' },
      hideInSearch: true,
    },

    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      hideInForm: true,
      width: 'sm',
      valueEnum: {
        NORMAL: {
          text: '正常',
          status: 'Success',
        },
        UNINSTALL: {
          text: '异常',
          status: 'Error',
        },
        LOSS: {
          text: '丢失',
          status: 'Default',
        },
        MAINTENANCE: {
          text: '维修',
          status: 'Error',
        },
        STORETOSTORE: {
          text: '调拨中',
          status: 'Processing',
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
              setEditDetail(true);
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

  const tcolumns: ProColumns<StockLogItem>[] = [
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
      title: '内容',
      dataIndex: 'content',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },

    {
      title: '操作员',
      dataIndex: ['user', 'nick'],
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
  ];

  return (
    <PageContainer>
      <ProTable<StockItem>
        actionRef={actionRef}
        rowKey={(record) => record.id}
        search={{
          labelWidth: 120,
        }}
        pagination={paginationProps}
        request={(params) => {
          if (searchStoreIds !== undefined && searchStoreIds !== '') {
            params.searchStoreIds = searchStoreIds;
          }
          const res = queryStockList({ ...params, category: 'CABINET' });
          res.then((value) => {
            params.pageSize = value.total;
            params.category = 'CABINET';
            if (searchStoreIds !== undefined && searchStoreIds !== '') {
              params.searchStoreIds = searchStoreIds;
            }
            setExportParams(params);
          });
          return res;
        }}
        columns={columns}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => {
          return (
            <Space size={24}>
              <span>
                已选 {selectedRowKeys.length} 项
                <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                  取消选择
                </a>
              </span>
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
                  exportExcel();
                }}
              >
                <ExportOutlined />
                导出
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  handleRemoveByIds(selectedRowKeys, onCleanSelected);
                }}
              >
                <DeleteOutlined />
                删除
              </Button>
            </Space>
          );
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary" size="small" onClick={() => { }}>
            <PlusOutlined /> <FormattedMessage id="pages.new" />
          </Button>,
        ]}
      />
      <StockModel
        done={done}
        open={editDetail}
        current={currentRow || {}}
        onDone={handleDone}
        onSubmit={async (value) => {
          const success = await handleAction(value as StockItem);
          if (success) {
            setEditDetail(false);
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
          <ProDescriptions<StockItem>
            column={1}
            title={currentRow?.number}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<StockItem>[]}
          />
        )}

        {currentRow ? (
          <ProTable<StockLogItem, StockLogParams>
            headerTitle="日志"
            search={false}
            pagination={paginationProps}
            options={false}
            params={cparams}
            rowKey={(record) => record.id}
            request={queryStockLogList}
            columns={tcolumns}
          />
        ) : (
          ''
        )}
      </Drawer>
    </PageContainer>
  );
};
export default StockCabinet;
