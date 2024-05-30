import { request } from '@umijs/max';
import type { AnalysisData} from './data';

export async function queryAnalyseChartData(
  params: { businessId?: string },
  options?: { [key: string]: any },
): Promise<{ data: AnalysisData }> {
  return request('/api/manage/analyse/home', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function queryAnalyseMapsData(
  params: { businessId?: string },
  options?: { [key: string]: any },
): Promise<{ data: MapItem[] }> {
  return request('/api/manage/analyse/maps', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
