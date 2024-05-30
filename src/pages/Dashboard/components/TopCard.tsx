import { ProductItem } from '@/pages/Asset/data';
import { getProductDetail } from '@/pages/Asset/service';
import { Card, Table, Tabs } from 'antd';
import { message } from 'antd/lib';
import { useState } from 'react';
import { Row3Data } from '../data';
import useStyles from '../style.style';
import ProductDetailModel from './ProductDetailModel';

const TopCard = ({ row3Data, loading }: { row3Data: Row3Data; loading: boolean }) => {
  const columns = [
    {
      title: '编号',
      dataIndex: 'title',
      key: 'title',
      width: '40%',
      ellipsis: true,
      render: (dom, record) => {
        return (
          <a
            onClick={async () => {
              const loadingHidde = message.loading('数据加载中..');
              loadingHidde();
              const { success, data } = await getProductDetail({
                id: record.id,
              });
              if (success) {
                setPoductDetail(data);
                setShowProductDetail(true);
              }
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '异常(天)',
      dataIndex: 'days',
      key: 'days',
      width: '15%',
    },
    {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
      width: '45%',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      hidden: true,
    },
  ];

  const rankingListData1: {
    id: string;
    title: string;
    time: string;
    note?: string;
    days?: string;
  }[] = [];

  const rankingListData2: {
    id: string;
    title: string;
    time: string;
    note?: string;
    days?: string;
  }[] = [];

  if (row3Data.abnormalCellTopList) {
    row3Data.abnormalCellTopList.map((item) => {
      rankingListData1.push({
        id: `${item.id}`,
        title: `${item.title}`,
        time: `${item.time}`,
        note: `${item.note}`,
        days: `${item.days}`,
      });
    });
  }

  if (row3Data.abnormalCabinetTopList) {
    row3Data.abnormalCabinetTopList.map((item) => {
      rankingListData2.push({
        id: `${item.id}`,
        title: `${item.title}`,
        time: `${item.time}`,
        note: `${item.note}`,
        days: `${item.days}`,
      });
    });
  }
  const { styles } = useStyles();

  const [productDetail, setPoductDetail] = useState<ProductItem>();
  const [done, setDone] = useState<boolean>(false);
  const [showProductDetail, setShowProductDetail] = useState<boolean>(false);

  const handleDone = () => {
    setShowProductDetail(false);
  };

  return (
    <>
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
                key: 'key1',
                label: '电池异常数据TOP500',
                children: (
                  <>
                    <Table<any>
                      rowKey={(record) => record.index}
                      size="small"
                      columns={columns}
                      dataSource={rankingListData1}
                      pagination={{
                        style: {
                          marginBottom: 0,
                        },
                        pageSize: 10,
                      }}
                    />
                  </>
                ),
              },
              {
                key: 'key2',
                label: '电柜异常数据TOP500',
                children: (
                  <>
                    <Table<any>
                      rowKey={(record) => record.index}
                      size="small"
                      columns={columns}
                      dataSource={rankingListData2}
                      pagination={{
                        style: {
                          marginBottom: 0,
                        },
                        pageSize: 10,
                      }}
                    />
                  </>
                ),
              },
            ]}
          />
        </div>
      </Card>
      <ProductDetailModel
        done={done}
        visible={showProductDetail}
        current={productDetail || {}}
        onDone={handleDone}
      />
    </>
  );
};
export default TopCard;
