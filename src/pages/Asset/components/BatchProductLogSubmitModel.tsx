import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';
import { Divider } from 'antd';
import type { FC } from 'react';
import { ProductLogBatchItem } from '../../Asset/data';

type ProductLogAllSubmitModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<ProductLogBatchItem> | undefined;
  onDone: () => void;
  onSubmit: (values: ProductLogBatchItem) => void;
};

const ProductLogAllSubmitModel: FC<ProductLogAllSubmitModelProps> = (props) => {
  const { done, visible, current, onDone, onSubmit } = props;
  const intl = useIntl();
  if (!visible) {
    return null;
  }

  return (
    <ModalForm<ProductLogBatchItem>
      visible={visible}
      title="批量确认收货"
      width={640}
      initialValues={current}
      onFinish={async (values) => {
        onSubmit(values);
      }}
      submitter={{
        render: (_, dom) => (done ? null : dom),
      }}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done ? { padding: '72px 0' } : {},
      }}
    >
      <>
        <ProFormText name="action" initialValue="batchSubmitProductLog" hidden />
        <ProFormText name="type" initialValue="StoreToStore" hidden />
        <Divider></Divider>
        <ProFormText
          name="ids"
          label={intl.formatMessage({
            id: 'pages.product.ids',
          })}
          width="md"
          disabled
        />
      </>
    </ModalForm>
  );
};
export default ProductLogAllSubmitModel;
