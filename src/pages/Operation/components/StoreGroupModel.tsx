import { pagination } from '@/pages/Setting/data';
import { ModalForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';
import type { FC } from 'react';
import { BusinessParams, StoreGroupItem } from '../data';
import { queryBusinessSelect } from '../service';
type StoreGroupModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<StoreGroupItem> | undefined;
  onDone: () => void;
  onSubmit: (values: StoreGroupItem) => void;
};

const StoreGroupModel: FC<StoreGroupModelProps> = (props) => {
  const { done, visible, current, onDone, onSubmit } = props;
  const intl = useIntl();
  if (!visible) {
    return null;
  }

  const handleBusinessSelect = async (key?: any, keywords?: any) => {
    if (key === '') {
      return;
    }
    const pagination: pagination = {
      current: 1,
      pageSize: 10,
      total: 100,
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
            value: item.value,
          });
        }
      }
    }
    return businessListOptions;
  };

  return (
    <ModalForm<StoreGroupItem>
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

        <ProFormSelect
          name="business"
          width="lg"
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
          name="useType"
          label="群组类别"
          width="md"
          rules={[
            {
              required: true,
            },
          ]}
          placeholder="请选择群组类别"
          options={[
            {
              label: '内部组',
              value: 'INTERNAL',
            },
            {
              label: '外部组',
              value: 'EXTERNAL',
            },
          ]}
        />

        <ProFormText
          name="name"
          label={intl.formatMessage({
            id: 'pages.store.name',
          })}
          width="md"
          rules={[
            {
              required: true,
            },
          ]}
          placeholder={intl.formatMessage({
            id: 'pages.store.name.placeholder',
          })}
        />

        <ProFormText
          name="contactName"
          label="联系人"
          width="md"
          rules={[
            {
              required: true,
            },
          ]}
          placeholder="请输入联系人"
        />

        <ProFormText
          name="contactPhone"
          label="联系电话"
          width="md"
          rules={[
            {
              required: true,
            },
          ]}
          placeholder="请输入联系电话"
        />

        
      </>
    </ModalForm>
  );
};
export default StoreGroupModel;
