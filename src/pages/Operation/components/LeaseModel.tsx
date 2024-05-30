
import { ModalForm, ProFormDigit, ProFormRadio, ProFormSelect } from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';
import type { FC } from 'react';
import { ProductLeaseItem } from '../data';
import { queryProductSelect } from '@/pages/Asset/service';
import { queryUserSelect } from '@/pages/User/service';

type LeaseModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<ProductLeaseItem> | undefined;
  onDone: () => void;
  onSubmit: (values: ProductLeaseItem) => void;
};

const LeaseModel: FC<LeaseModelProps> = (props) => {
  const { done, visible, current, onDone, onSubmit, children } = props;
  const intl = useIntl();

  if (!visible) {
    return null;
  }

  return (
    <ModalForm<ProductLeaseItem>
      visible={visible}
      title={
        done
          ? null
          : `${
              current?.id
                ? intl.formatMessage({
                    id: 'pages.edit',
                  })
                : intl.formatMessage({
                    id: 'pages.new',
                  })
            }`
      }
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
        <ProFormDigit name="id" hidden />

        <ProFormSelect
          name="product"
          width="md"
          showSearch
          fieldProps={{
            labelInValue: true,
          }}
          label="电动车编号"
          placeholder="请选择电动车编号"
          request={async (params) => {
            return queryProductSelect({
              current: 1,
              pageSize: 1000,
              category: 'ELECTRIC',
              state: 'SITE_STOCK',
              keywords: params.keyWords,
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
        />
        <ProFormSelect
          name="leaseUser"
          width="md"
          showSearch
          rules={[
            {
              required: true,
            },
          ]}
          fieldProps={{
            labelInValue: true,
          }}
          label="租赁人"
          placeholder="请选择租赁人"
          request={async (params) => {
            return queryUserSelect({
              current: 1,
              pageSize: 1000,
              type: 'USER',
              keywords: params.keyWords,
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
          disabled={current?.id ? true : false}
        />

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
          rules={[
            {
              required: true,
            },
          ]}
          width="xs"
          disabled={current?.id ? true : false}
        />

        <ProFormDigit
          name="price"
          label="单价"
          width="xs"
          rules={[
            {
              required: true,
            },
          ]}
          fieldProps={{ addonAfter: '元' }}
          disabled={current?.id ? true : false}
        />

        <ProFormDigit
          name="deposit"
          label="保证金"
          width="xs"
          rules={[
            {
              required: true,
            },
          ]}
          fieldProps={{ addonAfter: '元' }}
          disabled={current?.id ? true : false}
        />

        <ProFormSelect name="state" initialValue={'NORMAL'} hidden />
      </>
    </ModalForm>
  );
};
export default LeaseModel;
