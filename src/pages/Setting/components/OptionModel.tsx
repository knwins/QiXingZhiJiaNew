import { ModalForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { useIntl, useRequest } from '@umijs/max';
import type { FC } from 'react';
import { OptionItem } from '../data';
import { queryOptionSelectMark } from '../service';
import { Divider } from 'antd';

type OptionModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<OptionItem> | undefined;
  onDone: () => void;
  onSubmit: (values: OptionItem) => void;
};

const OptionModel: FC<OptionModelProps> = (props) => {
  const { done, visible, current, onDone, onSubmit, children } = props;
  const intl = useIntl();

  if (!visible) {
    return null;
  }

  //读取属性数据
  const { data: marks } = useRequest(() => {
    return queryOptionSelectMark({
      current: 1,
      pageSize: 100,
      category: 'CELL',
    });
  });

  const markListOptions = {};
  if (marks) {
    marks.map((item) => {
      markListOptions[item.value] = {
        text: item.label,
        value: item.value,
      };
    });
  }

  return (
    <ModalForm<OptionItem>
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

        <Divider/>
        <ProFormSelect
          name="useType"
          label="使用类别"
          width="md"
          rules={[
            {
              required: true,
            },
          ]}
          placeholder="请选择使用类别"
          options={[
            {
              label: '所有',
              value: 'ALL',
            },
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
        <ProFormSelect
          name="mark"
          label={intl.formatMessage({
            id: 'pages._option.mark',
          })}
          width="lg"
          placeholder={intl.formatMessage({
            id: 'pages._option.mark.placeholder',
          })}
          valueEnum={markListOptions}
        />

        <ProFormText
          name="name"
          label={intl.formatMessage({
            id: 'pages._option.name',
          })}
          width="lg"
          rules={[
            {
              required: true,
            },
          ]}
          placeholder={intl.formatMessage({
            id: 'pages._option.name.placeholder',
          })}
        />
      </>
    </ModalForm>
  );
};
export default OptionModel;
