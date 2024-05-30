import { BusinessParams, StoreParams } from '@/pages/Operation/data';
import { queryBusinessSelect, queryStoreSelect } from '@/pages/Operation/service';
import { ProFormRadio } from '@ant-design/pro-components';
import { ModalForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { useIntl, useRequest } from '@umijs/max';
import type { FC } from 'react';
import { pagination, UserItem } from '../data';
import { queryRoleList } from '../service';

type UserModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<UserItem> | undefined;
  onDone: () => void;
  onSubmit: (values: UserItem) => void;
};

const UserModel: FC<UserModelProps> = (props) => {
  const { done, visible, current, onDone, onSubmit, children } = props;
  const intl = useIntl();
  if (!visible) {
    return null;
  }

  //读取分类数据
  const { data: roleDate } = useRequest(() => {
    return queryRoleList({
      current: 1,
      pageSize: 100,
    });
  });

  const roleListOptions = {};
  if (roleDate) {
    roleDate.map((item) => {
      roleListOptions[item.id] = {
        text: item.name,
        value: item.id,
      };
    });
  }

  const handleStoreSelect = async (key?: any, keywords?: any) => {
    if (key === '') {
      return;
    }
    const pagination: pagination = {
      current: 1,
      pageSize: 5000,
      total: 100,
    };
    const options: StoreParams = {
      type: key,
      keywords: keywords,
    };
    //读取仓库数据
    const { data: storeData } = await queryStoreSelect({
      ...pagination,
      ...options,
    });

    const storeListOptions = [];
    if (storeData) {
      for (let i = 0; i < storeData.length; i += 1) {
        const item = storeData[i];
        if (item) {
          storeListOptions.push({
            label: item.label,
            value: item.value,
          });
        }
      }
    }
    return storeListOptions;
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

  //end

  return (
    <ModalForm<UserItem>
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
          name="username"
          label={intl.formatMessage({
            id: 'pages.user.username',
          })}
          width="lg"
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.user.username.required',
              }),
            },
          ]}
          placeholder={intl.formatMessage({
            id: 'pages.user.username.placeholder',
          })}
        />

        <ProFormSelect
          name="role"
          label={intl.formatMessage({
            id: 'pages.user.role.name',
          })}
          fieldProps={{
            labelInValue: true,
          }}
          width="lg"
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.user.role.name.required',
              }),
            },
          ]}
          placeholder={intl.formatMessage({
            id: 'pages.user.role.name.placeholder',
          })}
          valueEnum={roleListOptions}
        />

        <ProFormText
          name="nick"
          label={intl.formatMessage({
            id: 'pages.user.nick',
          })}
          width="lg"
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.user.nick.required',
              }),
            },
          ]}
          placeholder={intl.formatMessage({
            id: 'pages.user.nick.placeholder',
          })}
        />

        <ProFormText
          name="phone"
          label={intl.formatMessage({
            id: 'pages.user.phone',
          })}
          width="lg"
          placeholder={intl.formatMessage({
            id: 'pages.user.phone.placeholder',
          })}
        />

        <ProFormText
          name="email"
          label={intl.formatMessage({
            id: 'pages.user.email',
          })}
          width="lg"
          placeholder={intl.formatMessage({
            id: 'pages.user.email.placeholder',
          })}
        />

        <ProFormRadio.Group
          name="storeType"
          initialValue="All"
          options={[
            {
              label: '所有',
              value: 'All',
            },
            {
              label: '站点',
              value: 'Site',
            },
            {
              label: '仓库',
              value: 'Store',
            },
          ]}
        />

        <ProFormSelect
          name="storeArr"
          width="lg"
          tooltip="默认为用户所属运营商及下级的站点"
          placeholder="默认为用户所属运营商及下级的站点"
          fieldProps={{
            mode: 'multiple',
          }}
          showSearch
          label="站点权限"
          initialValue={current?.storeArr} // 设置默认选中的值
          dependencies={['storeType']}
          request={async (params) => {
            return handleStoreSelect(params.storeType, params.keyWords);
          }}
        />

        <ProFormSelect
          name="business"
          width="lg"
          fieldProps={{
            labelInValue: true,
          }}
          rules={[
            {
              required: true,
            },
          ]}
          label="运营商"
          request={async (params) => {
            return handleBusinessSelect(params.keyWords);
          }}
        />

        <ProFormText
          name="description"
          label={intl.formatMessage({
            id: 'pages.user.description',
          })}
          width="lg"
          placeholder={intl.formatMessage({
            id: 'pages.user.description.placeholder',
          })}
        />
      </>
    </ModalForm>
  );
};

export default UserModel;
