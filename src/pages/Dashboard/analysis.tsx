import { GridContent } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Col, Row } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import type { RadioChangeEvent } from 'antd/es/radio';
import type dayjs from 'dayjs';
import type { FC } from 'react';
import { Suspense, useState } from 'react';
import IntroduceRow from './components/IntroduceRow';
import PageLoading from './components/PageLoading';
import ProportionPie from './components/ProportionPie';
import type { TimeType } from './components/ThrendCard';
import ThrendCard from './components/ThrendCard';
import TopCard from './components/TopCard';
import TopCell from './components/TopCell';
import type { AnalysisData } from './data';
import { queryAnalyseChartData } from './service';
import useStyles from './style.style';
import { getTimeDistance } from './utils/utils';

type RangePickerValue = RangePickerProps<dayjs.Dayjs>['value'];
type AnalysisProps = {
  dashboardAndanalysis: AnalysisData;
  loading: boolean;
};
type category = 'CELL' | 'CABINET';
const Analysis: FC<AnalysisProps> = () => {
  const { styles } = useStyles();
  const [category, setCategory] = useState<String>('CELL');
  const [rangePickerValue, setRangePickerValue] = useState<RangePickerValue>(
    getTimeDistance('year'),
  );

  //读取统计数据
  const { loading, data } = useRequest(async () => {
    return queryAnalyseChartData({});
  });

  let pieData;
  if (category === 'CELL') {
    pieData = data?.row2Data.pieCellData;
  } else {
    pieData = data?.row2Data.pieCabinetData;
  }

  const selectDate = (type: TimeType) => {
    setRangePickerValue(getTimeDistance(type));
  };

  const handleRangePickerChange = (value: RangePickerValue) => {
    setRangePickerValue(value);
  };
  const isActive = (type: TimeType) => {
    if (!rangePickerValue) {
      return '';
    }
    const value = getTimeDistance(type);
    if (!value) {
      return '';
    }
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0] as dayjs.Dayjs, 'day') &&
      rangePickerValue[1].isSame(value[1] as dayjs.Dayjs, 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  //选择分类数据
  const handleChangeCategory = (e: RadioChangeEvent) => {
    setCategory(e.target.value);
  };

  return (
    <GridContent>
      <>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow loading={loading} row1Data={data?.row1Data || []} />
        </Suspense>

        <Row
          gutter={24}
          style={{
            marginTop: 24,
          }}
        >
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={<PageLoading />}>
              <ThrendCard
                rangePickerValue={rangePickerValue}
                row2Data={data?.row2Data || []}
                isActive={isActive}
                handleRangePickerChange={handleRangePickerChange}
                loading={loading}
                selectDate={selectDate}
              />
            </Suspense>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <ProportionPie
                category={category}
                loading={loading}
                pieData={pieData || []}
                handleChangeCategory={handleChangeCategory}
              />
            </Suspense>
          </Col>
        </Row>

        <Row
          gutter={24}
          style={{
            marginTop: 24,
          }}
        >
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <TopCell loading={loading} row3Data={data?.row3Data || []} />
            </Suspense>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={<PageLoading />}>
              <TopCard
                rangePickerValue={rangePickerValue}
                row3Data={data?.row3Data || []}
                isActive={isActive}
                handleRangePickerChange={handleRangePickerChange}
                loading={loading}
                selectDate={selectDate}
              />
            </Suspense>
          </Col>
        </Row>
      </>
    </GridContent>
  );
};
export default Analysis;
