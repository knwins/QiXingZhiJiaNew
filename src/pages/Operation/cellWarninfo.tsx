import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { message, Modal } from 'antd';
import React, { useRef } from 'react';
import { WarnInfoItem } from './data';
import { queryBusinessSelect, queryCellWarnInfoList, removeWarnInfo } from './service';

const WarnInfo: React.FC = () => {
  const actionRef = useRef<ActionType>();
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

  const handleRemove = (selectedRows: WarnInfoItem) => {
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
          const { success } = await removeWarnInfo({
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

  const columns: ProColumns<WarnInfoItem>[] = [
    {
      title: '设备ID',
      dataIndex: 'devId',
      hideInForm: true,
      copyable: true,
      valueType: 'text',
      width: 'md',
      fieldProps: {
        placeholder: '请输入设备编号',
      },
    },

    {
      title: '采集时间',
      dataIndex: 'readTime',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
      valueType: 'dateTime',
      width: 'md',
    },
    {
      title: '选择类型',
      dataIndex: 'alarmId',
      hideInForm: true,
      hideInTable: true,
      valueType: 'select',
      width: 'sm',
      valueEnum: {
        '01002001': {
          text: 'BMS故障',
        },
        '01003001': {
          text: 'BMS告警',
        },
        '01001001': {
          text: 'DTU故障',
        },
        cabFault: {
          text: '整机故障',
        },
        boxFault: {
          text: '单仓故障',
        },
        '02008001': {
          text: '仓门操作故障',
        },
      },
    },

    {
      title: '类型',
      dataIndex: 'alarmType',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'text',
      width: 'md',
    },
    {
      title: '内容',
      dataIndex: 'alarmMessage',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'text',
      width: 'md',
    },
    {
      title: '等级',
      dataIndex: 'alarmLevel',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'text',
      width: 'md',
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
      title: '开始时间',
      dataIndex: 'alarmStartTime',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'dateTime',
      width: 'md',
    },

    {
      title: '结束时间',
      dataIndex: 'alarmEndTime',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'dateTime',
      width: 'md',
    },
    {
      title: <FormattedMessage id="pages.option" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      render: (_, record) => {
        return [
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
        <ProTable<WarnInfoItem>
          actionRef={actionRef}
          rowKey={(record) => record.id}
          search={true}
          pagination={paginationProps}
          request={(params) => {
            params.type="2";
            return queryCellWarnInfoList({ ...params });
          }}
          columns={columns}
        />
      </PageContainer>
    </div>
  );
};
export default WarnInfo;
