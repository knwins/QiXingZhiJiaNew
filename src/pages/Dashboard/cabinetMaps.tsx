import type { LarkMapProps, LayerPopupProps, PointLayerProps } from '@antv/larkmap';
import { CustomControl, LarkMap, LayerPopup, LegendCategories, PointLayer, ScaleControl, ZoomControl } from '@antv/larkmap';
import { FC, useEffect, useState } from 'react';

const Map: FC = () => {

  const items: LayerPopupProps['items'] = [
    {
      layer: 'PolygonLayer',
      fields: [
        {
          field: 'number',
          formatField: '编号',
        },
        {
          field: 'fullAddress',
          formatField: '位置',
        },
      ],
    },
  ];





  const legendItems = [
    { color: '#0796D3', label: '正常', value: 'Natural' },
    { color: 'rgba(249,101,52,.8)', label: '异常', value: 'Cultural' },
  ];

  /** 地图属性配置 */
  const larkMapConfig: LarkMapProps = {
    mapType: 'Gaode',
    mapOptions: {
      style: 'normal',
      pitch: 0,
      token: 'e793bce16867fde3ad226dc77ed40a24',
      center:[113.093255,22.615073],
    },
    logoPosition: 'bottomleft',
  };





  const myPointLayerOptions: Omit<PointLayerProps, 'source'> = {
    id: 'myPointLayer',
    autoFit: true,
    shape: 'circle',
    size: {
      field: 'point_count',
      value: [20, 25, 30, 35, 40, 45, 50],
      scale: {
        type: 'quantile',
      },
    },
    // color: '#0796D3',
    color: {
      // field: 'color',
      field: 'color',
      value: ({ color }) => {
        if (color) {
          return color;
        }
        return "#0796D3";
      },
    },

    state: {
      active: {
        color: '#33a02c',
      },
    },
    style: {
      opacity: 0.8,
      strokeWidth: 1,
      stroke: '#fff',
    },
  };


  const myPointLayerTextOptions: Omit<PointLayerProps, 'source'> = {

    autoFit: false,
    shape: {
      field: 'point_count',
      value: 'text',
    },
    size: 14,
    color: '#fff',
    style: {
      opacity: 1,
      strokeWidth: 0,
      stroke: '#fff',
    },
    blend: 'normal'
  };

  const [source, setSource] = useState<PointLayerProps['source']>({
    data: [],
    parser: { type: 'geojson' },
    cluster: true,
  });



  const token = localStorage.getItem('token');
  // 创建一个Headers对象
  const headers = new Headers({
    'Content-Type': 'application/json',
    'token': `${token}`,  // 替换为你的认证token
  });

  useEffect(() => {
    fetch('https://qixingzhijia.szqws.com:8081/api/manage/analyse/cabinet_maps', {
      method: 'POST',
      headers: headers, // 添加的请求头
    })
      .then((response) => {
        // 检查响应是否成功，如果不成功，则会抛出错误
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // 解析JSON数据
      })
      .then((result: any) => {
        const data = result.data;
        setSource((prevState) => ({ ...prevState, data }));
      });
  }, []);

  return (
    <LarkMap {...larkMapConfig} style={{ height: '80vh' }}>
      <PointLayer {...myPointLayerOptions} source={source} id="PolygonLayer" />
      <PointLayer {...myPointLayerTextOptions} source={source} />
      <CustomControl position="bottomright">
        <LegendCategories
          style={{ background: '#fff', padding: 8 }}
          colors={legendItems.map((item) => item.color)}
          labels={legendItems.map((item) => item.label)}
        />
      </CustomControl>
      <LayerPopup
        closeButton={false}
        closeOnClick={false}
        anchor="bottom-left"
        trigger="click"
        items={items}
      />
    </LarkMap>
  );
};

export default Map;
