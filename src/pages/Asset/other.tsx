import { DeleteOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, Drawer, message, Modal, Space, Table } from 'antd';
import React, { useRef, useState } from 'react';
import { queryBusinessSelect, queryStoreSelect } from '../Operation/service';
import { queryOptionSelect } from '../Setting/service';
import ProductModel from './components/OtherModel';
import { ProductItem, ProductLogItem, ProductLogParams, ProductStockItem } from './data';
import {
  addProduct,
  createProductLog,
  exportProductList,
  queryProductList,
  queryProductLogList,
  removeProduct,
  removeProductByIds,
  updateProduct,
} from './service';

const Spot: React.FC = () => {
  //const inpRef = useRef();
  const actionRef = useRef<ActionType>();
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [logVisible, setLogVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ProductItem>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [stockVisible, setStockVisible] = useState<boolean>(false);
  const [exportParams, setExportParams] = useState({}); //导出参数
  const [ids, setIds] = useState<string>();

  let roleGroup = localStorage.getItem('roleGroup');

  //国际化
  const intl = useIntl();
  //读取属性数据
  const { data } = useRequest(() => {
    return queryOptionSelect({
      current: 1,
      pageSize: 100000,
      type: 'OTHER',
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

  //读取仓库数据
  const { data: store } = useRequest(() => {
    return queryStoreSelect({
      current: 1,
      pageSize: 100,
    });
  });
  const storeListOptions = {};
  const storeListData = {};
  const storeData = store || [];
  if (storeData) {
    storeData.map((item) => {
      storeListOptions[item.id] = {
        text: item.name,
        value: item.id,
      };
      storeListData[item.id] = item.name;
    });
  }

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

  /**
   * Product Stock 操作
   * @param fields
   * @returns
   */
  const handleStockAction = async (fields: ProductStockItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      if (fields.action == 'createProductStock') {
        const { success } = await createProductStock({
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
    setCurrentRow(undefined);
    setStockVisible(false);
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

  // 模板下载
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
      title: <FormattedMessage id="pages.product.brand" />,
      dataIndex: 'brandId',
      valueType: 'select',
      hideInForm: true,
      hideInTable: true,
      hideInDescriptions: true,
      width: '80px',
      valueEnum: brandListOptions,
    },

    {
      title: <FormattedMessage id="pages.product.store" />,
      dataIndex: ['store', 'name'],
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
    },

    {
      title: <FormattedMessage id="pages.product.brand" />,
      dataIndex: ['brand', 'name'],
      valueType: 'text',
      hideInForm: true,
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
      hideInSearch: roleGroup == 'SYSTEM_USER' ? false : true,
      valueEnum: businessListOptions,
    },

    {
      title: <FormattedMessage id="pages.product.business" />,
      dataIndex: ['business', 'name'],
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
    },

    {
      title: <FormattedMessage id="pages.product.spec" />,
      dataIndex: ['spec', 'name'],
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
    },

    {
      title: <FormattedMessage id="pages.product.weight" />,
      dataIndex: 'weight',
      valueType: 'text',
      hideInSearch: true,
      hideInForm: true,
      hideInTable: true,
      hideInDescriptions: currentRow?.weight == '' ? true : false,
    },

    {
      title: <FormattedMessage id="pages.product.material" />,
      dataIndex: 'material',
      valueType: 'text',
      hideInSearch: true,
      hideInForm: true,
      hideInTable: true,
      hideInDescriptions: currentRow?.material == '' ? true : false,
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
            key="create"
            onClick={() => {
              setCurrentRow(record);
              setLogVisible(true);
            }}
          >
            <FormattedMessage id="pages.product.log.create" />
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
        AddStore: {
          text: '添库存',
          type: 'AddStore',
        },
        SubStore: {
          text: '减库存',
          type: 'SubStore',
        },
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
      <ProTable<ProductItem>
        headerTitle={intl.formatMessage({
          id: 'pages.product.other.title',
        })}
        actionRef={actionRef}
        rowKey={(record) => record.id}
        search={{
          labelWidth: 120,
        }}
        pagination={paginationProps}
        request={(params) => {
          const res = queryProductList({ ...params, category: 'OTHER' });
          res.then((value) => {
            params.pageSize = value.total;
            params.category = 'OTHER';
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
        tableAlertOptionRender={() => {
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
export default Spot;
