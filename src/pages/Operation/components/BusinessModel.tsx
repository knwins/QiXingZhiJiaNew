import { ModalForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';
import type { FC } from 'react';

import { BusinessItem } from '../data';

type BusinessModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<BusinessItem> | undefined;
  onDone: () => void;
  onSubmit: (values: BusinessItem) => void;
};

const BusinessModel: FC<BusinessModelProps> = (props) => {
  const { done, visible, current, onDone, onSubmit } = props;
  const intl = useIntl();

  if (!visible) {
    return null;
  }

  return (
    <ModalForm<BusinessItem>
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

        <ProFormText
          name="name"
          label={intl.formatMessage({
            id: 'pages.business.name',
          })}
          width="md"
          rules={[
            {
              required: true,
            },
          ]}
          placeholder={intl.formatMessage({
            id: 'pages.business.name.placeholder',
          })}
        />

        <ProFormSelect
          name="state"
          initialValue="NORMAL"
          label={intl.formatMessage({
            id: 'pages.business.state',
          })}
          width="xs"
          placeholder={intl.formatMessage({
            id: 'pages.business.state.placeholder',
          })}
          options={[
            { label: '停用', value: 'STOP' },
            { label: '正常', value: 'NORMAL' },
          ]}
        />
      </>
    </ModalForm>
  );
};
export default BusinessModel;
