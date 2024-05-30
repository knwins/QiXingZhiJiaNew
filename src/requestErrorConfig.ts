import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { getLocale } from '@umijs/max';
import { message } from 'antd/lib';




// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const token = localStorage.getItem('token');
      const lang = getLocale();
      const authHeader = {
        token: `${token}`,
        lang: `${lang}`,
      };
      const url = config?.url?.concat();
      return { ...config, url, headers: authHeader };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      //console.log(response);
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;
      if (!data.success) {
        if (data.errorMessage) {
          message.error(data.errorMessage);
        }
      }
      return response;
    },
  ],
};
