import { queryOptionSelect } from '@/pages/Setting/service';
import { ModalForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';
import type { FC } from 'react';
import { ProductItem } from '../data';

type ProductModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<ProductItem> | undefined;
  onDone: () => void;
  onSubmit: (values: ProductItem) => void;
};

const ProductModel: FC<ProductModelProps> = (props) => {
  const { done, visible, current, onDone, onSubmit, children } = props;
  const intl = useIntl();

  if (!visible) {
    return null;
  }

  return (
    <ModalForm<ProductItem>
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
        <ProFormDigit name="category" hidden initialValue={'STAGE'} />
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
            {
              label: '申请中',
              value: 'APPLICATION',
            },
            {
              label: '安装中',
              value: 'INSTALL',
            },
            {
              label: '正常',
              value: 'NORMAL',
            },
            {
              label: '异常',
              value: 'ABNORMAL',
            },
          ]}
        />
       
        <ProFormSelect
          name="brand"
          width="lg"
          fieldProps={{
            labelInValue: true,
          }}
          rules={[
            {
              required: true,
            },
          ]}
          label={intl.formatMessage({
            id: 'pages.product.brand',
          })}
          // valueEnum={brandListOptions}
          placeholder={intl.formatMessage({
            id: 'pages.product.brand.placeholder',
          })}
          request={async () => {
            return queryOptionSelect({
              current: 1,
              pageSize: 1000,
              type: 'STAGE',
            }).then(({ data }) => {
              return data?.brand.map((item) => {
                return {
                  label: item.label,
                   value: item.value,
                };
              });
            });
          }}
        />

        <ProFormSelect
          name="spec"
          width="lg"
          fieldProps={{
            labelInValue: true,
          }}
          rules={[
            {
              required: true,
            },
          ]}
          label={intl.formatMessage({
            id: 'pages.product.spec',
          })}
          // valueEnum={specListOptions}
          placeholder={intl.formatMessage({
            id: 'pages.product.spec.placeholder',
          })}
          request={async () => {
            return queryOptionSelect({
              current: 1,
              pageSize: 1000,
              type: 'STAGE',
            }).then(({ data }) => {
              return data?.spec.map((item) => {
                return {
                  label: item.label,
                   value: item.value,
                };
              });
            });
          }}
        />

        <ProFormText
          tooltip="尺寸示例(mm): 380*260*50"
          name="size"
          label={intl.formatMessage({
            id: 'pages.product.size',
          })}
          width="lg"
          placeholder={intl.formatMessage({
            id: 'pages.product.size.placeholder',
          })}
        />

        {/* <ProFormText
          name="weight"
          label={intl.formatMessage({
            id: 'pages.product.weight',
          })}
          width="lg"
          placeholder={intl.formatMessage({
            id: 'pages.product.weight.placeholder',
          })}
        />

        <ProFormText
          name="material"
          label={intl.formatMessage({
            id: 'pages.product.material',
          })}
          width="lg"
          placeholder={intl.formatMessage({
            id: 'pages.product.material.placeholder',
          })}
        /> */}

       
      </>
    </ModalForm>
  );
};
export default ProductModel;
