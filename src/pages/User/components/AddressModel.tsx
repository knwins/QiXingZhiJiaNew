import { queryPCDList } from '@/pages/Asset/service';
import { AddressItem, StoreItem } from '@/pages/Operation/data';
import ProForm, {
  ModalForm,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';
import type { FC } from 'react';

type AddressModelProps = {
  done: boolean;
  visible: boolean;
  onDone: () => void;
  onSubmit: (values: AddressItem) => void;
};

const AddressModel: FC<AddressModelProps> = (props) => {
  const { done, visible, onDone, onSubmit, children } = props;
  const intl = useIntl();

  if (!visible) {
    return null;
  }

  return (
    <ModalForm<AddressItem>
      visible={visible}
      title="添加地址"
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
        <ProFormDigit name="id" hidden />
        <ProForm.Group title="所在省市区" size={8}>
          <ProFormSelect
            rules={[
              {
                required: true,
                message: '请输入您的所在省!',
              },
            ]}
            width="xs"
            fieldProps={{
              labelInValue: true,
            }}
            name="province"
            request={async () => {
              return queryPCDList({ parentId: '0', current: 1, pageSize: 1000 }).then(
                ({ data }) => {
                  return data.map((item) => {
                    return {
                      label: item.label,
                      value: item.value + '',
                    };
                  });
                },
              );
            }}
          />

          <ProFormDependency name={['province']}>
            {({ province }) => {
              return (
                <ProFormSelect
                  params={{
                    key: province,
                  }}
                  fieldProps={{
                    labelInValue: true,
                  }}
                  name="city"
                  width="xs"
                  rules={[
                    {
                      required: true,
                      message: '请输入您的所在城市!',
                    },
                  ]}
                  disabled={!province}
                  request={async () => {
                    if (!province?.key) {
                      return [];
                    }
                    return queryPCDList({
                      parentId: province.key,
                      current: 1,
                      pageSize: 1000,
                    }).then(({ data }) => {
                      return data.map((item) => {
                        return {
                          label: item.label,
                           value: item.value,
                        };
                      });
                    });
                  }}
                />
              );
            }}
          </ProFormDependency>

          <ProFormDependency name={['city']}>
            {({ city }) => {
              return (
                <ProFormSelect
                  params={{
                    key: city,
                  }}
                  fieldProps={{
                    labelInValue: true,
                  }}
                  name="district"
                  width="xs"
                  rules={[
                    {
                      required: true,
                      message: '请输入您的所在区县!',
                    },
                  ]}
                  disabled={!city}
                  request={async () => {
                    if (!city?.key) {
                      return [];
                    }
                    return queryPCDList({ parentId: city.key, current: 1, pageSize: 1000 }).then(
                      ({ data }) => {
                        return data.map((item) => {
                          return {
                            label: item.label,
                             value: item.value,
                          };
                        });
                      },
                    );
                  }}
                />
              );
            }}
          </ProFormDependency>
        </ProForm.Group>

        <ProFormText
          name="detail"
          label={intl.formatMessage({
            id: 'pages.store.address',
          })}
          width="md"
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.store.address.required',
              }),
            },
          ]}
          placeholder={intl.formatMessage({
            id: 'pages.store.address.placeholder',
          })}
        />

        {/* <ProFormText
          name="longitude"
          label={intl.formatMessage({
            id: 'pages.store.longitude',
          })}
          width="sm"
          placeholder={intl.formatMessage({
            id: 'pages.store.longitude.placeholder',
          })}
        />

        <ProFormText
          name="latitude"
          label={intl.formatMessage({
            id: 'pages.store.latitude',
          })}
          width="sm"
          placeholder={intl.formatMessage({
            id: 'pages.store.latitude.placeholder',
          })}
        /> */}
      </>
    </ModalForm>
  );
};
export default AddressModel;
