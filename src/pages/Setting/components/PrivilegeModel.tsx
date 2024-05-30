import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';
import type { FC } from 'react';
import { PrivilegeItem } from '../data';


import { queryParentList } from '../service';

type PrivilegeModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<PrivilegeItem> | undefined;
  parentId: string | undefined;
  onDone: () => void;
  onSubmit: (values: PrivilegeItem) => void;
};

const PrivilegeModel: FC<PrivilegeModelProps> = (props) => {
  const { done, visible, current, onDone, onSubmit, children } = props;
  const intl = useIntl();
  if (!visible) {
    return null;
  }

  return (
    <ModalForm<PrivilegeItem>
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

        <ProFormTreeSelect
          name="parentId"
          initialValue={current ? current.parent?.id + '' : ''}
          label={intl.formatMessage({
            id: 'pages.privilege.parent',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.privilege.parent.placeholder',
          })}
          allowClear
          width={330}
          request={async () => {
            const { data } = await queryParentList({ current: 1, pageSize: 1000 });
            return data;
          }}
          secondary
          fieldProps={{
            suffixIcon: null,
            treeNodeFilterProp: 'title',
            fieldNames: {
              label: 'title',
            },
          }}
        />
        <ProFormText
          name="name"
          label={intl.formatMessage({
            id: 'pages.privilege.name',
          })}
          width="lg"
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.privilege.name.required',
              }),
            },
          ]}
          placeholder={intl.formatMessage({
            id: 'pages.privilege.name.placeholder',
          })}
        />

        <ProFormText
          name="icon"
          label={intl.formatMessage({
            id: 'pages.privilege.icon',
          })}
          width="lg"
          placeholder={intl.formatMessage({
            id: 'pages.privilege.icon.placeholder',
          })}
        />

        <ProFormText
          name="route"
          label={intl.formatMessage({
            id: 'pages.privilege.route',
          })}
          width="lg"
          placeholder={intl.formatMessage({
            id: 'pages.privilege.route.placeholder',
          })}
        />

        <ProFormText
          name="component"
          label={intl.formatMessage({
            id: 'pages.privilege.component',
          })}
          width="lg"
          placeholder={intl.formatMessage({
            id: 'pages.privilege.component.placeholder',
          })}
        />

        <ProFormText
          name="permission"
          label={intl.formatMessage({
            id: 'pages.privilege.permission',
          })}
          width="lg"
          placeholder={intl.formatMessage({
            id: 'pages.privilege.permission.placeholder',
          })}
        />

        <ProFormRadio.Group
          name="type"
          label="类型"
          options={[
            {
              label: '目录',
              value: 'directory',
            },
            {
              label: '菜单',
              value: 'menu',
            },
            {
              label: '按钮',
              value: 'button',
            },
          ]}
        />
       
        <ProFormRadio.Group
          hidden={current?.type == 'directory' ? false : true}
          name="isShow"
          label="显示状态"
          options={[
            {
              label: '显示',
              value: true,
            },
            {
              label: '隐藏',
              value: false,
            },
          ]}
        />

        <ProFormDigit
          name="sort"
          label={intl.formatMessage({
            id: 'pages.sort',
          })}
          width="xs"
          placeholder={intl.formatMessage({
            id: 'pages.sort.placeholder',
          })}
        />
      </>
    </ModalForm>
  );
};

export default PrivilegeModel;
