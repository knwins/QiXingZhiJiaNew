import { AddressItem, AddressParams } from '@/pages/Operation/data';
import { queryAddressSelect, updateAddress } from '@/pages/Operation/service';
import { queryOptionSelect } from '@/pages/Setting/service';
import AddressModel from '@/pages/User/components/AddressModel';
import { ActionType } from '@ant-design/pro-components';
import ProForm, { ModalForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';
import { Button, message } from 'antd/lib';
import { FC, useRef, useState } from 'react';
import { Pagination, ProductItem } from '../data';

type ProductModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<ProductItem> | undefined;
  onDone: () => void;
  onSubmit: (values: ProductItem) => void;
};

const ProductModel: FC<ProductModelProps> = (props) => {
  const { done, visible, current, onDone, onSubmit } = props;
  const [addressVisible, setAddressVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  if (!visible) {
    return null;
  }

  const handleAddressSelect = async (keywords?: any) => {
    const pagination: Pagination = {
      current: 1,
      pageSize: 50,
      total: 100,
    };
    const options: AddressParams = {
      keywords: keywords,
    };
    const { data: addressData } = await queryAddressSelect({
      ...pagination,
      ...options,
    });
    const addressListOptions = [];
    if (addressData) {
      for (let i = 0; i < addressData.length; i += 1) {
        const item = addressData[i];
        if (item) {
          addressListOptions.push({
            label: item.label,
            value: item.value,
          });
        }
      }
    }
    return addressListOptions;
  };

  const handleAction = async (fields: AddressItem) => {
    const loadingHidde = message.loading(
      intl.formatMessage({
        id: 'pages.tip.loading',
      }),
    );
    loadingHidde();
    try {
      if (fields.id != null) {
        const { success } = await updateAddress({
          ...fields,
        });

        if (success) {
          message.success(
            intl.formatMessage({
              id: 'pages.tip.success',
            }),
          );
          return true;
        }
      } else {
        const { success } = await addAddress({
          ...fields,
        });
        if (success) {
          message.success(
            intl.formatMessage({
              id: 'pages.tip.success',
            }),
          );
          return true;
        }
      }
      return false;
    } catch (error) {
      console.log(error);
      message.error(
        intl.formatMessage({
          id: 'pages.tip.error',
        }),
      );
      return false;
    }
  };

  const handleDone = () => {
    setAddressVisible(false);
  };

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
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done ? { padding: '72px 0' } : {},
      }}
    >
      <>
        <ProFormDigit name="id" hidden />
        <ProFormDigit name="category" hidden initialValue={'CABINET'} />

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

        <ProFormText
          name="name"
          label="电柜站点名称"
          width="lg"
          rules={[
            {
              required: true,
            },
          ]}
          placeholder={intl.formatMessage({
            id: 'pages.product.name.placeholder',
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
              label: '正常',
              value: 'NORMAL',
            },
            {
              label: '异常',
              value: 'ABNORMAL',
            },
            {
              label: '处理中',
              value: 'Processing',
            },
            {
              label: '站点库存',
              value: 'SITE_STOCK',
            },
            {
              label: '仓库库存',
              value: 'STORE_STOCK',
            },

            {
              label: '丢失',
              value: 'LOSS',
            },
            { label: '维修', value: 'MAINTENANCE' },
            { label: '处理中', value: 'PROCESSING' },
            { label: '未找到设备', value: 'NOPLATFORM' },

            { label: '虚拟设备', value: 'VIRTUAL' },
            { label: '调拨中', value: 'STORETOSTORE' },
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
              category: 'CABINET',
              type:'ALL',
            }).then(({ data }) => {
              return data?.brand.map((item) => {
                return {
                  label: item.label,
                  value: item.value + '',
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
              category: 'CABINET',
              type:'EXTERNAL',
            }).then(({ data }) => {
              return data?.spec.map((item) => {
                return {
                  label: item.label,
                  value: item.value + '',
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

        <ProFormText
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
        />

        <ProForm.Group title="选择站点地址">
          <ProFormSelect
            name="address"
            width="md"
            showSearch
            fieldProps={{
              labelInValue: true,
            }}
            rules={[{ required: true }]}
            request={async (params) => {
              return handleAddressSelect(params.keyWords);
            }}
          />
          <Button
            size="middle"
            style={{ marginTop: '0px' }}
            onClick={() => {
              setAddressVisible(true);
            }}
          >
            {' '}
            新增地址
          </Button>
        </ProForm.Group>

        <AddressModel
          done={done}
          visible={addressVisible}
          onDone={handleDone}
          onSubmit={async (value) => {
            const success = await handleAction(value as AddressItem);
            if (success) {
              setAddressVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        />
      </>
    </ModalForm>
  );
};
export default ProductModel;
