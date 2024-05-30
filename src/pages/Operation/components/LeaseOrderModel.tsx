import { queryProductSelect } from '@/pages/Asset/service';
import { queryUserSelect } from '@/pages/User/service';

import ProForm, {
  ModalForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
} from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';
import type { FC } from 'react';
import { ProductLeaseItem } from '../data';


type LeaseOrderModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<ProductLeaseItem> | undefined;
  onDone: () => void;
  onSubmit: (values: ProductLeaseItem) => void;
};

const LeaseOrderModel: FC<LeaseOrderModelProps> = (props) => {
  const { done, visible, current, onDone, onSubmit, children } = props;
  const intl = useIntl();

  if (!visible) {
    return null;
  }

  return (
    <ModalForm<ProductLeaseItem>
      visible={visible}
      title="电动车租赁续租操作"
      className=""
      width={640}
      onFinish={async (values) => {
        onSubmit(values);
      }}
      initialValues={current}
      submitter={{
        render: (_, dom) => (done ? null : dom),
      }}
      trigger={<>{children}</>}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done ? { padding: '72px 0' } : {},
      }}
    >
      <>
        <div className={styles.order}>
          <ProFormDigit name="id" hidden />
          <ProFormDigit name="productLeaseId" hidden initialValue={current?.id} />
          <ProForm.Group title="基础数据">
            <ProFormSelect
              name="product"
              width="md"
              fieldProps={{
                labelInValue: true,
              }}
              label="电动车编号"
              placeholder="请选择电动车编号"
              request={async () => {
                return queryProductSelect({
                  current: 1,
                  pageSize: 1000,
                  category: 'ELECTRIC',
                  state: 'STORE',
                }).then(({ data }) => {
                  return data.map((item) => {
                    return {
                      label: item.number + '-' + item.brand.name,
                       value: item.value,
                      id: item.id,
                    };
                  });
                });
              }}
              readonly
            />
            <ProFormSelect
              name="leaseUser"
              width="md"
              fieldProps={{
                labelInValue: true,
              }}
              label="租赁人"
              placeholder="请选择租赁人"
              request={async () => {
                return queryUserSelect({
                  current: 1,
                  pageSize: 1000,
                  type: 'USER',
                }).then(({ data }) => {
                  return data.map((item) => {
                    return {
                      label: item.username + '-' + item.nick,
                       value: item.value,
                      id: item.id,
                    };
                  });
                });
              }}
              readonly
            />

            <ProFormDatePicker name="endTime" label="到期时间" readonly />

            <ProFormSelect
              name="state"
              width="xs"
              label="状态"
              options={[
                {
                  label: '退租完成',
                  value: 'FINISH',
                },
                {
                  label: '租赁中',
                  value: 'NORMAL',
                },
                {
                  label: '已逾期',
                  value: 'LATE',
                },
              ]}
              readonly
            />
          </ProForm.Group>

          <ProForm.Group title="计费数据">
            <ProFormRadio.Group
              name="payType"
              label="计费方式"
              options={[
                {
                  label: '按天计费',
                  value: 'DAY',
                },
                {
                  label: '按月计费',
                  value: 'MONTH',
                },
              ]}
              width="xs"
              readonly
            />

            <ProFormDigit
              name="price"
              label="单价(元)"
              width="xs"
              fieldProps={{ addonAfter: '元' }}
              readonly
            />

            <ProFormDigit
              name="deposit"
              label="保证金(元)"
              width="xs"
              fieldProps={{ addonAfter: '元' }}
              readonly
            />
          </ProForm.Group>

          <ProFormSelect hidden name="action" initialValue={'RENEWAL'} />

          <ProFormDigit
            name="num"
            label="续租时间"
            width="xs"
            fieldProps={{ addonAfter: current?.payType == 'DAY' ? '天' : '月' }}
          />
        </div>
      </>
    </ModalForm>
  );
};
export default LeaseOrderModel;
