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
import { Button, Drawer, Dropdown, Menu, Modal, Space, Table } from 'antd';
import { message } from 'antd/lib';
import React, { useRef, useState } from 'react';
import { queryBusinessSelect,  queryStoreTreeSelect } from '../Operation/service';
import { queryOptionSelect } from '../Setting/service';
import BatchProductLogModel from './components/BatchProductLogModel';
import BatchProductLogSubmitModel from './components/BatchProductLogSubmitModel';
import BatteryDetailModel from './components/BatteryDetailModel';
import ProductModel from './components/CellModel';
import ProductLogModel from './components/ProductLogModel';

import ProductLogsModel from './components/ProductLogsModel';

import {
  BatteryDetailItem,
  ProductItem,
  ProductLogBatchItem,
  ProductLogItem,
  ProductLogParams,
  ProductParams,
} from './data';
import {
  addProduct,
  addProductLog,
  batchCreateProductLog,
  batchSubmitProductLog,
  createProductLog,
  exportProductList,
  getBatteryDetail,
  getProductDetail,
  queryProductList,
  queryProductLogList,
  removeProduct,
  removeProductByIds,
  submitProductLog,
  updateProduct,
} from './service';

const Cell: React.FC = () => {
  //const inpRef = useRef();
  const actionRef = useRef<ActionType>();
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [logVisible, setLogVisible] = useState<boolean>(false);
  const [logAllVisible, setLogAllVisible] = useState<boolean>(false);
  const [logAllSubmitVisible, setLogAllSubmitVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ProductItem>();
  const [batteryDetail, setBatteryDetail] = useState<BatteryDetailItem>();
  const [currentBatch, setCurrentBatch] = useState<ProductLogBatchItem>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showBatteryDetail, setShowBatteryDetail] = useState<boolean>(false);
  const [logsVisible, setLogsVisible] = useState<boolean>(false);
  const [params, setParams] = useState<Partial<ProductParams> | undefined>(undefined);
  const [exportParams, setExportParams] = useState({}); //导出参数
  const [ids, setIds] = useState<string>();
  const [searchStoreIds, setSearchStoreIds] = useState<string>('');

  let roleGroup = localStorage.getItem('roleGroup');

  //国际化
  const intl = useIntl();
  //读取属性数据
  const { data } = useRequest(() => {
    return queryOptionSelect({
      current: 1,
      pageSize: 100000,
      type: 'CELL',
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
  //     pageSize: 100,
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
    });
  });

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
      } else if (fields.action == 'batchSubmitProductLog') {
        const { success, data } = await batchSubmitProductLog({
          ...fields,
        });
        if (success) {
          message.success(data);
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
    setLogAllSubmitVisible(false);
    setCurrentRow(undefined);
    setLogsVisible(false);
    setShowBatteryDetail(false);
  };

  const handleLogsDone = () => {
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

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
  };
  const cparams: ProductLogParams = {
    productId: currentRow?.id,
  };

  //更多
  const MoreBtn: React.FC<{
    item: ProductItem;
  }> = ({ item }) => (
    <Dropdown
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
      title: '类型',
      dataIndex: 'storeType',
      valueType: 'select',
      width: 'sm',
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true,
      hideInDescriptions: true,
      valueEnum: {
        SITE: {
          text: '站点',
        },
        STORE: {
          text: '仓库',
        },
      },
    },

    {
      title: <FormattedMessage id="pages.product.number" />,
      dataIndex: 'number',
      hideInForm: true,
      hideInSearch: true,
      copyable: true,
      ellipsis: true,
      valueType: 'text',
      render: (dom, entity) => {
        return (
          <a
            onClick={async () => {
              const { success, data } = await getProductDetail({
                id: entity.id,
              });
              const loadingHidde = message.loading(
                intl.formatMessage({
                  id: 'pages.tip.loading',
                }),
              );
              if (success) {
                loadingHidde();
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
      valueEnum: brandListOptions,
      hideInSearch: true,
      ellipsis: true,
    },

    {
      title: '所属站点或仓库',
      dataIndex: ['store', 'name'],
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
      width: 'lg',
      ellipsis: true,
    },
    {
      title: '位置',
      dataIndex: 'gpsAddress',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: currentRow?.gpsAddress == '' ? true : false,
      width: 'lg',
      ellipsis: true,
    },

    {
      title: <FormattedMessage id="pages.product.brand" />,
      dataIndex: ['brand', 'name'],
      valueType: 'text',
      hideInForm: true,
      hideInTable: true,
      width: 'sm',
      hideInSearch: true,
      ellipsis: true,
    },

    {
      title: <FormattedMessage id="pages.product.business" />,
      dataIndex: ['business', 'name'],
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },

    {
      title: <FormattedMessage id="pages.product.spec" />,
      dataIndex: ['spec', 'name'],
      valueType: 'text',
      width: 'sm',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },

    {
      title: <FormattedMessage id="pages.product.weight" />,
      dataIndex: 'weight',
      valueType: 'text',
      hideInSearch: true,
      hideInForm: true,
      hideInTable: true,
      hideInDescriptions: currentRow?.weight ? false : true,
    },

    {
      title: <FormattedMessage id="pages.product.material" />,
      dataIndex: 'material',
      valueType: 'text',
      hideInSearch: true,
      hideInForm: true,
      hideInTable: true,
      hideInDescriptions: currentRow?.material ? false : true,
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
      title: '入库时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      fieldProps: { size: '10' },
      width: 'md',
      hideInSearch: true,
      hideInTable: true,
    },

    {
      title: '读取时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      width: 'sm',
      fieldProps: { size: 'small' },
      hideInSearch: true,
      hideInTable: true,
    },

    {
      title: '定位时间',
      dataIndex: 'locationTime',
      valueType: 'dateTime',
      width: 'sm',
      fieldProps: { size: 'small' },
      hideInSearch: true,
      sorter: true,
    },

    {
      title: '运营时间',
      dataIndex: 'exchangeTime',
      valueType: 'dateTime',
      width: 'sm',
      fieldProps: { size: 'small' },
      hideInSearch: true,
    },

    {
      title: '运营信息',
      dataIndex: 'exchangeContent',
      valueType: 'text',
      width: 'sm',
      fieldProps: { size: 'small' },
      hideInSearch: true,
      hideInTable: true,
    },

    {
      title: '换电(次)',
      dataIndex: 'exchangeTotal',
      valueType: 'digit',
      width: '100px',
      fieldProps: { size: 'small' },
      hideInSearch: true,
      sortDirections: ['ascend', 'descend'],
      sorter: true,
    },

    {
      title: '异常(天)',
      dataIndex: 'abnormalDays',
      valueType: 'digit',
      width: '100px',
      fieldProps: { size: 'small' },
      hideInSearch: true,
      hideInTable: params?.state == 'ABNORMAL' ? false : true,
      hideInDescriptions: currentRow?.state == 'ABNORMAL' ? false : true,
      sorter: true,
    },

    {
      title: <FormattedMessage id="pages.product.store" />,
      dataIndex: ['store', 'type'],
      valueType: 'select',
      width: '60px',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
      hideInDescriptions: true,
      valueEnum: {
        SITE: {
          text: '站点',
        },
        STORE: {
          text: '仓库',
        },
      },
    },

    {
      title: <FormattedMessage id="pages.product.state" />,
      dataIndex: 'state',
      valueType: 'select',
      hideInForm: true,
      width: '120px',
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
        VIRTUAL: {
          text: '虚拟设备',
          status: 'Default',
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
      fieldProps: { width: '200' },
      hideInDescriptions: true,
      render: (_, record) => {
        return [
          <a
            key="detail"
            onClick={async () => {
              const { data } = await getBatteryDetail({
                id: record.detailId,
              });
              if (data) {
                setBatteryDetail(data);
                setShowBatteryDetail(true);
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

  return (
    <PageContainer>
      <ProTable<ProductItem, ProductParams>
        headerTitle={intl.formatMessage({
          id: 'pages.product.cell.title',
        })}
        actionRef={actionRef}
        rowKey={(record) => record.id}
        search={{
          labelWidth: 120,
          split: true,
        }}
        params={params}
        pagination={paginationProps}
        request={(params) => {
          if (searchStoreIds !== undefined && searchStoreIds !== '') {
            params.searchStoreIds = searchStoreIds;
          }
          const res = queryProductList({ ...params, category: 'CELL' });
          //保留总记录数用于导出参数
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
        onChange={(pagination, filters: any, sorter: any) => {
          if (sorter) {
            sorter.order = sorter.order === 'descend' ? 'DESC' : 'ASC';

            switch (sorter.field) {
              case 'exchangeTotal':
                sorter.field = 'exchange_total';
                break;
              case 'locationTime':
                sorter.field = 'location_time';
                break;
              case 'abnormalDays':
                sorter.field = 'abnormal_days';
                break;
              default:
                break;
            }
            const params: ProductParams = {
              sorter: sorter.order,
              filter: sorter.field,
            };
            setParams(params);
          }
        }}
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
                批量调拨操作
              </Button>

              <Button
                type="primary"
                size="small"
                onClick={() => {
                  const ProductLogBatch: ProductLogBatchItem = {};
                  ProductLogBatch.ids = ids;
                  setCurrentBatch(ProductLogBatch);
                  setLogAllSubmitVisible(true);
                }}
              >
                <ShareAltOutlined />
                批量确认收货
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

          // <Upload {...uploadProps}>
          //   <Button icon={<ImportOutlined />} type="primary" size="small">
          //     导入
          //   </Button>
          // </Upload>,
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

      <BatchProductLogSubmitModel
        done={done}
        visible={logAllSubmitVisible}
        current={currentBatch || {}}
        onDone={handleDone}
        onSubmit={async (value) => {
          const success = await handleBatchAction(value as ProductLogBatchItem);
          if (success) {
            setLogAllSubmitVisible(false);
            setCurrentBatch(undefined);
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
        onDone={handleLogsDone}
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

      <BatteryDetailModel
        done={done}
        visible={showBatteryDetail}
        current={batteryDetail || {}}
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
          <>
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
          </>
        )}

        {currentRow ? (
          <>
            <ProTable<ProductLogItem, ProductLogParams>
              headerTitle={intl.formatMessage({
                id: 'pages.product.log.title',
              })}
              search={false}
              pagination={paginationProps}
              options={false}
              params={cparams}
              toolBarRender={() => [
                <Button
                  type="primary"
                  key="primary"
                  size="small"
                  onClick={() => {
                    //setCurrentRow(item);
                    setLogsVisible(true);
                  }}
                >
                  <PlusOutlined /> <FormattedMessage id="pages.new" />
                </Button>,
              ]}
              rowKey={(record) => record.id}
              request={queryProductLogList}
              columns={tcolumns}
            />
          </>
        ) : (
          ''
        )}
      </Drawer>
    </PageContainer>
  );
};
export default Cell;
