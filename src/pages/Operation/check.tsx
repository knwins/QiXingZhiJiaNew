import { ProDescriptions, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Drawer, Image, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { ProductCheckItem } from './data';
import { queryProductCheckList, removeProductCheck, updateProductCheck } from './service';
const Spot: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const [currentRow, setCurrentRow] = useState<ProductCheckItem>();
  const [showDetail, setShowDetail] = useState<boolean>(false);

  //国际化
  const intl = useIntl();

  const handleAction = async (fields: ProductCheckItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      if (fields.id != null) {
        const { success } = await updateProductCheck({
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

  const handleRemove = (selectedRows: ProductCheckItem) => {
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
          const { success } = await removeProductCheck({
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

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
  };

  const columns: ProColumns<ProductCheckItem>[] = [
    {
      title: <FormattedMessage id="pages.create.time" />,
      dataIndex: 'createTime',
      hideInSearch: true,
      valueType: 'dateTime',
      width: '180px',
    },

    {
      title: <FormattedMessage id="pages.cabinet.number" />,
      dataIndex: ['product', 'number'],
      valueType: 'text',
      hideInSearch: true,
      hideInForm: true,
      copyable: true,
    },
    {
      title: <FormattedMessage id="pages.cabinet.number.search.keywords" />,
      dataIndex: 'keywords',
      hideInForm: true,
      hideInTable: true,
      hideInDescriptions: true,
      valueType: 'text',
      fieldProps: {
        placeholder: intl.formatMessage({ id: 'pages.cabinet.number.search.keywords.placeholder' }),
      },
    },

    {
      title: <FormattedMessage id="pages.cabinet.address" />,
      dataIndex: 'address',
      valueType: 'text',
      hideInSearch: true,
      hideInForm: true,
    },

    {
      title: <FormattedMessage id="pages.cabinet.check.username" />,
      dataIndex: ['user', 'username'],
      hideInSearch: true,
      valueType: 'text',
    },

    {
      title: <FormattedMessage id="pages.cabinet.state" />,
      dataIndex: 'state',
      valueType: 'select',
      width: 'sm',
      hideInForm: true,
      valueEnum: {
        ABNORMAL: { text: '异常', status: 'Error' },
        NORMAL: { text: '正常', status: 'Processing' },
      },
    },
    {
      title: '分类',
      dataIndex: 'category',
      valueType: 'select',
      width: 'sm',
      hideInForm: true,
      hideInTable: true,
      hideInDescriptions: true,
      valueEnum: {
        CABINET: { text: '充电柜', category: 'CABINET' },
        PILE: { text: '充电桩', category: 'PILE' },
        STAGE: { text: '场站', category: 'STAGE' },
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
            key="detail"
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
          >
            <FormattedMessage id="pages.detail" />
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
        <ProTable<ProductCheckItem>
          actionRef={actionRef}
          rowKey={(record) => record.id}
          search={{
            labelWidth: 80,
          }}
          pagination={paginationProps}
          request={queryProductCheckList}
          columns={columns}
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
            <ProDescriptions<ProductCheckItem>
              column={1}
              request={async () => ({
                data: currentRow || {},
              })}
              params={{
                id: currentRow?.id,
              }}
              columns={columns as ProDescriptionsItemProps<ProductCheckItem>[]}
            >
              <ProDescriptions.Item
                span={1}
                valueType="text"
                ellipsis
                label={
                  currentRow.product.category == 'CABINET'
                    ? '柜点地面是否符合安装要求'
                    : '场站外观、内部设备摆放是否干净整洁'
                }
              >
                {currentRow.input0 ? '是' : '否'}
              </ProDescriptions.Item>

              <ProDescriptions.Item
                span={1}
                valueType="text"
                contentStyle={{
                  maxWidth: '80%',
                }}
                renderText={(_) => {
                  return _;
                }}
                ellipsis
                label={
                  currentRow.product.category == 'CABINET'
                    ? '地线安装是否符合要求'
                    : '场站外部与内部管线、消防设备是否正常'
                }
              >
                {currentRow.input1 ? '是' : '否'}
              </ProDescriptions.Item>

              <ProDescriptions.Item
                span={1}
                valueType="text"
                contentStyle={{
                  maxWidth: '80%',
                }}
                renderText={(_) => {
                  return _;
                }}
                ellipsis
                label={
                  currentRow.product.category == 'CABINET'
                    ? '电线是否完好无破损'
                    : '场站内部各类设备是否工问题正常'
                }
              >
                {currentRow.input2 ? '是' : '否'}
              </ProDescriptions.Item>

              <ProDescriptions.Item
                span={1}
                valueType="text"
                contentStyle={{
                  maxWidth: '80%',
                }}
                renderText={(_) => {
                  return _;
                }}
                ellipsis
                label={
                  currentRow.product.category == 'CABINET'
                    ? '电柜是否稳固'
                    : '如有广告位广告展示是否正常'
                }
              >
                {currentRow.input3 ? '是' : '否'}
              </ProDescriptions.Item>

              <ProDescriptions.Item
                span={1}
                valueType="text"
                contentStyle={{
                  maxWidth: '80%',
                }}
                renderText={(_) => {
                  return _;
                }}
                ellipsis
                label={
                  currentRow.product.category == 'CABINET'
                    ? '电柜是否完好无损坏'
                    : '工作人员是否在岗'
                }
              >
                {currentRow.input4 ? '是' : '否'}
              </ProDescriptions.Item>

              <ProDescriptions.Item
                span={1}
                valueType="text"
                contentStyle={{
                  maxWidth: '80%',
                }}
                renderText={(_) => {
                  return _;
                }}
                ellipsis
                label={`巡检图片${currentRow.imgs.length}张`}
              >
                <Image.PreviewGroup
                  preview={{
                    onChange: (current, prev) =>
                      console.log(`current index: ${current}, prev index: ${prev}`),
                  }}
                >
                  <Image width={80} src={currentRow.imgs[0]} />{' '}
                  <Image width={80} src={currentRow.imgs[1]} />{' '}
                  <Image width={80} src={currentRow.imgs[2]} />
                </Image.PreviewGroup>
              </ProDescriptions.Item>

              <ProDescriptions.Item
                span={1}
                valueType="text"
                contentStyle={{
                  maxWidth: '80%',
                }}
                renderText={(_) => {
                  return _;
                }}
                ellipsis
                label="备注"
              >
                {currentRow.inro ? currentRow.inro : '-'}
              </ProDescriptions.Item>
            </ProDescriptions>
          )}
        </Drawer>
      </PageContainer>
    </div>
  );
};
export default Spot;
