import { request } from 'umi';

import {
  BatteryDetailItem,
  CabinetDetailItem,
  ProductItem,
  ProductLogItem,
  ProductStockItem,
  ProvinceCityDistrictItem,
  StockItem,
} from './data';

/**Stock */

export async function queryStockList(
  params: {
    current?: number;
    pageSize?: number;
    category?: string;
    searchStoreIds?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: StockItem[];
    total?: number; //总记录数
    totalPage?: number; //总页数
    success?: boolean;
  }>('api/manage/stock/list', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function exportStockList(
  params: {
    current?: number;
    pageSize?: number;
    category?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    success?: boolean;
    data?: string;
    errorMessage?: number;
  }>('api/manage/stock/export', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function queryStockSelect(
  params: {
    current?: number;
    pageSize?: number;
    category?: string;
    state?: string;
    keywords?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: StockItem[];
    total?: number; //总记录数
    totalPage?: number; //总页数
    success?: boolean;
  }>('api/manage/stock/select', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getStockDetail(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    data: StockItem;
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/stock/detail', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateStock(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: number;
  }>('api/manage/stock/update', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function addStock(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/stock/add', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function removeStock(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/stock/delete', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function removeStockByIds(
  data: { [ids: string]: any },
  options?: { [ids: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/stock/delete', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

/**Product */
export async function queryProductList(
  params: {
    current?: number;
    pageSize?: number;
    category?: string;
    searchStoreIds?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: ProductItem[];
    total?: number; //总记录数
    totalPage?: number; //总页数
    success?: boolean;
  }>('api/manage/product/list', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function exportProductList(
  params: {
    current?: number;
    pageSize?: number;
    category?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    success?: boolean;
    data?: string;
    errorMessage?: number;
  }>('api/manage/product/export', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function queryProductSelect(
  params: {
    current?: number;
    pageSize?: number;
    category?: string;
    state?: string;
    keywords?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: ProductItem[];
    total?: number; //总记录数
    totalPage?: number; //总页数
    success?: boolean;
  }>('api/manage/product/select', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getProductDetail(
  data: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    data: ProductItem;
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/product/detail', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateProduct(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: number;
  }>('api/manage/product/update', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function addProduct(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/product/add', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/**
 * 调拨
 * @param data
 * @param options
 * @returns
 */
export async function createProductLog(
  data: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/product/create_product_log', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/**
 * 确认到货
 * @param data
 * @param options
 * @returns
 */
export async function submitProductLog(
  data: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/product/submit_create_product_log', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function createProductStock(
  data: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/product/stock/create', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function addProductStock(
  data: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/product/stock/add', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function removeProductStock(
  data: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/product/stock/delete', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

/**
 * 批量调拨
 * @param data
 * @param options
 * @returns
 */
export async function batchCreateProductLog(
  data: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    success?: boolean;
    data?: String;
    errorMessage?: string;
  }>('api/manage/product/batch_create_product_log', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/**批量确认收货 */
export async function batchSubmitProductLog(
  data: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    success?: boolean;
    data?: String;
    errorMessage?: string;
  }>('api/manage/product/batch_submit_product_log', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function removeProduct(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/product/delete', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function removeProductByIds(
  data: { [ids: string]: any },
  options?: { [ids: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/product/delete', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

/* product stock */

export async function queryProductStockList(
  params: {
    current?: number;
    pageSize?: number;
    productId?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: ProductStockItem[];
    total?: number;
    success?: boolean;
  }>('api/manage/product/stock/list', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function queryProductStockSelect(
  params: {
    current?: number;
    pageSize?: number;
    productId?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: ProductStockItem[];
    total?: number;
    success?: boolean;
  }>('api/manage/product/stock/select', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/**productLog */

export async function queryProductLogList(
  params: {
    current?: number;
    pageSize?: number;
    mark?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: ProductLogItem[];
    total?: number;
    success?: boolean;
  }>('api/manage/product/log/list', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getproductLog(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    data: ProductLogItem;
    success?: boolean;
    errorMessage?: number;
  }>('api/manage/product/log/get', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateProductLog(
  data: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: number;
  }>('api/manage/product/log/update', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function addProductLog(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/product/log/add', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function removeproductLog(
  data: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/product/log/delete', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

/**STOCKLOG */
export async function queryStockLogList(
  params: {
    current?: number;
    pageSize?: number;
    stockId: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: StockLogItem[];
    total?: number;
    success?: boolean;
  }>('api/manage/stock/log/list', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getStockLog(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    data: ProductLogItem;
    success?: boolean;
    errorMessage?: number;
  }>('api/manage/stock/log/get', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateStockLog(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: number;
  }>('api/manage/stock/log/update', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function addStockLog(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/stock/log/add', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function removeStockLog(data: { [id: string]: any }, options?: { [id: string]: any }) {
  return request<{
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/stock/log/delete', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

/**
 *  省市区
 * @param params
 * @param options
 * @returns
 */

export async function queryPCDList(
  params: {
    current?: number;
    pageSize?: number;
    parentId?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: ProvinceCityDistrictItem[];
    total?: number;
    totalPage?: number;
    success?: boolean;
  }>('api/system/pcd/list', {
    params: {
      ...params,
    },
    method: 'POST',
    ...(options || {}),
  });
}

export async function getBatteryDetail(
  data: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    data: BatteryDetailItem;
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/product/battery/detail', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function getCabinetDetail(
  data: { [id: string]: any },
  options?: { [id: string]: any },
) {
  return request<{
    data: CabinetDetailItem;
    success?: boolean;
    errorMessage?: string;
  }>('api/manage/product/cabinet/detail', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}
