import {
  ActionType,
  ProTable,
  ProColumns,
  ModalForm,
  ProFormInstance,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import type { FC } from 'react';
import { useRef } from 'react';
import type { UserItem, UserLogItem, UserLogParams } from '../data';
import { queryUserLogList } from '../service';


type UserLogModalProps = {
  done: boolean;
  visible: boolean;
  current: Partial<UserItem> | undefined;
  onDone: () => void;
};

const columns: ProColumns<UserLogItem>[] = [
  {
    title: <FormattedMessage id="pages.create.time" />,
    dataIndex: 'createTime',
    valueType: 'dateTime',
    width: '20%',
    fieldProps: { size: 'small' },
  },
  {
    title: <FormattedMessage id="pages.user.log.content" />,
    dataIndex: 'content',
    valueType: 'text',
    fieldProps: { size: 'small' },
    width: '80%'
  },
];

const UserLogModal: FC<UserLogModalProps> = (props) => {
  // export default () => {
  //接收到数据
  const { done, visible, current, onDone, children } = props;

  //国际化
  const intl = useIntl();

  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  if (!visible) {
    return null;
  }

  const params: UserLogParams = {
    userId: current?.id,
    sorter: 'DESC',
    filter: 'create_time',
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 12,
  };

  return (
    <ModalForm<UserItem>
      visible={visible}
      title={intl.formatMessage({
        id: 'pages.user.log.title',
      })}
      formRef={formRef}
      
      width="70%"
      submitter={false}
      trigger={<>{children}</>}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done ? { padding: '72px 0' } : {},
      }}
    >
      <ProTable<UserLogItem, UserLogParams>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        pagination={paginationProps}
        params={params}
        search={false}
        request={queryUserLogList}
      />
    </ModalForm>
  );
};

export default UserLogModal;
