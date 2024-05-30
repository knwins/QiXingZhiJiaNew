import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '骑行之家',
  pwa: true,
  logo: '/logo.png',
  iconfontUrl: '//at.alicdn.com/t/font_1039637_btcrd5co4w.js',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
    header: {
      colorBgHeader: '#001529',
      colorHeaderTitle: '#fff',
      colorTextMenu:'#fff',
      colorTextMenuSelected:'#fff',
      colorTextMenuActive:'#fff',
      colorBgMenuItemHover:'#fff',
      colorBgMenuItemSelected:'#fff',
      colorTextRightActionsItem:'#fff',
    },
    sider: {
      colorMenuBackground: '#ffffff',
      colorMenuItemDivider: '#dddddd',
      colorTextMenuSelected: '#000000',
      colorBgMenuItemSelected: '#e6f7ff',
      colorBgMenuItemHover: '#e6f7ff',
      colorBgMenuItemActive: '#e6f7ff',
    },
  },
};

export default Settings;
