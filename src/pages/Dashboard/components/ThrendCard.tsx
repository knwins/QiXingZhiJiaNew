import { Line } from '@ant-design/plots';
import { Card, Col, DatePicker, Row, Tabs } from 'antd';
import type { Row2Data } from '../data';
import useStyles from '../style.style';
export type TimeType = 'today' | 'week' | 'month' | 'year';
const { RangePicker } = DatePicker;
const SalesCard = ({
  row2Data,
  loading,
}: {
  row2Data: Row2Data;
  loading: boolean;
}) => {
  const { styles } = useStyles();
  return (
    <Card
      loading={loading}
      bordered={false}
      style={{
        padding: 0,
      }}
    >
      <div className={styles.salesCard}>
        <Tabs
          size="large"
          tabBarStyle={{
            marginBottom: 24,
          }}
          items={[
            {
              key: 'sales',
              label: '电池数据异常趋势',
              children: (
                <Row>
                  <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Line
                        height={300}
                        data={row2Data.abnormalCellTotalList}
                        xField="x"
                        yField="y"
                        paddingBottom={12}
                        axis={{
                          x: {
                            title: false,
                          },
                          y: {
                            title: false,
                            gridLineDash: null,
                            gridStroke: '#ccc',
                          },
                        }}
                        scale={{
                          x: { paddingInner: 0.4 },
                        }}
                        tooltip={{
                          name: '异常数量',
                          channel: 'y',
                        }}
                        point={{ shapeField: 'square', sizeField: 4 }}
                      />
                    </div>
                  </Col>
                  
                </Row>
              ),
            },
            {
              key: 'views',
              label: '电柜数据异常趋势',
              children: (
                <Row>
                  <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Line
                        height={300}
                        data={row2Data.abnormalCabinetTotalList}
                        xField="x"
                        yField="y"
                        point={{ shapeField: 'square', sizeField: 4 }}
                        paddingBottom={12}
                        axis={{
                          x: {
                            title: false,
                          },
                          y: {
                            title: false,
                          },
                        }}
                        scale={{
                          x: { paddingInner: 0.4 },
                        }}
                        tooltip={{
                          name: '电柜数量',
                          channel: 'y',
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </div>
    </Card>
  );
};
export default SalesCard;
