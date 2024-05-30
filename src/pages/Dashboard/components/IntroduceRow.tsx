import { InfoCircleOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import { Col, Row, Tooltip } from 'antd';
import numeral from 'numeral';
import type { Row1Data } from '../data';
import useStyles from '../style.style';
import { ChartCard } from './Charts';
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};
const IntroduceRow = ({ loading, row1Data }: { loading: boolean; row1Data: Row1Data }) => {
  const { styles } = useStyles();
  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="累计电池总量"
          action={
            <Tooltip title="营运商所有类型电池总量">
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={numeral(row1Data.cellTotal).format('0,0')}
          footer={
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            ></div>
          }
          contentHeight={76}
        >
          <Line
            xField="x"
            yField="y"
            height={76}
            margin={32}
            marginLeft={10}
            paddingBottom={-20}
            scale={{
              x: { paddingInner: 0.8 },
            }}
            tooltip={{
              name: '累计电池总量',
              channel: 'y',
            }}
            axis={false}
            data={row1Data.cellTotalList}
          />
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="充电柜总量"
          action={
            <Tooltip title="运营商拥有充电柜总量">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={numeral(row1Data.cabinetTotal).format('0,0')}
          footer={
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            ></div>
          }
          contentHeight={76}
        >
          <Line
            xField="x"
            yField="y"
            height={76}
            margin={32}
            marginLeft={10}
            paddingBottom={-20}
            scale={{
              x: { paddingInner: 0.8 },
            }}
            tooltip={{
              name: '累计电柜总量',
              channel: 'y',
            }}
            axis={false}
            data={row1Data.cabinetTotalList}
          />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="累计换电次数"
          action={
            <Tooltip title="正常状态电池累计换电次数">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={numeral(row1Data.exchangeTotal).format('0,0')}
          footer={
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            ></div>
          }
          contentHeight={76}
        >
          <Line
            xField="x"
            yField="y"
            height={76}
            margin={32}
            marginLeft={10}
            paddingBottom={-20}
            scale={{
              x: { paddingInner: 0.8 },
            }}
            tooltip={{
              name: '累计换电总量',
              channel: 'y',
            }}
            axis={false}
            data={row1Data.exchangeTotalList}
          />
        </ChartCard>
      </Col>
    </Row>
  );
};
export default IntroduceRow;
