import { ProductItem } from '@/pages/Asset/data';
import { getProductDetail } from '@/pages/Asset/service';
import { Card, Table, Tabs } from 'antd';
import { message } from 'antd/lib';
import { useState } from 'react';
import type { Row3Data } from '../data';
import useStyles from '../style.style';
import ProductDetailModel from './ProductDetailModel';
const TopCell = ({ loading, row3Data }: { loading: boolean; row3Data: Row3Data }) => {
  const { styles } = useStyles();
  const columns1 = [
    {
      title: '编号',
      dataIndex: 'title',
      key: 'title',
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
                setPoductDetailCopy(data);
                setShowProductDetailCopy(true);
              }
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '换电(次)',
      dataIndex: 'exchanges',
      key: 'exchanges',
    },
    {
      title: '上线(天)',
      dataIndex: 'onlineDays',
      key: 'onlineDays',
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
    },
  ];

  const columns2 = [
    {
      title: '编号',
      dataIndex: 'title',
      key: 'title',
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
                setPoductDetailCopy(data);
                setShowProductDetailCopy(true);
              }
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '驻柜时长(小时)',
      dataIndex: 'cabinetTimes',
      key: 'cabinetTimes',
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
    },
  ];

  const rankingListData1: {
    id: string;
    title: string;
    time: string;
    note?: string;
    exchanges?: string;
    state?: string;
    onlineDays?: string;
  }[] = [];

  const rankingListData2: {
    id: string;
    title: string;
    time: string;
    cabinetTimes?: string;
    state?: string;
  }[] = [];

  if (row3Data.normalTopList) {
    row3Data.normalTopList.map((item) => {
      rankingListData1.push({
        id: `${item.id}`,
        title: `${item.title}`,
        time: `${item.time}`,
        exchanges: `${item.exchanges}`,
        state: `${item.state}`,
        onlineDays: `${item.onlineDays}`,
      });
    });
  }

  if (row3Data.cabinetTimesTopList) {
    row3Data.cabinetTimesTopList.map((item) => {
      rankingListData2.push({
        id: `${item.id}`,
        title: `${item.title}`,
        time: `${item.time}`,
        cabinetTimes: `${item.cabinetTimes}`,
        state: `${item.state}`,
      });
    });
  }

  const [productDetailCopy, setPoductDetailCopy] = useState<ProductItem>();
  const [done, setDone] = useState<boolean>(false);
  const [showProductDetailCopy, setShowProductDetailCopy] = useState<boolean>(false);

  const handleDone = () => {
    setShowProductDetailCopy(false);
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
                label: '电池低换电频率TOP500',
                children: (
                  <>
                    <Table<any>
                      rowKey={(record) => record.index}
                      size="small"
                      columns={columns1}
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
              // {
              //   key: 'key2',
              //   label: '在柜时长数据TOP100',
              //   children: (
              //     <>
              //       <Table<any>
              //         rowKey={(record) => record.index}
              //         size="small"
              //         columns={columns2}
              //         dataSource={rankingListData2}
              //         pagination={{
              //           style: {
              //             marginBottom: 0,
              //           },
              //           pageSize: 10,
              //         }}
              //       />
              //     </>
              //   ),
              // },
            ]}
          />
        </div>
      </Card>

      <ProductDetailModel
        done={done}
        visible={showProductDetailCopy}
        current={productDetailCopy || {}}
        onDone={handleDone}
      />
    </>
  );
};
export default TopCell;
