import { DataItem } from '@antv/g2plot/esm/interface/config';

export { DataItem };

export interface VisitDataType {
  x: string;
  y: number;
}

export type SearchDataType = {
  index: number;
  keyword: string;
  count: number;
  range: number;
  status: number;
};

export type OfflineDataType = {
  name: string;
  cvr: number;
};

export interface OfflineChartData {
  date: number;
  type: number;
  value: number;
}

export type RadarData = {
  name: string;
  label: string;
  value: number;
};

export type TopData = {
  id:string;
  title: string;
  time: string;
  note: string;
  state?: string;
  exchanges?: string; //换电次数
  days?:string;//异常天数
  onlineDays?:string;//上线天数
  cabinetTimes?:string;//驻柜时长
};
export type Row1Data = {
  cellTotal: number;
  cabinetTotal: number;
  exchangeTotal: number;
  cellTotalList: VisitDataType[];
  cabinetTotalList: VisitDataType[];
  exchangeTotalList: VisitDataType[];
};

export type Row2Data = {
  abnormalCellTotalList: VisitDataType[];
  abnormalCabinetTotalList: VisitDataType[];
  pieCellData: VisitDataType[];
  pieCabinetData: VisitDataType[];
};
export type Row3Data = {
  abnormalCellTopList: TopData[];
  abnormalCabinetTopList: TopData[];
  abnormalTopList: TopData[];
  normalTopList: TopData[];
  cabinetTimesTopList: TopData[];
};

 
export type MapItem {
  latitude:string;
	longitude:string;
}

export interface AnalysisData {
  row2Data: row2Data;
  row2Data: Row2Data;
  row3Data: Row3Data;
}

