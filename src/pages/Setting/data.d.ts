import { StoreItem } from "../Asset/data";

export type SiteConfigItem = {
  id: string;
  name: string;
  title: string;
  domain: string;
  description: string;
  keywords: string;
  uploadFileServer: string;
  arrMark: string;
  quoteStartTime: string;
  tempTime: Date;
  blockNubmer: string;
  appVersion: string;
  verMessage: string;
  verUrl: string;
  appAndroidVersion: string;
  verAndroidMessage: string;
  verAndroidUrl: string;
  monitorSpot: number;
  monitorFuture: number;
};

export type Pagination = {
  total?: number;
  pageSize?: number;
  current: number;
};

export type SiteConfigParams = {
  id: string;
};

export type PrivilegeItem = {
  id: string;
  name?: string;
  path?: string;
  component?: string;
  type?: string;
  sort?: number;
  isShow?:boolean;
  children?: Array<PrivilegeItem>;
  parent?: PrivilegeItem;
  parentId?: string;
};

export type PrivilegeParams = {
  parentId?: string;
  roleId?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
} & Partial<PrivilegeItem>;

export type RoleItem = {
  id: string;
  name?: string;
  group?:string;
  privileges?: PrivilegeItem[];
  privilegeIds?:any[];
};

export type RoleParams = {
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
} & Partial<RoleItem>;


export type UserPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type UserItem = {
  id: string;
  username: string;
  password:string;
  nick?: string;
  phone?: string;
  email?: string;
  avatar?:string;
  storeType?:string;
  type?:string;
  description?: string;
  role?:RoleItem;
  store?:StoreItem;
  storeIds?:string;
  storeArr?:string[];
  key?:string;
  label?:string;
};


export type labelValueItem = {
  label: string;
  value: string;
};

export type UserParams = {
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
} & Partial<UserItem>;


export type OptionItem = {
  id: string;
  name?: string;
  mark?: string;
  value?:string;
  label?:string;
};

export type OptionData = {
  id: string;
  business: OptionItem[];
  brand: OptionItem[];
  spec: OptionItem[];
  brandSpec:OptionItem[];
  ownership:OptionItem[];
};

export type OptionMarkItem = {
  value: string;
  label: string;
};

export type OptionParams = {
  mark?: string;
  category?:string;
  useType?:string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
} & Partial<OptionItem>;

export type TaskItem = {
  id: string;
  name:string;
  status: string;
  startTime: Date;
  endTime:Date;
  lastUpdateTime:Data;
  takeTime:number;
  number:number;
  httpurl?:string;
  description?:string;
  sort:number;
};

export type TaskPagination = {
  total: number;
  pageSize: number;
  current: number;
};


export type FNJUserItem = {
  id: string;
  loginName:string;
  password: string;
  type?:string;
  equipment?:string;
  token:string;
  businessId:string;
};