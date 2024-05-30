import { DeleteOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, message, Modal, Space, Table } from 'antd';
import React, { useRef, useState } from 'react';
import StoreModel from './components/StoreModel';
import { StoreItem } from './data';
import {
  addStore,
  queryBusinessSelect,
  queryStoreGroupSelect,
  queryStoreList,
  removeStore,
  removeStoreByIds,
  syncFNJStoreList,
  updateStore,
} from './service';

const Spot: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<StoreItem>();
  const [exportParams, setExportParams] = useState({}); //导出参数
  const [ids, setIds] = useState<string>();

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
    storeGroupData.map((item) => {
      storeGroupListOptions[item.id] = {
        text: item.name,
        value: item.id,
      };
      storeGroupDataList[item.id] = item.name;
    });
  }

  const handleSyncFNJStore = async () => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );

    try {
      const { success, data } = await syncFNJStoreList({
        businessId: 1,
      });
      if (success) {
        loadingHidde();
        message.success(data);
        return true;
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

  const handleAction = async (fields: StoreItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      if (fields.id != null) {
        const { success } = await updateStore({
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
        const { success } = await addStore({
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

  const handleRemove = (selectedRows: StoreItem) => {
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
          const { success } = await removeStore({
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

  const columns: ProColumns<StoreItem>[] = [
    {
      title: <FormattedMessage id="pages.store.name" />,
      dataIndex: 'name',
      hideInForm: true,
      hideInSearch: true,
      copyable: true,
      valueType: 'text',
      width: 'md',
      ellipsis: true,
      fieldProps: { placeholder: intl.formatMessage({ id: 'pages.store.name.placeholder' }) },
    },

    {
      title: <FormattedMessage id="pages.store.search.keywords" />,
      dataIndex: 'keywords',
      hideInForm: true,
      hideInTable: true,
      valueType: 'text',
      fieldProps: {
        placeholder: intl.formatMessage({ id: 'pages.store.search.keywords.placeholder' }),
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
      title: "站点分组",
      dataIndex: 'storeGroupId',
      valueType: 'select',
      hideInForm: true,
      hideInTable: true,
      fieldProps: { width: '60px' },
      hideInDescriptions: true,
      valueEnum: storeGroupListOptions,
      // hideInSearch: roleGroup == 'SYSTEM_USER' ? false : true,
    },

    {
      title: '分组',
      dataIndex: ['storeGroup', 'name'],
      hideInSearch: true,
      valueType: 'text',
    },

    {
      title: <FormattedMessage id="pages.store.user.name" />,
      dataIndex: ['user', 'username'],
      hideInSearch: true,
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="pages.store.type" />,
      dataIndex: 'type',
      valueType: 'select',
      hideInForm: true,
      hideInSearch: true,
      width: 'sm',
      valueEnum: {
        STORE: {
          text: '仓库',
        },
        SITE: {
          text: '站点',
        },
        STORE_SITE: {
          text: '仓库与站点',
        },
      },
    },

    {
      title: '使用分类',
      dataIndex: 'useType',
      valueType: 'text',
      hideInForm: true,
      width: 'sm',
      valueEnum: {
        INTERNAL: {
          text: '内部使用',
          type: 'INTERNAL',
        },
        EXTERNAL: {
          text: '外部使用',
          type: 'EXTERNAL',
        },
      },
    },

    {
      title: <FormattedMessage id="pages.store.state" />,
      dataIndex: 'state',
      valueType: 'select',
      hideInForm: true,
      hideInSearch: true,
      valueEnum: {
        NORMAL: {
          text: '正常',
        },
        STOP: {
          text: '停止',
        },
        DETELE: {
          text: '删除',
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
          const { success } = await removeStoreByIds({
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
        <ProTable<StoreItem>
          actionRef={actionRef}
          rowKey={(record) => record.id}
          search={{
            labelWidth: 80,
          }}
          pagination={paginationProps}
          request={(params) => {
            const res = queryStoreList({ ...params });
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
                setVisible(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="pages.new" />
            </Button>,
            <Button
              type="primary"
              key="primary"
              size="small"
              onClick={async () => {
                const success = await handleSyncFNJStore();
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              }}
            >
              <PlusOutlined /> 同步菲尼基站点数据
            </Button>,
          ]}
        />

        <StoreModel
          done={done}
          visible={visible}
          current={currentRow || {}}
          onDone={handleDone}
          onSubmit={async (value) => {
            const success = await handleAction(value as StoreItem);
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
