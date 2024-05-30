import { request } from '@umijs/max';
import type { UserItem, UserLogItem } from './data';

/** User */
export async function queryUserList(
  params: {
    current?: number;
    pageSize?: number;
    type?:string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: UserItem[];
    total?: number;
    success?: boolean;
  }>('api/manage/user/list', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function queryUserSelect(
  params: {
    current?: number;
    pageSize?: number;
    type?:string;
    keywords?:string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: UserItem[];
    total?: number;
    status?: boolean;
  }>('api/manage/user/select', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getUser(params: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    data: UserItem;
    success?: boolean;
  }>('api/manage/user/get', {
    params: {
      ...params,
    },
    method: 'POST',
    ...(options || {}),
  });
}

export async function addUser(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/user/add', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateUser(
  data: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/user/update', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function removeUser(
  data: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/user/delete', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}


export async function initPassword(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/user/init_password', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function queryUserLogList(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: UserLogItem[];
    total?: number;
    success?: boolean;
  }>('api/manage/userlog/list', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
