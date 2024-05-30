import { ProductItem } from '../Asset/data';
import { OptionItem, UserItem } from '../Setting/data';

export type Pagination = {
  pageSize?: number;
  current: number;
};

export type StoreGroupItem = {
  id: string;
  name: string;
  contactName: string;
  contactPhone: string;
  user: UserItem;
  Business: BusinessItem;
  userId?: string;
  businessId: string;
  label?: string;
  value?: string;
};

export type StoreGroupParams = {
  businessId?: string;
  userId?: string;
  keywords?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
} & Partial<StoreItem>;

export type StoreItem = {
  id: string;
  name: string;
  typeArr: string;
  categoryArr: string[];
  address?: string;
  user: UserItem;
  userId?: string;
  label?: string;
  value?: string;
  useType?: string;
  storeGroup?: StoreGroupItem;
  address?: AddressItem;
  business?: BusinessItem;
  fnjToken?: string;
};

export type StoreParams = {
  type?: string;
  category?: string;
  businessId?: string;
  keywords?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
} & Partial<StoreItem>;

export type StoreAnalyseItem = {
  id: string;
  category: string;
  total?: number;
  noneTotal?: number;
  maintenanceTotal?: number;
  brandSpec?: OptionItem;
  store?: StoreItem;
  business?: BusinessItem;
  user: UserItem;
  userId?: string;
  storeId?: number;
  label?: string;
  value?: string;
  storeGroupId?: number;
};

export type StoreAnalyseParams = {
  storeIds?: string;
  keywords?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
} & Partial<StoreAnalyseItem>;

export type StockOperationItem = {
  id: string;
  category: string;
  operationType?: string;
  operationCommend?: string;
  state?: string;
  quantity?: number;
  fileUrl?: string;
  otherFileUrls?: string;
  otherFileUrlList?: string[];
  remarks?: string;
  createTime?: Date;
  updateTime?: Date;
  business?: BusinessItem;
  user: UserItem;
  userId?: string;
  businessId?: string;
  label?: string;
  value?: string;

  //调拨用到数据
  toBusiness: BusinessItem;
  toStoreId?: string;
  toScreateTime: string;
  supplierName: string;
  toCreateTime: Date;
  brandSpec: OptionItem; // 产品品牌规格
};

export type StockOperationParams = {
  keywords?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
} & Partial<StockOperationItem>;

export type AddressItem = {
  id: string;
  detail?: string;
  province: ProvinceCityDistrictItem;
  city: ProvinceCityDistrictItem;
  district: ProvinceCityDistrictItem;
  latitude?: string;
  longitude?: string;
  label?: string;
  value?: string;
};

export type StoreTreeItem = {
  label: string;
  value: string;
  children?: StoreTreeItem[];
};

export type AddressParams = {
  keywords?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
} & Partial<AddressItem>;

export type BusinessItem = {
  id: string;
  name: string;
  label: ?string;
  value: ?string;
};

export type BusinessParams = {
  keywords?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
} & Partial<BusinessItem>;

export type PartnerItem = {
  id: string;
  name: string;
  username: string;
  phone: string;
  label?: string;
  value?: string;
};

export type PartnerParams = {
  keywords?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
} & Partial<PartnerItem>;

export type ProductCheckItem = {
  id: string;
  input0: boolean;
  input1: boolean;
  input2: boolean;
  input3: boolean;
  input4: boolean;
  content: string;
  address: string;
  imglist: string;
  inro: string;
  imgs: string[];
  createTime: Date;
  product: ProductItem;
  user: UserItem;
};

export type ProductLeaseItem = {
  id: string;
  product: ProductItem;
  user: UserItem;
  leaseUser: UserItem;
  inro: string;
  deductAmount: number;
  amountTotal: number;
  deposit: number;
  numTotal: number;
  price: number;
  deposit: number;
  state: string;
  payType: string;
  createTime: Date;
  startTime: Date;
  endTime: Date;
  action: string;
};

export type ProductLeaseParams = {
  keywords?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
} & Partial<ProductLeaseItem>;

export type ProductLeaseOrderItem = {
  id: string;
  productLease: ProductLeaseItem;
  inro: string;
  amount: number;
  num: number;
  action: string;
  createTime: Date;
};

export type ProductLeaseOrderParams = {
  keywords?: string;
  productLeaseId?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
} & Partial<ProductLeaseOrderItem>;

export type BusinessItem = {
  id: string;
  name: string;
  state: string;
  createTime: Date;
};

export type BusinessParams = {
  keywords?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
} & Partial<BusinessItem>;

export type WarnInfoItem = {
  id: string;
  readTime: Date;
  alarmStartTime: Date;
  alarmEndTime: Date;
  devId: string;
  alarmDesc: string;
  alarmFlag: number;
  alarmId: string;
  doorId?: string;
  alarmType?: string;
  alarmMessage?: string;
  alarmLevel?: string;
  type: string;
  business: BusinessItem;
};

export type WarnInfoParams = {
  keywords?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
} & Partial<WarnInfoItem>;

export type ArticleItem = {
  id: string;
  title: string;
  thumbImage: string;
  status: number;
  keywords?: string;
  createTime: Date;
  contentTxtUrl: string;
  sort: number;
  articleTypeId: string;
  articleType: ArticleTypeItem;
  content: string;
};

export type Pagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type ArticleParams = {
  title?: string;
  status?: number;
  articleTypeId?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};

export type ArticleTypeItem = {
  id: string;
  name: string;
  description: string;
  mark?: string;
  thumbImgWidth?: number;
  thumbImgHeight?: number;
  lang?: string;
};

export type ArticleTypePagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type ArticleTypeData = {
  list: ArticleTypeItem[];
  pagination: Partial<ArticleTypePagination>;
};

export type ArticleTypeParams = {
  name?: string;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
