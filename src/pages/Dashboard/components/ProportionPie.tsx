import { Pie } from '@ant-design/plots';
import { Card, Radio, Typography } from 'antd';
import type { RadioChangeEvent } from 'antd/es/radio';
import numeral from 'numeral';
import useStyles from '../style.style';
import { VisitDataType } from '../data';
const { Text } = Typography;
const ProportionPie = ({
  category,
  loading,
  pieData,
  handleChangeCategory,
}: {
  loading: boolean;
  category: 'CELL' | 'CABINET';
  pieData: VisitDataType[];
  handleChangeCategory?: (e: RadioChangeEvent) => void;
}) => {
  const { styles } = useStyles();
  return (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title="电池状态分布图"
      style={{
        height: '100%',
      }}
      extra={
        <div className={styles.salesCardExtra}>
          <div className={styles.salesTypeRadio}>
            <Radio.Group value={category} onChange={handleChangeCategory}>
              <Radio.Button value="CELL">电池</Radio.Button>
              <Radio.Button value="CABINET">电柜</Radio.Button>
            </Radio.Group>
          </div>
        </div>
      }
    >
      <div>
        <Pie
          height={340}
          radius={0.8}
          innerRadius={0.5}
          angleField="y"
          colorField="x"
          data={pieData as any}
          legend={{
            color: {
              position: 'left',
            }
          }}
          label={{
            position: 'outside',
            text: (item: { x: number; y: number }) => {
              return `${item.x}: ${numeral(item.y).format('0,0')}`;
            },
            transform: [{ type: 'overlapDodgeY' }],
          }}
        />
      </div>
    </Card>
  );
};
export default ProportionPie;
