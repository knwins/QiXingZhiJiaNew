import { ProductItem } from '@/pages/Asset/data';
import ProForm, { ModalForm, ProFormDateTimePicker, ProFormText } from '@ant-design/pro-form';
import { type FC } from 'react';
import './style.less';
type ProductDetailModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<ProductItem> | undefined;
  onDone: () => void;
};

const ProductDetailModel: FC<ProductDetailModelProps> = (props) => {
  const { done, visible, current, onDone } = props;

  if (!visible) {
    return null;
  }

  return (
    <ModalForm<ProductItem>
      visible={visible}
      title={current?.number}
      width={640}
      initialValues={current}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
      }}
      submitter={{ submitButtonProps: { style: { display: 'none' } } }}
    >
      <>
        <ProForm.Group title="时间信息">
          <ProFormDateTimePicker name="createTime" label="入库时间" readonly />
          <ProFormDateTimePicker name="locationTime" label="GPS时间" readonly />
          <ProFormDateTimePicker name="exchangeTime" label="运营时间" readonly />
        </ProForm.Group>

        <ProForm.Group title="基础数据">
          <ProFormText name="state" label="状态" readonly />
          <ProFormText name="exchangeTotal" label="换电(次)" readonly />
          <ProFormText name="abnormalDays" label="异常(天)" readonly />
          <ProFormText name={['spec', 'name']} label="电池规格" readonly />
        </ProForm.Group>
        <ProForm.Group title="运营数据">
        <ProFormText name={['store', 'name']} label="所属站点" readonly />
        <ProFormText name="gpsAddress" width="md" label="最新位置信息" readonly />
        </ProForm.Group>
        <ProForm.Group title="备注">
        <ProFormText name="exchangeContent" width="md" readonly />
        </ProForm.Group>
      </>
    </ModalForm>
  );
};
export default ProductDetailModel;
