import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';

import PrivilegeModel from './components/PrivilegeModel';
import type { PrivilegeItem, PrivilegeParams } from './data';
import { addPrivilege, queryPrivilegeList, removePrivilege, updatePrivilege } from './service';

const PrivilegeList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [params, setParams] = useState<Partial<PrivilegeParams> | undefined>(undefined);
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<PrivilegeItem>();
  const [parentId, setParentId] = useState<string>();

  /** 国际化配置 */
  const intl = useIntl();

  

  const handleAction = async (fields: PrivilegeItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      if (fields.id != null) {
        const { success } = await updatePrivilege({
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
        const { success } = await addPrivilege({
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
   * 删除节点
   *
   * @param selectedRows
   */

  const handleRemove = (selectedRows: PrivilegeItem) => {
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
          const { success } = await removePrivilege({
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

  const columns: ProColumns<PrivilegeItem>[] = [
    {
      title: <FormattedMessage id="pages.privilege.name" />,
      dataIndex: 'name',
      valueType: 'text',
      hideInSearch: true,
      hideInForm: true,
      fieldProps: { precision: 6 },
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              const params: PrivilegeParams = {
                parentId: entity.id,
              };
              setParams(params);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.privilege.icon" />,
      dataIndex: 'icon',
      hideInSearch: true,
      hideInForm: true,
      valueType: 'text',
      fieldProps: { precision: 6 },
    },
    {
      title: <FormattedMessage id="pages.privilege.route" />,
      dataIndex: 'route',
      hideInSearch: true,
      hideInForm: true,
      valueType: 'text',
      fieldProps: { precision: 6 },
    },

    {
      title: <FormattedMessage id="pages.privilege.component" />,
      dataIndex: 'component',
      hideInSearch: true,
      hideInForm: true,
      valueType: 'text',
      fieldProps: { precision: 6 },
    },

    {
      title: <FormattedMessage id="pages.privilege.permission" />,
      dataIndex: 'permission',
      hideInSearch: true,
      hideInForm: true,
      valueType: 'text',
      fieldProps: { precision: 6 },
    },

    {
      title: "显示状态",
      dataIndex: 'isShow',
      hideInSearch: true,
      hideInForm: true,
      valueType: 'select',
      fieldProps: { precision: 6 },
      valueEnum: {
        true: {
          text: '显示',
          action: 'true',
        },
        false: {
          text: '蕴藏',
          action: 'false',
        }
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
            key="new"
            onClick={() => {
              setVisible(true);
              setParentId(record.id);
            }}
          >
            <FormattedMessage id="pages.new" />
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

  return (
    <div>
      <PageContainer>
        <ProTable<PrivilegeItem, PrivilegeParams>
          actionRef={actionRef}
          pagination={paginationProps}
        
          rowKey={(record) => record.id}
          params={params}
          search={false}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setParentId('0');
                setVisible(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="pages.new" />
            </Button>,
          ]}
          request={queryPrivilegeList}
          columns={columns}
          onChange={(pagination, filters: any, sorter: any) => {
            if (sorter) {
              sorter.order = sorter.order === 'descend' ? 'DESC' : 'ASC';
              const privilegeParams: PrivilegeParams = {
                sorter: sorter.order,
                filter: sorter.field,
              };
              setParams(privilegeParams);
            }
          }}
        />

        <PrivilegeModel
          done={done}
          visible={visible}
          current={currentRow || {}}
          parentId={parentId || '0'}
          onDone={handleDone}
          onSubmit={async (value) => {
            const success = await handleAction(value as PrivilegeItem);
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

export default PrivilegeList;
