import { BusinessItem, PartnerItem } from "../Operation/data";

export type pagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type UserItem = {
  id: string;
  username: string;
  portrait: string;
  createTime: Date;
  state: string;
  nick: string;
  signature: string;
  password:string;
  parent: UserItem;
  partner:PartnerItem;
  business:BusinessItem;
  label?:string;
  value?:string;
};

export type UserParams = {
  username?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
} & Partial<UserItem>;


export type UserLogItem = {
  id: string;
  ip: string;
  content: string;
  createTime: Date;
  type: string;
  user: UserItem;
};

export type UserLogParams = {
  userId?: string;
  filter?: string;
  sorter?: string;
};

