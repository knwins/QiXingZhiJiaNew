import { ModalForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';
import { Tree } from 'antd';
import { FC, useEffect, useState } from 'react';
import { RoleItem } from '../data';
import { queryParentList } from '../service';


type RoleModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<RoleItem> | undefined;
  onDone: () => void;
  onSubmit: (values: RoleItem) => void;
};

const RoleModel: FC<RoleModelProps> = (props) => {
  const { done, visible, current, onDone, onSubmit, children } = props;
  const intl = useIntl();
  if (!visible) {
    return null;
  }
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  //回显已选项
  const rolePrivilege = (privileges: any) => {
    const privilegeIds: any = [];
    if (privileges) {
      privileges.map((item: any) => {
        privilegeIds.push(item.id);
      });
      setCheckedKeys(privilegeIds);
    }
  };

  // 获取树形节点数据
  const listPrivilege = async () => {
    const { data } = await queryParentList({ current: 1, pageSize: 1000 });
    setTreeData(data);
  };

  // 树节点展开/收缩
  const onExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(true);
  };

  //循环显示数据
  const loop = (data: any) =>
    data.map((item: any) => {
      if (item.children) {
        return { title: item.title, key: item.value, children: loop(item.children) };
      }
      return {
        title: item.title,
        key: item.value,
      };
    });

  //读取数据
  useEffect(() => {
    listPrivilege();
    rolePrivilege(current?.privileges);
  }, []);

  const onCheck = (checkedKeysValue: any, event: any) => {
    setCheckedKeys(checkedKeysValue);
  };

  return (
    <ModalForm<RoleItem>
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
        values.privilegeIds = checkedKeys;
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
            id: 'pages.role.name',
          })}
          width="lg"
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.role.name.required',
              }),
            },
          ]}
          placeholder={intl.formatMessage({
            id: 'pages.role.name.placeholder',
          })}
        />

        <ProFormSelect
          label={intl.formatMessage({
            id: 'pages.role.group',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.role.group.placeholder',
          })}
          name="group"
          options={[
            {
              label: '系统管理员',
              value: 'SYSTEM_USER',
            },
            {
              label: '运营管理员',
              value: 'BUSINESS_USER',
            },
            {
              label: '仓库管理员',
              value: 'STORE_USER',
            },
            {
              label: '巡检管理员',
              value: 'CHECK_ADMIN_USER',
            },
            {
              label: '巡检用户',
              value: 'CHECK_USER',
            },
            {
              label: '租赁用户',
              value: 'LEASE_USER',
            },
          ]}
        />
        <label style={{ padding: '10px 0' }}> 权限配置</label>

        <Tree
          checkable
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          checkedKeys={checkedKeys}
          treeData={loop(treeData)}
          onCheck={onCheck}
        />
      </>
    </ModalForm>
  );
};

export default RoleModel;
