import { BusinessParams, StoreParams } from '@/pages/Operation/data';
import { queryBusinessSelect, queryStoreSelect } from '@/pages/Operation/service';
import { ModalForm, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';
import { Divider } from 'antd';
import type { FC } from 'react';
import { Pagination, ProductLogBatchItem } from '../../Asset/data';

type ProductLogAllModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<ProductLogBatchItem> | undefined;
  onDone: () => void;
  onSubmit: (values: ProductLogBatchItem) => void;
};

const ProductLogAllModel: FC<ProductLogAllModelProps> = (props) => {
  const { done, visible, current, onDone, onSubmit } = props;
  const intl = useIntl();

  const handleBusinessSelect = async (key?: any, keywords?: any) => {
    if (key === '') {
      return;
    }
    const pagination: Pagination = {
      current: 1,
      pageSize: 500,
    };
    const options: BusinessParams = {
      keywords: keywords,
    };
    //读取仓库数据
    const { data: businessData } = await queryBusinessSelect({
      ...pagination,
      ...options,
    });

    const businessListOptions = [];
    if (businessData) {
      for (let i = 0; i < businessData.length; i += 1) {
        const item = businessData[i];
        if (item) {
          businessListOptions.push({
            label: item.label,
            value: item.id,
          });
        }
      }
    }
    return businessListOptions;
  };

  const handleStoreSelect = async (storeType?: any, businessId?: any, keywords?: any) => {
    console.log('keywords', keywords);
    if (storeType === '') {
      return;
    }
    const pagination: Pagination = {
      current: 1,
      pageSize: 500,
    };
    const options: StoreParams = {
      type: storeType,
      businessId: businessId,
      keywords: keywords,
    };
    //读取仓库数据
    const { data: store } = await queryStoreSelect({
      ...pagination,
      ...options,
    });
    const storeListOptions = [];
    const storeData = store || [];
    if (storeData) {
      for (let i = 0; i < storeData.length; i += 1) {
        const item = storeData[i];
        if (item) {
          storeListOptions.push({
            label: item.label,
            value: item.value,
          });
        }
      }
    }
    return storeListOptions;
  };
  //end

  if (!visible) {
    return null;
  }

  return (
    <ModalForm<ProductLogBatchItem>
      visible={visible}
      title="批量操作"
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
        <ProFormText name="action" initialValue="batchCreateProductLog" hidden />
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

        <ProFormRadio.Group
          name="storeType"
          initialValue="Store"
          label={intl.formatMessage({
            id: 'pages.product.log.type',
          })}
          options={[
            {
              label: '仓库',
              value: 'Store',
            },
            {
              label: '站点',
              value: 'Site',
            },
          ]}
          rules={[
            {
              required: true,
            },
          ]}
          width="md"
        />

        <ProFormSelect
          name="business"
          width="md"
          placeholder="请选择运营商"
          fieldProps={{
            labelInValue: true,
          }}
          rules={[
            {
              required: true,
            },
          ]}
          label="运营商"
          request={async (params) => {
            return handleBusinessSelect(params.keyWords);
          }}
        />

        <ProFormSelect
          name="laterStoreId"
          width="md"
          showSearch
          rules={[
            {
              required: true,
            },
          ]}
          label={intl.formatMessage({
            id: 'pages.product.log.int.store',
          })}
          dependencies={['storeType', 'business']}
          request={async (params) => {
            return handleStoreSelect(params.storeType, params.business.value, params.keyWords);
          }}
        />
      </>
    </ModalForm>
  );
};
export default ProductLogAllModel;
