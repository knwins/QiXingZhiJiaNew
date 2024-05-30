import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Typography } from 'antd';
import React, { useRef } from 'react';
import type { TaskItem } from './data';
import { queryTaskList } from './service';
const { Paragraph } = Typography;

const Task: React.FC = () => {
  const actionRef = useRef<ActionType>();

  //国际化
  const intl = useIntl();

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
  };

  const columns: ProColumns<TaskItem>[] = [
    {
      title: <FormattedMessage id="pages.task.name" />,
      dataIndex: 'name',
      hideInSearch: true,
      valueType: 'text',
      ellipsis: true,
      width: 'xs',
    },

    {
      title: <FormattedMessage id="pages.task.description" />,
      dataIndex: 'description',
      hideInSearch: true,
      valueType: 'text',
      ellipsis: true,
      width: 'md',
    },

    {
      title: '执行URL',
      dataIndex: 'httpurl',
      valueType: 'text',
      hideInSearch: true,
      fieldProps: { size: 'small' },
      hideInForm: true,
      width: 'md',
      ellipsis: true,
      render: (text, record, _, action) => {
        if (record.httpurl) {
          return [
            <Paragraph copyable title={record.httpurl} ellipsis={{ rows: 1, expandable: true }}>
              {record.httpurl}
            </Paragraph>,
          ];
        }
        return '-';
      },
    },

    {
      title: <FormattedMessage id="pages.task.lastUpdateTime" />,
      dataIndex: 'lastUpdateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
      align: 'center',
      fieldProps: { size: '10' },
      width: 'md',
      ellipsis: true,
    },

    {
      title: <FormattedMessage id="pages.task.taketime" />,
      dataIndex: 'takeTime',
      hideInSearch: true,
      valueType: 'text',
      width: '60px',
    },

    {
      title: <FormattedMessage id="pages.task.number" />,
      dataIndex: 'number',
      valueType: 'text',
      hideInSearch: true,
      hideInForm: true,
      width: '100px',
    },
  ];
  return (
    <PageContainer title=" ">
      <ProTable<TaskItem>
        actionRef={actionRef}
        rowKey={(record) => record.id}
        search={false}
        pagination={paginationProps}
        request={queryTaskList}
        columns={columns}
      />
    </PageContainer>
  );
};
export default Task;
