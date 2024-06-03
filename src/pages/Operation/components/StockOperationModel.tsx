import { OptionParams, pagination } from '@/pages/Setting/data';
import { queryOptionSelect } from '@/pages/Setting/service';
import { ActionType } from '@ant-design/pro-components';
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';
import { Divider, message, Upload } from 'antd/lib';
import { FC, useRef, useState } from 'react';

import { AddressItem, BusinessParams, Pagination, StockOperationItem, StoreParams } from '../data';
import { addAddress, queryBusinessSelect, queryStoreTreeSelect, updateAddress } from '../service';

import styles from './style.less';

type StockOperationModelProps = {
  done: boolean;
  open: boolean;
  current: Partial<StockOperationItem> | undefined;
  onDone: () => void;
  onSubmit: (values: StockOperationItem) => void;
};

const StockOperationModel: FC<StockOperationModelProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const { done, open, current, onDone, onSubmit } = props;

  const [fileUrl, setFileUrl] = useState('');
  const uploadFileURL = 'https://qixingzhijia.szqws.com:8081/api/file/upload_file';

  const intl = useIntl();
  if (!open) {
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
    //setStoreId(value[1]);
  };

  const handleChange = (info: any) => {
    //done
    if (info.file.status === 'done') {
      if (!info.file.response.success) {
        message.error(info.file.response.errorMessage);
      } else {
        setFileUrl(info.file.response.data);
        message.success('上传成功');
      }
    }
    //error
    else if (info.file.status === 'error') {
      message.error(`您没有权限访问`);
    }
  };

  //上传之前验证大小
  const beforeUpload = (file: any) => {
    const isLt10M = (file.size || 0) < 1024 * 1024 * 10;
    if (!isLt10M) {
      message.error('文件不能超过10MB!');
    }
    return isLt10M ? true : Upload.LIST_IGNORE;
  };

  return (
    <ModalForm<StockOperationItem>
      open={open}
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
        values.fileUrl = fileUrl;
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
        <div className={styles.form}>
          <Divider />
          <ProFormDigit name="id" hidden />
          <ProFormText
            name="name"
            label="操作名称"
            rules={[
              {
                required: true,
              },
            ]}
            width="md"
          />
          <ProFormSelect
            name="operationType"
            label="选择操作"
            width="md"
            showSearch
            rules={[
              {
                required: true,
              },
            ]}
            options={[
              { label: '入库', value: 'IN_STORE' },
              { label: '出库', value: 'OUT_STORE' },
              { label: '调拨', value: 'STORE_TO_STORE' },
              { label: '批量', value: 'BATCH' },
              { label: '其他', value: 'OTHER' },
            ]}
          />

          <ProFormSelect
            name="business"
            label="所属运营商"
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

          <ProFormUploadButton
            label="选择上传Execl文件"
            action={uploadFileURL}
            fieldProps={{
              accept:
                'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              name: 'uploadFile',
              headers: { Token: localStorage.getItem('token') || '' },
              beforeUpload: beforeUpload,
            }}
            onChange={handleChange}
            max={1}
            title="上传"
          />

          <ProFormDigit
            name="quantity"
            label="数量"
            width="xs"
            hidden={current?.id ? false : true}
          />
        </div>
      </>
    </ModalForm>
  );
};
export default StockOperationModel;
