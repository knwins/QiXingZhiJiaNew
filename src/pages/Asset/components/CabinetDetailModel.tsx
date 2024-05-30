import { ProColumns, ProTable } from '@ant-design/pro-components';
import ProForm, { ModalForm, ProFormDateTimePicker, ProFormSelect } from '@ant-design/pro-form';
import { FormattedMessage } from '@umijs/max';
import { type FC } from 'react';
import { CabinetDetailItem, CabinetDoorItem } from '../data';

type CabinetDetailModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<CabinetDetailItem> | undefined;
  onDone: () => void;
};

const CabinetDetailModel: FC<CabinetDetailModelProps> = (props) => {
  const { done, visible, current, onDone } = props;

  if (!visible) {
    return null;
  }

  const columns: ProColumns<CabinetDoorItem>[] = [
    {
      title: <FormattedMessage id="pages.update.time" />,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: '150px',
      fieldProps: { size: 'small' },
      hideInSearch: true,
    },
    {
      title: '编号',
      dataIndex: 'doorNumber',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '电池编号',
      dataIndex: 'batteryNumber',
      valueType: 'text',
      hideInSearch: true,
    },
  ];

  return (
    <ModalForm<CabinetDetailItem>
      visible={visible}
      title="电柜详细数据"
      width={640}
      initialValues={current}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done ? { padding: '72px 0' } : {},
      }}
      submitter={{ submitButtonProps: { style: { display: 'none' } } }}
    >
      <>
        <div>
          <ProForm.Group title="时间信息">
            <ProFormDateTimePicker name="readTime" label="读取时间" readonly />
            <ProFormDateTimePicker name="updateTime" label="GPS最后更新时间" readonly />
          </ProForm.Group>

          <ProForm.Group title="柜门数据">
            <ProTable<CabinetDoorItem>
              search={false}
              options={false}
              rowKey={(record) => record.id}
              columns={columns}
              dataSource={current?.cabinetDoors}
            />
          </ProForm.Group>

        </div>
      </>
    </ModalForm>
  );
};
export default CabinetDetailModel;
