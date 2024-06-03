import { OptionParams } from '@/pages/Setting/data';
import { queryOptionSelect } from '@/pages/Setting/service';
import {
  ModalForm,
  ProFormCascader,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { Divider, Space, Steps, message } from 'antd/lib';
import { useState, type FC } from 'react';
import { BusinessParams, Pagination, StockOperationItem, StoreParams } from '../data';
import { queryBusinessSelect, queryStoreTreeSelect } from '../service';
import styles from './style.less';
import { values } from 'lodash';

type StockOperationCommendModelProps = {
  done: boolean;
  open: boolean;
  current: Partial<StockOperationItem> | undefined;
  onDone: () => void;
  onSubmit: (values: StockOperationItem) => void;
};

const StockOperationCommendModel: FC<StockOperationCommendModelProps> = (props) => {
  const { done, open, current, onDone, onSubmit } = props;
  const [toStoreId, setToStoreId] = useState<number>();
  if (!open) {
    return null;
  }

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
    const pagination: Pagination = {
      current: 1,
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
      if (current?.operationType === 'BATCH') {
        businessListOptions.push({
          label: '不修改运营商',
          value: 'UNEDIT',
        });
      }
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
    console.log(businessListOptions);
    return businessListOptions;
  };

  const handleOptionSelect = async (category?: any) => {
    const pagination: Pagination = {
      current: 1
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

    const ownershipListOptions = [];
    if (optionData.ownership) {

      if (current?.operationType === 'BATCH') {
        ownershipListOptions.push({
          label: '不修改产权与品牌',
          value: 'UNEDIT',
        });
      }
      for (let i = 0; i < optionData.ownership.length; i += 1) {
        const item = optionData.ownership[i];
        if (item) {
          ownershipListOptions.push({
            label: item.label,
            value: item.id,
          });
        }
      }
    }
    return ownershipListOptions;
  };

  const handleChangeStoreId = (value: any) => {
    if (value[1] === undefined) {
      message.error('未来选择站点');
      return;
    }
    setToStoreId(value[1]);
  };

  return (
    <ModalForm<StockOperationItem>
      open={open}
      title="调度操作流程"
      width={740}
      initialValues={current}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        values.toStoreId = toStoreId;
        values.storeId_ = undefined;//使用是防止提交storeId_
        onSubmit(values);
      }}
      //

      submitter={{
        render: (_, dom) => (done ? null : dom),
      }}
    >
      <>
        <Divider />
        <ProFormDigit name="id" hidden />
        <Steps
          current={current?.state === 'DONE' ? 2 : current?.state === 'SYNC_MINIPROGRAM' ? 1 : 0}
          className={styles.steps}
          items={[
            {
              title: '调度命令',
              description: '编辑与执行',
            },
            {
              title: '同步小程序',
              description: '根据编号菲尼基或盾创后台操作',
            },
            {
              title: '补充单据',
              description: '收、发货单据及图片',
            },
          ]}
        />

        {current?.operationType == 'IN_STORE' && (
          <>
            <Divider orientation="left">入库数据</Divider>
            <div style={{ padding: '0 40px' }}>
              <ProFormText name="category" hidden />
              <ProFormText name="operationType" hidden />
              <ProFormText
                name="fileUrl"
                label="编号文件"
                readonly
                tooltip="请确保操作编号和文件一致"
              />
              <ProFormSelect
                name="ownership"
                width="md"
                label="产权属性"
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
                  return handleOptionSelect(current?.category);
                }}
              />

              <ProFormSelect
                name="toBusiness"
                label="调入运营商"
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
                label="调入运营商站点"
                width="md"
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
                dependencies={['toBusiness']}
                request={async (params) => {
                  if (params.toBusiness !== undefined) {
                    return handleStoreTreeSelect(params.toBusiness.value);
                  }
                  return handleStoreTreeSelect(current?.toBusiness?.value);
                }}
              />

              <ProFormText
                name="supplierName"
                label="供应商名称"
                width="lg"
                rules={[
                  {
                    required: true,
                  },
                ]}
                placeholder="请输入供应商名称"
              />
              <ProFormDateTimePicker name="toCreateTime" colProps={{ xl: 8, md: 12 }} label="入库日期" />
            </div>
          </>
        )}

        {current?.operationType == 'BATCH' && <>

          <Divider orientation="left">编号文件</Divider>
          <Space size="small" style={{ padding: '0 40px' }}>
            <ProFormText name="fileUrl" readonly />
          </Space>

          <Divider orientation="left">批量修改</Divider>
          <Space direction="vertical" size="small" style={{ padding: '0 40px' }}>
            <ProFormText name="operationType" hidden />
            <ProFormSelect
              name="toBusiness"
              label="新运营商"
              width="md"
              initialValue={{ "label": "不修改运营商", "value": "UNEDIT" }}
              showSearch

              fieldProps={{
                labelInValue: true,
              }}
              request={async (params) => {
                return handleBusinessSelect(params.keyWords);
              }}
            />

            <ProFormCascader
              name="storeId_"
              label="新站点"
              width="md"
              fieldProps={{
                onChange: handleChangeStoreId,
                fieldNames: {
                  children: 'children',
                  label: 'label',
                },
              }}
              dependencies={['toBusiness']}
              request={async (params: any) => {
                if (params.toBusiness !== undefined) {
                  return handleStoreTreeSelect(params.toBusiness.value);
                }
                return handleStoreTreeSelect(current?.toBusiness?.value);
              }}
            />
            <ProFormSelect
              name="ownership"
              width="md"
              label="新产权与品牌"
              initialValue={{ "label": "不修改产权与品牌", "value": "UNEDIT" }}
              showSearch
              fieldProps={{
                labelInValue: true,
              }}
              request={async (params) => {
                return handleOptionSelect(current?.category);
              }}
            />



            <ProFormSelect
              name="stockState"
              width="sm"
              initialValue="UNEDIT"
              label="状态"
              options={[
                { label: '不修改状态', value: 'UNEDIT' },
                { label: '正常', value: 'NORMAL' },
                { label: '异常', value: 'ABNORMAL' },
                { label: '丢失', value: 'LOSS' },
                { label: '维修', value: 'MAINTENANCE' },
                { label: '调拨中', value: 'STORETOSTORE' },
              ]}
            />
            <ProFormDateTimePicker
              name="toCreateTime"
              colProps={{ xl: 8, md: 12 }}
              label="选择日期"
            />
          </Space>
        </>}

        {current?.operationType == 'STORE_TO_STORE' && (
          <>
            <Divider orientation="left">调拨数据</Divider>
            <Space direction="vertical" size="small" style={{ padding: '0 40px' }}>
              <ProFormText name="category" hidden />
              <ProFormText name="operationType" hidden />
              <ProFormText
                name="fileUrl"
                label="编号文件"
                readonly
                tooltip="请确保操作编号和文件一致"
              />
              <ProFormSelect
                name="toBusiness"
                label="调入运营商"
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
                label="调入运营商站点"
                width="md"
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
                dependencies={['toBusiness']}
                request={async (params) => {
                  if (params.toBusiness !== undefined) {
                    return handleStoreTreeSelect(params.toBusiness.value);
                  }
                  return handleStoreTreeSelect(current?.toBusiness?.value);
                }}
              />



              <ProFormSelect
                name="ownership"
                width="lg"
                label="产权与品牌"
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
                  return handleOptionSelect(current?.category);
                }}
              />


              <ProFormDateTimePicker
                name="toCreateTime"
                colProps={{ xl: 8, md: 12 }}
                label="选择日期"
              />
            </Space>
          </>
        )}
      </>
    </ModalForm>
  );
};
export default StockOperationCommendModel;
