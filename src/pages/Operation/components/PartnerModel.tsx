import { ModalForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';
import type { FC } from 'react';

import { PartnerItem } from '../data';

type PartnerModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<PartnerItem> | undefined;
  onDone: () => void;
  onSubmit: (values: PartnerItem) => void;
};

const PartnerModel: FC<PartnerModelProps> = (props) => {
  const { done, visible, current, onDone, onSubmit, children } = props;
  const intl = useIntl();

  if (!visible) {
    return null;
  }

  return (
    <ModalForm<PartnerItem>
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
          name="name"
          label={intl.formatMessage({
            id: 'pages.partner.name',
          })}
          width="md"
          rules={[
            {
              required: true,
            },
          ]}
          placeholder={intl.formatMessage({
            id: 'pages.partner.name.placeholder',
          })}
        />

        <ProFormSelect
          name="state"
          initialValue="NORMAL"
          label={intl.formatMessage({
            id: 'pages.partner.state',
          })}
          width="xs"
          placeholder={intl.formatMessage({
            id: 'pages.partner.state.placeholder',
          })}
          options={[
            { label: '停用', value: 'STOP' },
            { label: '正常', value: 'NORMAL' },
          ]}
        />

        <ProFormText
          name="username"
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
          name="phone"
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
export default PartnerModel;
