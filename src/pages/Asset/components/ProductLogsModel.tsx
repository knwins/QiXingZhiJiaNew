import { ModalForm, ProFormDigit, ProFormText } from '@ant-design/pro-form';
import type { FC } from 'react';
import { ProductLogItem } from '../data';


type ProductLogsModelProps = {
  done: boolean;
  visible: boolean;
  productId: Partial<String> | undefined;
  onDone: () => void;
  onSubmit: (values: ProductLogItem) => void;
};

const ProductLogsModel: FC<ProductLogsModelProps> = (props) => {

 
  const { done, visible, productId, onDone, onSubmit, children } = props;

  if (!visible) {
    return null;
  }
  return (
    <ModalForm<ProductLogItem>
      visible={visible}
      title="增加日志"
      width={640}
      onFinish={async (values) => {
        onSubmit(values);
      }}
   
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
        <div>
          <ProFormDigit name="id" hidden />
          <ProFormDigit name="productId" hidden initialValue={productId} />
          <ProFormText name="type" initialValue="Log" hidden />
          <ProFormText
            name="content"
            label="内容"
            width="lg"
            rules={[
              {
                required: true,
              },
            ]}
            placeholder="请输入日志内容"
          />
        </div>
      </>
    </ModalForm>
  );
};
export default ProductLogsModel;
