import { ModalForm, Submitter, ProFormDatePicker, ProFormDigit, ProFormText } from '@ant-design/pro-form';
import { Divider, Space, Steps } from 'antd/lib';
import { type FC } from 'react';
import { StockOperationItem } from '../data';
import styles from './style.less';

import { ProFormUploadButton } from '@ant-design/pro-form';
import { Image, message, Upload, Button } from 'antd/lib';
import { useState } from 'react';

type StockOperationDetailModelProps = {
  done: boolean;
  open: boolean;
  current: Partial<StockOperationItem> | undefined;
  onDone: () => void;
  onSubmit: (values: StockOperationItem) => void;
};

const StockOperationDetailModel: FC<StockOperationDetailModelProps> = (props) => {
  const { done, open, current, onDone, onSubmit } = props;
  const [step, setStep] = useState(0);
  const [otherFileUrls, setOtherFileUrls] = useState('');
  const uploadFileURL =
    'https://qixingzhijia.szqws.com:8081/api/manage/stock_operation/upload_image';


  // submitter={{
  //   render: (_, dom) => (done ? null : dom),
  //   submitButtonProps: { style: { display: 'none' } }
  // }}

  const [submitterProps, setSubmitterProps] = useState({
    render: (props: any, dom: any) => (done ? null : dom),
  });


  //更新submitter属性的函数
  const updateSubmitter = () => {
    setSubmitterProps({
      submitButtonProps: { style: { display: 'none' } },
    });
  };


  // const updateSubmitter = () => {
  //   setSubmitter({
  //     submitButtonProps: {
  //       children: '更新提交',
  //     },
  //     onSubmit: async (values) => {
  //       console.log('Updated submitter:', values);
  //       // 执行更新后的逻辑
  //     },
  //   });
  // };




  if (!open) {
    return null;
  }

  // if(current?.state==='DONE'){
  //   updateSubmitter();
  //   return;
  // }

  var imgList = [];
  var i = 1;
  for (let item of current?.otherFileUrlList || []) {
    imgList.push(<Image width={100} src={item} />);
    i++;
  }

  const handleChange = (info: any) => {
    //done
    if (info.file.status === 'done') {
      if (!info.file.response.success) {
        message.error(info.file.response.errorMessage);
      } else {
        setOtherFileUrls(info.file.response.data);
        message.success('上传成功');
        //updateSubmitter();
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

  return (<>

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
        onSubmit(values);
      }}
      submitter={submitterProps}
    >
      <>
        <Button onClick={updateSubmitter}>更新Submitter</Button>
        <Divider />
        <ProFormDigit name="id" hidden />
        <Steps
          current={current.state === 'DONE' ? 2 : current.state === 'SYNC_MINIPROGRAM' ? 1 : 0}
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
        {current.state == 'SYNC_MINIPROGRAM' && (
          <>
            <Divider orientation="left">同步小程序数据</Divider>
            <div style={{ padding: '20px 40px' }}>
              <ProFormText name="state" hidden />
              <ProFormText name="category" hidden />
              <ProFormText name="operationType" hidden />
              <ProFormText name="fileUrl" label="设备编号文件" readonly />

              <ProFormText name="operationCommand" label="操作命令" readonly />

              <ProFormText name="remarks" label="操作日志" readonly />

              <ProFormText
                name="syncRemarks"
                label="小程序同步日志"
                rules={[
                  {
                    required: true,
                  },
                ]}
                width="md"
              />
            </div>
          </>
        )}

        {current.state == 'DONE' && (
          <>
            {current?.otherFileUrlList != null && (
              <>
                <div style={{ paddingBottom: '30px' }}>
                  <Divider orientation="left">已经上传文件</Divider>

                  <Image.PreviewGroup
                    preview={{
                      onChange: (current, prev) =>
                        console.log(`current index: ${current}, prev index: ${prev}`),
                    }}
                  >
                    <Space size="small" style={{ padding: '0 40px' }}>
                      {' '}
                      {imgList}
                    </Space>
                  </Image.PreviewGroup>
                </div>
              </>
            )}

            <Divider orientation="left">上传补充文件</Divider>
            <Space direction="vertical" size="small" style={{ padding: '0 40px' }}>
              <ProFormUploadButton
                action={uploadFileURL}
                fieldProps={{
                  accept: 'image/png, image/jpeg',
                  data: { stockOperationId: current.id },
                  name: 'imageFile',
                  headers: { Token: localStorage.getItem('token') || '' },
                  beforeUpload: beforeUpload,
                }}
                onChange={handleChange}
                max={1}
                title="上传"
              />
            </Space>
          </>
        )}
      </>
    </ModalForm>
  </>
  );
};
export default StockOperationDetailModel;
