import { ModalForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';
import type { FC } from 'react';
import { FNJUserItem } from '../data';

type FNJUserModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<FNJUserItem> | undefined;
  onDone: () => void;
  onSubmit: (values: FNJUserItem) => void;
};

const FNJUserModel: FC<FNJUserModelProps> = (props) => {
  const { done, visible, current, onDone, onSubmit, children } = props;
  const intl = useIntl();

  if (!visible) {
    return null;
  }

  return (
    <ModalForm<FNJUserItem>
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
        <ProFormText
          name="loginName"
          label="登录用户名"
          width="sm"
          rules={[
            {
              required: true,
            },
          ]}
          placeholder="请输入登录用户名"
        />
        <ProFormText
          name="password"
          label="密码"
          width="sm"
          rules={[
            {
              required: true,
            },
          ]}
          placeholder="请输入密码"
        />

        <ProFormText
          name="equipment"
          label="浏览器参数"
          width="lg"
          rules={[
            {
              required: true,
            },
          ]}
          placeholder="请输入浏览器参数"
        />

        <ProFormSelect
          name="businessId"
          label="选择运营商"
          width="sm"
          options={[
            {
              label: '你想换电',
              value:1,
            },
            {
              label: '中骏换电',
              value:3,
            },
          ]}
          rules={[
            {
              required: true,
            },
          ]}
        />
      </>
    </ModalForm>
  );
};
export default FNJUserModel;
