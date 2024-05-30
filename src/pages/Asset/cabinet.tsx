import {
  DeleteOutlined,
  DownOutlined,
  ExportOutlined,
  PlusOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, Drawer, Dropdown, Menu, message, Modal, Space, Table } from 'antd';
import React, { useRef, useState } from 'react';
import { StoreParams } from '../Operation/data';
import { queryBusinessSelect, queryStoreSelect, queryStoreTreeSelect } from '../Operation/service';
import { queryOptionSelect } from '../Setting/service';
import BatchProductLogModel from './components/BatchProductLogModel';
import CabinetDetailModel from './components/CabinetDetailModel';
import ProductModel from './components/CabinetModel';
import ProductLogModel from './components/ProductLogModel';
import ProductLogsModel from './components/ProductLogsModel';
import {
  CabinetDetailItem,
  Pagination,
  ProductItem,
  ProductLogBatchItem,
  ProductLogItem,
  ProductLogParams,
} from './data';
import {
  addProduct,
  addProductLog,
  batchCreateProductLog,
  createProductLog,
  exportProductList,
  getCabinetDetail,
  getProductDetail,
  queryProductList,
  queryProductLogList,
  removeProduct,
  removeProductByIds,
  submitProductLog,
  updateProduct,
} from './service';
const Cabinet: React.FC = () => {
  //const inpRef = useRef();
  const actionRef = useRef<ActionType>();
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [logVisible, setLogVisible] = useState<boolean>(false);
  const [logAllVisible, setLogAllVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ProductItem>();
  const [currentBatch, setCurrentBatch] = useState<ProductLogBatchItem>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [exportParams, setExportParams] = useState({}); //导出参数
  const [ids, setIds] = useState<string>();
  const [logsVisible, setLogsVisible] = useState<boolean>(false);
  const [cabinetDetail, setCabinetDetail] = useState<CabinetDetailItem>();
  const [showCabinetDetail, setShowCabinetDetail] = useState<boolean>(false);
  const [searchStoreIds, setSearchStoreIds] = useState<string>('');
  const [searchBusinessId,setSearchBusinessId]= useState<string>('');

  let roleGroup = localStorage.getItem('roleGroup');

  //国际化
  const intl = useIntl();

  //读取属性数据
  const { data } = useRequest(() => {
    return queryOptionSelect({
      current: 1,
      pageSize: 10000,
      type: 'CABINET',
    });
  });

  //读取属性数据
  const { data: businessData } = useRequest(() => {
    return queryBusinessSelect({
      current: 1,
      pageSize: 100000,
    });
  });

  const businessListOptions = {};
  const brandListOptions = {};
  const specListOptions = {};

  //Execl导出数据使用
  const businessListData = {};
  const brandListData = {};
  const specListData = {};

  if (businessData) {
    businessData.map((item) => {
      businessListOptions[item.id] = {
        text: item.name,
        value: item.id,
      };
      businessListData[item.id] = item.name;
    });
  }

  if (data?.brand) {
    const brandData = data?.brand || [];
    if (brandData) {
      brandData.map((item) => {
        brandListOptions[item.id] = {
          text: item.name,
          value: item.id,
        };
        brandListData[item.id] = item.name;
      });
    }
  }

  if (data?.spec) {
    const specData = data?.spec || [];
    if (specData) {
      specData.map((item) => {
        specListOptions[item.id] = {
          text: item.name,
          value: item.id,
        };
        specListData[item.id] = item.name;
      });
    }
  }

  // //读取仓库数据
  // const { data: store } = useRequest(() => {
  //   return queryStoreSelect({
  //     current: 1,
  //     pageSize: 100000,
  //   });
  // });
  // const storeListOptions = {};
  // const storeListData = {};
  // const storeData = store || [];
  // if (storeData) {
  //   storeData.map((item) => {
  //     storeListOptions[item.id] = {
  //       text: item.name,
  //       value: item.id,
  //     };
  //     storeListData[item.id] = item.name;
  //   });
  // }

  //读取仓库树数据
  const { data: cascaderOptions } = useRequest(() => {
    return queryStoreTreeSelect({
      current: 1,
      pageSize: 100000,
      businessId:searchBusinessId,
    });
  });

  const handleProductLogsAction = async (fields: ProductLogItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      const { success } = await addProductLog({
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
  const handleAction = async (fields: ProductItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      if (fields.action == 'createProductLog') {
        const { success } = await createProductLog({
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
      } else if (fields.id != null) {
        const { success } = await updateProduct({
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
        const { success } = await addProduct({
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

  const handleRemove = (selectedRows: ProductItem) => {
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
          const { success } = await removeProduct({
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

  const handleSubmitProductLog = (selectedRows: ProductItem) => {
    Modal.confirm({
      title: intl.formatMessage({
        id: 'pages.tip.title',
      }),
      content: '您要确认到货吗?',
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
          const { success } = await submitProductLog({
            id: selectedRows.id,
          });

          if (success) {
            loadingHidde();
            message.success(
              intl.formatMessage({
                id: 'pages.tip.success',
              }),
            );
            actionRef.current?.clearSelected;
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

  const handleBatchAction = async (fields: ProductLogBatchItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      if (fields.action == 'batchCreateProductLog') {
        const { success, data } = await batchCreateProductLog({
          ...fields,
        });
        if (success) {
          message.success(data);
          return true;
        }
        actionRef.current?.clearSelected;
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

  //批量删除数据
  const handleRemoveByIds = () => {
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
        console.log(ids);
        if (!ids) return true;
        try {
          const loadingHidde = message.loading(
            intl.formatMessage({
              id: 'pages.tip.loading',
            }),
          );
          const { success } = await removeProductByIds({
            ids: ids,
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

  const handleDone = () => {
    setDone(false);
    setVisible(false);
    setLogVisible(false);
    setLogAllVisible(false);
    setCurrentRow(undefined);
    setShowCabinetDetail(false);
    setLogsVisible(false);
  };

  //导出数据
  const exportExcel = async () => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    const { success, data, errorMessage } = await exportProductList({ ...exportParams });
    if (success) {
      loadingHidde();
      window.open(data);
    } else {
      message.error(errorMessage);
    }
  };

  // // 模板下载
  // const jumpToTemplate = async (templateHref: any) => {
  //   window.open(templateHref);
  // };
  const onChange = (value: any) => {
    console.log(value);
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
  };
  const cparams: ProductLogParams = {
    productId: currentRow?.id,
  };

  const columns: ProColumns<ProductItem>[] = [
    {
      title: <FormattedMessage id="pages.product.search.keywords" />,
      dataIndex: 'keywords',
      hideInForm: true,
      hideInTable: true,
      hideInDescriptions: true,
      valueType: 'text',
      fieldProps: {
        placeholder: intl.formatMessage({ id: 'pages.product.search.keywords.placeholder' }),
      },
    },
    {
      title: <FormattedMessage id="pages.product.number" />,
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
              const { success, data } = await getProductDetail({
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
      title: <FormattedMessage id="pages.product.brand" />,
      dataIndex: 'brandId',
      valueType: 'select',
      hideInForm: true,
      hideInTable: true,
      hideInDescriptions: true,
      hideInSearch: true,
      width: '80px',
      ellipsis: true,
      valueEnum: brandListOptions,
    },

    {
      title: '所属站点或仓库',
      dataIndex: ['store', 'name'],
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      ellipsis: true,
      hideInTable: true,
      width: 'lg',
    },

    {
      title: '网点位置',
      dataIndex: ['address', 'fullAddress'],
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      ellipsis: true,
      hideInTable: true,
      width: 'lg',
    },
    {
      title: 'GPS位置',
      dataIndex: 'gpsAddress',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      ellipsis: true,
      width: 'lg',
    },

    {
      title: 'GPS时间',
      dataIndex: 'locationTime',
      valueType: 'dateTime',
      width: 'sm',
      fieldProps: { size: 'small' },
      hideInSearch: true,
      sorter: true,
    },

    {
      title: <FormattedMessage id="pages.product.brand" />,
      dataIndex: ['brand', 'name'],
      valueType: 'text',
      hideInForm: true,
      hideInTable: true,
      width: 'sm',
      fieldProps: { width: '60px' },
      hideInSearch: true,
    },

    {
      title: <FormattedMessage id="pages.product.business" />,
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
      }
    },

    {
      title: '站点(多选)',
      dataIndex: 'searchStoreIds',
      key: 'searchStoreIds',
      valueType: 'cascader',
      hideInForm: true,
      hideInTable: true,
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
        showSearch:true
      },
    },
    {
      title: <FormattedMessage id="pages.product.business" />,
      dataIndex: ['business', 'name'],
      valueType: 'text',
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true,
    },

    {
      title: <FormattedMessage id="pages.product.spec" />,
      dataIndex: ['spec', 'name'],
      valueType: 'text',
      hideInForm: true,
      hideInTable: true,
      width: 'sm',
      fieldProps: { width: '60px' },
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
      title: '上架时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 'sm',
      fieldProps: { size: 'small' },
      hideInSearch: true,
      hideInTable: true,
    },

    {
      title: <FormattedMessage id="pages.product.state" />,
      dataIndex: 'state',
      valueType: 'select',
      hideInForm: true,
      width: 'sm',
      valueEnum: {
        NORMAL: {
          text: '正常',
          status: 'Success',
        },
        STORE_STOCK: {
          text: '仓库库存',
          status: 'Success',
        },
        SITE_STOCK: {
          text: '站点库存',
          status: 'Success',
        },
        ABNORMAL: {
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
        PROCESSING: {
          text: '处理中',
          status: 'Processing',
        },
        NOPLATFORM: {
          text: '未找到设备',
          status: 'Error',
        },
        NODATA: {
          text: '无定位数据',
          status: 'Error',
        },

        STORETOSTORE: {
          text: '调拨中',
          status: 'Processing',
        },
      },
    },

    {
      title: '异常(天)',
      dataIndex: 'abnormalDays',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: true,
      hideInForm: true,
      hideInDescriptions: currentRow?.abnormalDays == '' ? true : false,
    },

    {
      title: <FormattedMessage id="pages.option" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      render: (_, record) => {
        {
          return [
            <a
              key="detail"
              onClick={async () => {
                const { data } = await getCabinetDetail({
                  id: record.detailId,
                });
                if (data) {
                  setCabinetDetail(data);
                  setShowCabinetDetail(true);
                }
              }}
            >
              详情
            </a>,
            <a
              key="create"
              onClick={async () => {
                const { data } = await getProductDetail({
                  id: record.id,
                });
                if (data) {
                  setCurrentRow(data);
                  setLogVisible(true);
                }
              }}
            >
              <FormattedMessage id="pages.product.log.create" />
            </a>,
            <MoreBtn key="more" item={record} />,
          ];
        }
      },
    },
  ];

  const tcolumns: ProColumns<ProductLogItem>[] = [
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
      title: <FormattedMessage id="pages.product.log.content" />,
      dataIndex: 'content',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: <FormattedMessage id="pages.product.log.type" />,
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
      title: <FormattedMessage id="pages.product.log.username" />,
      dataIndex: ['user', 'nick'],
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
  ];

  //更多
  const MoreBtn: React.FC<{
    item: ProductItem;
  }> = ({ item }) => (
    <Dropdown
      key="Dropdown"
      overlay={
        <Menu
          onClick={async ({ key }) => {
            if (key == 'edit') {
              const { success, data } = await getProductDetail({
                id: item.id,
              });
              const loadingHidde = message.loading(
                intl.formatMessage({
                  id: 'pages.tip.loading',
                }),
              );
              if (success) {
                loadingHidde();
                setCurrentRow(data);
                setVisible(true);
              }
            } else if (key == 'submitProductLog') {
              handleSubmitProductLog(item);
            } else if (key == 'delete') {
              handleRemove(item);
            } else if (key == 'addLogs') {
              setCurrentRow(item);
              setLogsVisible(true);
            }
          }}
        >
          <Menu.Item key="addLogs">日志</Menu.Item>
          <Menu.Item
            key="submitProductLog"
            disabled={item?.state === 'STORETOSTORE' ? false : true}
          >
            确认到货
          </Menu.Item>
          <Menu.Item key="edit">
            <FormattedMessage id="pages.edit" />
          </Menu.Item>
          <Menu.Item key="delete">
            <FormattedMessage id="pages.delete" />
          </Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );

  return (
    <PageContainer>
      <ProTable<ProductItem>
        headerTitle={intl.formatMessage({
          id: 'pages.product.cabinet.title',
        })}
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
          const res = queryProductList({ ...params, category: 'CABINET' });
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
        tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
          //console.log(selectedRowKeys, selectedRows);
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
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  const ProductLogBatch: ProductLogBatchItem = {};
                  ProductLogBatch.ids = ids;
                  setCurrentBatch(ProductLogBatch);
                  setLogAllVisible(true);
                }}
              >
                <ShareAltOutlined />
                调拨
              </Button>
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
                  handleRemoveByIds();
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

      <ProductModel
        done={done}
        visible={visible}
        current={currentRow || {}}
        onDone={handleDone}
        onSubmit={async (value) => {
          const success = await handleAction(value as ProductItem);
          if (success) {
            setVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current?.clearSelected;
              actionRef.current.reload();
            }
          }
        }}
      />

      <ProductLogModel
        done={done}
        visible={logVisible}
        current={currentRow || {}}
        onDone={handleDone}
        onSubmit={async (value) => {
          const success = await handleAction(value as ProductItem);
          if (success) {
            setLogVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current?.clearSelected;
              actionRef.current.reload();
            }
          }
        }}
      />

      <ProductLogsModel
        done={done}
        visible={logsVisible}
        productId={currentRow?.id || ''}
        onDone={handleDone}
        onSubmit={async (value) => {
          const success = await handleProductLogsAction(value as ProductLogItem);
          if (success) {
            setLogsVisible(false);
            if (actionRef.current) {
              actionRef.current?.clearSelected;
              actionRef.current.reload();
            }
          }
          return;
        }}
      />

      <BatchProductLogModel
        done={done}
        visible={logAllVisible}
        current={currentBatch || {}}
        onDone={handleDone}
        onSubmit={async (value) => {
          const success = await handleBatchAction(value as ProductLogBatchItem);
          if (success) {
            setLogAllVisible(false);
            setCurrentBatch(undefined);
            if (actionRef.current) {
              actionRef.current?.clearSelected;
              actionRef.current.reload();
            }
          }
        }}
      />

      <CabinetDetailModel
        done={done}
        visible={showCabinetDetail}
        current={cabinetDetail || {}}
        onDone={handleDone}
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
          <ProDescriptions<ProductItem>
            column={1}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<ProductItem>[]}
          />
        )}

        {currentRow ? (
          <ProTable<ProductLogItem, ProductLogParams>
            headerTitle={intl.formatMessage({
              id: 'pages.product.log.title',
            })}
            search={false}
            pagination={paginationProps}
            options={false}
            params={cparams}
            rowKey={(record) => record.id}
            request={queryProductLogList}
            columns={tcolumns}
          />
        ) : (
          ''
        )}
      </Drawer>
    </PageContainer>
  );
};
export default Cabinet;
