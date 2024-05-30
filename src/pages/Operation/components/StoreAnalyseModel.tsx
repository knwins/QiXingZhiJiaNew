import { OptionParams, pagination } from '@/pages/Setting/data';
import { queryOptionSelect } from '@/pages/Setting/service';
import { ActionType } from '@ant-design/pro-components';
import { ModalForm, ProFormCascader, ProFormDigit, ProFormSelect } from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';
import { Divider, message } from 'antd';
import { FC, useRef, useState } from 'react';

import { AddressItem, BusinessParams, Pagination, StoreAnalyseItem, StoreParams } from '../data';
import { addAddress, queryBusinessSelect, queryStoreTreeSelect, updateAddress } from '../service';

import styles from './style.less';

type StoreAnalyseModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<StoreAnalyseItem> | undefined;
  onDone: () => void;
  onSubmit: (values: StoreAnalyseItem) => void;
};

const StoreAnalyseModel: FC<StoreAnalyseModelProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const { done, visible, current, onDone, onSubmit } = props;

  const [storeId, setStoreId] = useState<number>();
  const intl = useIntl();

  if (!visible) {
    return null;
  }

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

  //读取仓库树数据
  const handleStoreTreeSelect = async (businessId?: any) => {

    if (businessId == '') {
      return;
    }
    const pagination: Pagination = {
      current: 1,
    };
    const options: StoreParams = {
      useType: 'INTERNAL',
      businessId: businessId,
    };
    //读取仓库数据
    const { data: storeTreeData } = await queryStoreTreeSelect({
      ...pagination,
      ...options,
    });

    return storeTreeData;
  };

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
            value: item.id,
          });
        }
      }
    }
    return businessListOptions;
  };

  const handleOptionSelect = async (category?: any) => {
    const pagination: pagination = {
      current: 1,
      pageSize: 10,
      total: 100,
    };
    const options: OptionParams = {
      category: category,
      useType: 'INTERNAL',
    };
    //读取仓库数据
    const { data: optionData } = await queryOptionSelect({
      ...pagination,
      ...options,
    });

    const bandSpecListOptions = [];
    if (optionData.brandSpec) {
      for (let i = 0; i < optionData.brandSpec.length; i += 1) {
        const item = optionData.brandSpec[i];
        if (item) {
          bandSpecListOptions.push({
            label: item.label,
            value: item.id,
          });
        }
      }
    }
    return bandSpecListOptions;
  };

  const handleChangeStoreId = (value: any) => {
    if (value[1] === undefined) {
      message.error('未来选择站点');
      return;
    }
    setStoreId(value[1]);

  };




  return (
    <ModalForm<StoreAnalyseItem>
      visible={visible}
      title={
        done
          ? null
          : `${current?.id
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
        if (storeId == undefined) {
          values.storeId = current?.storeId;
        } else {
          values.storeId = storeId;
        }
        values.storeId_ = undefined;
        onSubmit(values);
      }}
      initialValues={current}
      submitter={{
        render: (_, dom) => (done ? null : dom),
      }}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true
      }}
    >
      <>
        <div className={styles.form}>
          <Divider />
          <ProFormDigit name="id" hidden />
          <ProFormSelect
            name="business"
            label="选择运营商"
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
            request={async (params) => {
              return handleBusinessSelect(params.keyWords);
            }}
          />

          <ProFormCascader
            name="storeId_"
            label="选择站点"
            width="md"
            initialValue={[current?.storeGroupId, current?.storeId]}
            rules={[
              {
                required: true,
              },
            ]}
            fieldProps={{
              onChange: handleChangeStoreId,
              fieldNames: {
                children: 'children',
                label: 'label',
              },
            }}
            dependencies={['business']}
            request={async (params) => {
              if (params.business !== undefined) {
                return handleStoreTreeSelect(params.business.value);
              }
              return handleStoreTreeSelect(current?.business?.value);
            }}
          />

          <ProFormSelect
            name="category"
            width="md"
            label="选产品分类"
            showSearch
            rules={[
              {
                required: true,
              },
            ]}
            options={[
              { label: '电池', value: 'CELL' },
              { label: '电柜', value: 'CABINET' },
            ]}
          />

          <ProFormSelect
            name="brandSpec"
            width="md"
            label="选择品牌规格"
            showSearch
            rules={[
              {
                required: true,
              },
            ]}
            fieldProps={{
              labelInValue: true,
            }}
            dependencies={['category']}
            request={async (params) => {
              return handleOptionSelect(params.category);
            }}
          />

          <ProFormDigit
            name="total"
            label="总数量"
            width="xs"
            rules={[
              {
                required: true,
              },
            ]}
          />
          <ProFormDigit
            name="noneTotal"
            label="正常数量"
            width="xs"
            rules={[
              {
                required: true,
              },
            ]}
          />
          <ProFormDigit
            name="maintenanceTotal"
            label="维修数量"
            width="xs"
            rules={[
              {
                required: true,
              },
            ]}
          />
        </div>
      </>
    </ModalForm>
  );
};
export default StoreAnalyseModel;
