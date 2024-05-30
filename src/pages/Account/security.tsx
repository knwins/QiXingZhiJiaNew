import { currentUser } from '@/services/ant-design-pro/api';
import { LockOutlined } from '@ant-design/icons';
import { ActionType } from '@ant-design/pro-components';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { List, message } from 'antd';
import React, { useRef } from 'react';
import { UserParams } from '../Setting/data';
import styles from './base.less';
import { updateUser } from './service';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const SecurityView: React.FC = () => {
  const actionRef = useRef<ActionType>();
  //国际化
  const intl = useIntl();

  const { data: current, loading } = useRequest(() => {
    return currentUser;
  });

  const getData = () => [
    {
      title: <FormattedMessage id="pages.account.password.title" />,
      description: <FormattedMessage id="pages.account.password.description" />,
    },
  ];
  const titleData = getData();

  const handleFinish = async (fields: any, currentRow?: UserParams) => {
    try {
      const loadingHiddle = message.loading(
        intl.formatMessage({
          id: 'pages.tip.loading',
        }),
        0,
      );

      const { success } = await updateUser({
        ...currentRow,
        ...fields,
      });
      loadingHiddle();
      if (success) {
       message.success(
          intl.formatMessage({
            id: 'pages.tip.success',
          }),
        );
        if (actionRef.current) {
          actionRef.current.reload();
        }
        return true;
      }
      return false;
    } catch (error) {
      message.error(
        intl.formatMessage({
          id: 'pages.tip.error',
        }),
      );
      return false;
    }
  };

  return (
    <>
      {loading ? null : (
        <>
          <List<Unpacked<typeof titleData>>
            itemLayout="horizontal"
            dataSource={titleData}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta title={item.title} description={item.description} />
              </List.Item>
            )}
          />

          <div className={styles.left}>
            <ProForm
              title="账户密码设置"
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{
                ...current,
                phones: current?.phone?.split('-'),
              }}
              hideRequiredMark
              submitter={{
                searchConfig: {
                  submitText: intl.formatMessage({
                    id: 'pages.modify',
                  }),
                },
                render: (_, dom) => dom[1],
              }}
            >
              <ProFormText name="id" hidden/>
              <ProFormText
                name="newPasswrod"
                label={intl.formatMessage({
                  id: 'pages.account.newpassword.label',
                })}
                fieldProps={{
                  size: 'middle',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                width="md"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.account.newpassword.required',
                    }),
                  },
                ]}
                placeholder={intl.formatMessage({
                  id: 'pages.account.newpassword.placeholder',
                })}
              />

              <ProFormText
                name="confirmNewPasswrod"
                label={intl.formatMessage({
                  id: 'pages.account.confirmnewpassword.label',
                })}
                width="md"
                fieldProps={{
                  size: 'middle',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'pages.account.confirmnewpassword.required',
                    }),
                  },
                ]}
                placeholder={intl.formatMessage({
                  id: 'pages.account.confirmnewpassword.placeholder',
                })}
              />
              <ProFormText name="id" hidden />
            </ProForm>
          </div>
        </>
      )}
    </>
  );
};

export default SecurityView;
