// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

import type {
  FNJUserItem,
  OptionData,
  OptionItem,
  OptionMarkItem,
  RoleItem,
  SiteConfigItem,
  TaskItem,
  UserItem,
} from './data';
import { PrivilegeItem } from './data';

export async function getSiteConfig(
  params: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    data: SiteConfigItem;
    success?: boolean;
  }>('api/system/siteconfig/get', {
    params: {
      ...params,
    },
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateSiteConfig(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/system/siteconfig/update', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

//---------------------Privilege---------------------------
export async function queryPrivilegeList(
  params: {
    current?: number;
    pageSize?: number;
    parentId?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: PrivilegeItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('api/system/privilege/list', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function queryParentList(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: PrivilegeItem[];
    total?: number;
    success?: boolean;
  }>('api/system/privilege/parent', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function queryParentListCheckBox(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: PrivilegeItem[];
    total?: number;
    success?: boolean;
  }>('api/system/privilege/setting', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function addPrivilege(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/system/privilege/add', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updatePrivilege(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/system/privilege/update', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function removePrivilege(
  data: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/system/privilege/delete', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

//---------------------role---------------------------
export async function queryRoleList(
  params: {
    current?: number;
    pageSize?: number;
    parentId?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: RoleItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('api/system/role/list', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getRole(params: { id: any }, options?: { [id: string]: any }) {
  return request<{
    data: RoleItem;
    success?: boolean;
  }>('api/system/role/get', {
    params: {
      ...params,
    },
    method: 'POST',
    ...(options || {}),
  });
}

export async function addRole(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/system/role/add', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateRole(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/system/role/update', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function removeRole(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/system/role/delete', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

/** SystemUser */

export async function querySystemUserList(
  params: {
    current?: number;
    pageSize?: number;
    type?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: UserItem[];
    total?: number;
    success?: boolean;
  }>('api/system/user/list', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function querySystemUserSelect(
  params: {
    current?: number;
    pageSize?: number;
    type?: string;
    keywords?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: UserItem[];
    total?: number;
    success?: boolean;
  }>('api/system/user/select', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getSystemUser(
  params: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    data: UserItem;
    success?: boolean;
  }>('api/system/user/get', {
    params: {
      ...params,
    },
    method: 'POST',
    ...(options || {}),
  });
}

export async function addSystemUser(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/system/user/add', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateSystemUser(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/system/user/update', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function removeSystemUser(
  data: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/system/user/delete', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

/**修改密码 */
export async function initPassword(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/user/init_password', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** Option */

export async function queryOptionList(
  params: {
    current?: number;
    pageSize?: number;
    mark?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: OptionItem[];
    total?: number;
    success?: boolean;
  }>('api/system/option/list', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function queryOptionSelect(params: {
  current?: number;
  pageSize?: number;
  category?: string;
  type?:string;
}) {
  return request<{
    data: OptionData;
    total?: number;
    success?: boolean;
  }>('api/system/option/select', {
    method: 'POST',
    params: {
      ...params,
    },
  });
}

export async function queryOptionSelectMark(
  params: {
    current?: number;
    pageSize?: number;
    category?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: OptionMarkItem[];
    total?: number;
    success?: boolean;
  }>('api/system/option/select_mark', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getOption(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    data: OptionItem;
    success?: boolean;
    errorMessage?: number;
  }>('api/system/option/get', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateOption(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: number;
  }>('api/system/option/update', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function addOption(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/system/option/add', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function removeOption(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/system/option/delete', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

/**Task */

export async function queryTaskList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: TaskItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('api/system/task/list', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** FNJUser */

export async function queryFNJUserList(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: FNJUserItem[];
    total?: number;
    success?: boolean;
  }>('api/system/fnjuser/list', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getFNJUser(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    data: FNJUserItem;
    success?: boolean;
    errorMessage?: number;
  }>('api/system/fnjuser/get', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateFNJUser(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: number;
  }>('api/system/fnjuser/update', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function addFNJUser(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/system/fnjuser/add', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function removeFNJUser(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/system/fnjuser/delete', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}
export async function refreshFNJUserToken(
  data: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/system/fnjuser/refresh', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function sendPhoneSMSFNJ(
  data: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/system/fnjuser/send_phone_sms', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function checkUserPhoneFNJ(
  data: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/system/fnjuser/check_user_phone', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

