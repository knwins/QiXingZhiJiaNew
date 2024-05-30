import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import OptionModel from './components/OptionModel';
import { OptionItem, OptionParams } from './data';
import { addOption, queryOptionList, queryOptionSelectMark, removeOption, updateOption } from './service';

const Spot: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<OptionItem>();
  const [params, setParams] = useState<Partial<OptionParams> | undefined>(undefined);

  //国际化
  const intl = useIntl();

  //读取属性数据
  const { data: marks } = useRequest(() => {
    return queryOptionSelectMark({
      current: 1,
      pageSize: 100,
      category: 'CELL',
    });
  });

  const markListOptions = {};
  if (marks) {
    marks.map((item) => {
      markListOptions[item.value] = {
        text: item.label,
        value: item.value,
      };
    });
  }

  const handleAction = async (fields: OptionItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      if (fields.id != null) {
        const { success } = await updateOption({
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
        const { success } = await addOption({
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

  const handleRemove = (selectedRows: OptionItem) => {
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
          const { success } = await removeOption({
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

  const columns: ProColumns<OptionItem>[] = [
    {
      title: <FormattedMessage id="pages._option.name" />,
      dataIndex: 'name',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'text',
    },

    {
      title: <FormattedMessage id="pages._option.mark" />,
      dataIndex: 'mark',
      valueType: 'select',
      valueEnum: markListOptions,
    },
    {
      title: <FormattedMessage id="pages._option.type" />,
      dataIndex: 'type',
      valueType: 'text',
      valueEnum: {
        ALL: {
          text: '通用'
        },
        INTERNAL: {
          text: '内部使用'
        },
        EXTERNAL: {
          text: '外部使用'
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
  return (
    <div>
      <PageContainer>
        <ProTable<OptionItem>
          headerTitle={intl.formatMessage({
            id: 'pages._option.title',
          })}
          actionRef={actionRef}
          rowKey={(record) => record.id}
          search={{ labelWidth: 80 }}
          pagination={paginationProps}
          params={params}
          request={queryOptionList}
          columns={columns}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setVisible(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="pages.new" />
            </Button>,
          ]}
        />

        <OptionModel
          done={done}
          visible={visible}
          current={currentRow || {}}
          onDone={handleDone}
          onSubmit={async (value) => {
            const success = await handleAction(value as OptionItem);
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
