import { ModalForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';
import { Divider } from 'antd';
import type { FC } from 'react';
import { StockItem } from '../data';

type StockModelProps = {
  done: boolean;
  open: boolean;
  current: Partial<StockItem> | undefined;
  onDone: () => void;
  onSubmit: (values: StockItem) => void;
};

const StockModel: FC<StockModelProps> = (props) => {
  const { done, open, current, onDone, onSubmit } = props;
  const intl = useIntl();

  if (!open) {
    return null;
  }

  return (
    <ModalForm<StockItem>
      open={open}
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
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
      }}
    >
      <>
        <Divider />
        <ProFormDigit name="id" hidden />
        <ProFormText name="category" hidden />
        <ProFormText
          name="gpsNumber"
          label="硬件码"
          width="lg"
          rules={[
            {
              required: true,
            },
          ]}
        />
        <ProFormText
          name="number"
          label={intl.formatMessage({
            id: 'pages.product.number',
          })}
          width="lg"
          rules={[
            {
              required: true,
            },
          ]}
          placeholder={intl.formatMessage({
            id: 'pages.product.number.placeholder',
          })}
        />

        <ProFormSelect
          name="state"
          width="lg"
          rules={[
            {
              required: true,
            },
          ]}
          label={intl.formatMessage({
            id: 'pages.product.state',
          })}
          options={[
            { label: '正常', value: 'NORMAL' },
            { label: '异常', value: 'ABNORMAL' },
            { label: '丢失', value: 'LOSS' },
            { label: '维修', value: 'MAINTENANCE' },
            { label: '调拨中', value: 'STORETOSTORE' },
          ]}
        />
      </>
    </ModalForm>
  );
};
export default StockModel;
