import { DeleteOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, Drawer, message, Modal, Space, Table } from 'antd';
import React, { useRef, useState } from 'react';
import { queryBusinessSelect, queryStoreTreeSelect } from '../Operation/service';
import { queryOptionSelect } from '../Setting/service';
import { StockItem, StockLogItem, StockLogParams } from './data';
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
const StockCell: React.FC = () => {
  //const inpRef = useRef();
  const actionRef = useRef<ActionType>();
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [logVisible, setLogVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<StockItem>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [exportParams, setExportParams] = useState({}); //导出参数
  const [ids, setIds] = useState<string>();
  const [logsVisible, setLogsVisible] = useState<boolean>(false);
  const [searchStoreIds, setSearchStoreIds] = useState<string>('');
  const [searchBusinessId, setSearchBusinessId] = useState<string>('');

  let roleGroup = localStorage.getItem('roleGroup');

  //国际化
  const intl = useIntl();

  //读取属性数据
  const { data } = useRequest(() => {
    return queryOptionSelect({
      current: 1,
      pageSize: 10000,
      type: 'CELL',
    });
  });

  //读取运营商数据
  const { data: businessData } = useRequest(() => {
    return queryBusinessSelect({
      current: 1,
      pageSize: 100000,
    });
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

  // if (data?.ownership) {
  //   const ownershipData = data?.ownership || [];
  //   if (ownershipData) {
  //     ownershipData.map((item) => {
  //       ownershipListOptions[item.id] = {
  //         text: item.name,
  //         value: item.id,
  //       };
  //       ownershipListData[item.id] = item.name;
  //     });
  //   }
  // }

  //读取仓库树数据
  const { data: cascaderOptions } = useRequest(() => {
    return queryStoreTreeSelect({
      current: 1,
      useType: 'INTERNAL',
    });
  });

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
  const handleRemoveByIds = (selectedRowKeys:any,onCleanSelected:any) => {
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
    setVisible(false);
    setLogVisible(false);
    setCurrentRow(undefined);
    setLogsVisible(false);
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
    StockId: currentRow?.id,
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
      title: '所属站点或仓库',
      dataIndex: ['store', 'name'],
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      ellipsis: true,
      width: 'lg',
    },
    {
      title: '群组',
      dataIndex: ['store', 'storeGroup', 'name'],
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      ellipsis: true,
      width: 'lg',
    },

    {
      title: '运营商',
      dataIndex: 'businessId',
      valueType: 'select',
      width: '80px',
      hideInForm: true,
      hideInTable: true,
      hideInDescriptions: true,
      valueEnum: businessListOptions,
      hideInSearch: roleGroup == 'SYSTEM_USER' ? false : true,
      fieldProps: {
        onChange: (value: string) => {
          setSearchBusinessId(value);
        },
      },
    },

    {
      title: '站点(多选)',
      dataIndex: 'searchStoreIds',
      key: 'searchStoreIds',
      valueType: 'cascader',
      hideInForm: true,
      hideInTable: true,
      hideInDescriptions: true,
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
        options: cascaderOptions,
        showSearch: true,
      },
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
      title: <FormattedMessage id="pages.update.time" />,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      width: 'sm',
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
      title: '操作',
      dataIndex: 'type',
      valueType: 'select',
      hideInSearch: true,
      ellipsis: true,
      valueEnum: {
        InStore: {
          text: '入库',
          type: 'InStore',
        },
        StoreToStore: {
          text: '调拨',
          type: 'StoreToStore',
        },

        OutStore: {
          text: '出库',
          type: 'OutStore',
        },
        Log: {
          text: '日志',
          type: 'Log',
        },
      },
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
          const res = queryStockList({ ...params, category: 'CELL' });
          res.then((value) => {
            params.pageSize = value.total;
            params.category = 'CELL';
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
        tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
          let idsStr = '';
          for (let i = 0; i < selectedRows.length; i += 1) {
            const item = selectedRows[i];
            if (item) {
              if (i == 0) {
                idsStr += item.id;
              } else {
                idsStr += ',' + item.id;
              }
            }
          }
          setIds(idsStr);
          return (
            <Space size={24}>
              <span>
                已选 {selectedRowKeys.length} 项
                <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                  取消选择
                </a>
                {/* 已经选择IDS:{ids} */}
              </span>
            </Space>
          );
        }}
        tableAlertOptionRender={({ selectedRowKeys,onCleanSelected }) => {
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
                  handleRemoveByIds(selectedRowKeys,onCleanSelected);
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
              setVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.new" />
          </Button>,
        ]}
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
            title={currentRow?.name}
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
export default StockCell;
