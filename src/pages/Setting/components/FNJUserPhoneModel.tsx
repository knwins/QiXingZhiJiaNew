import { LockOutlined } from '@ant-design/icons';
import { ProFormCaptcha } from '@ant-design/pro-components';
import ProForm, { ModalForm, ProFormDigit, ProFormText } from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';
import { Divider, message } from 'antd';
import type { FC } from 'react';
import { FNJUserItem } from '../data';
import { sendPhoneSMSFNJ } from '../service';

type FNJUserPhoneModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<FNJUserItem> | undefined;
  onDone: () => void;
  onSubmit: (values: FNJUserItem) => void;
};

const FNJUserPhoneModel: FC<FNJUserPhoneModelProps> = (props) => {
  const { done, visible, current, onDone, onSubmit } = props;
  const intl = useIntl();
  if (!visible) {
    return null;
  }
  return (
    <ModalForm<FNJUserItem>
      visible={visible}
      title="刷新失败进行短信验证"
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
        <Divider></Divider>
        <ProFormDigit name="id" hidden />
        <ProForm.Group title="">
          <ProFormText
            name="phone"
            label="手机号码"
            width="sm"
            rules={[
              {
                required: true,
              },
            ]}
            disabled
          />
          <ProFormCaptcha
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
            }}
            captchaProps={{
              size: 'large',
            }}
            placeholder={'请输入验证码'}
            captchaTextRender={(timing, count) => {
              if (timing) {
                return `${count} ${'获取验证码'}`;
              }
              return '获取验证码';
            }}
            name="smsCode"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
            onGetCaptcha={async () => {
              const { success, errorMessage } = await sendPhoneSMSFNJ({ phone: current.phone });
              if (success) {
                message.success('发送成功');
                return;
              } else {
                message.error(errorMessage);
                return;
              }
              return;
            }}
          />
        </ProForm.Group>
      </>
    </ModalForm>
  );
};
export default FNJUserPhoneModel;
