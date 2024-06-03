/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/',
    redirect: '/dashboard/analysis',
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        path: '/user/login',
        layout: false,
        name: 'login',
        component: './User/login',
      },
      {
        component: '404',
        path: '/user/*',
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    routes: [
      {
        path: '/dashboard',
        redirect: '/dashboard/analysis',
      },
      {
        name: 'analysis',
        icon: 'smile',
        path: '/dashboard/analysis',
        component: './Dashboard/analysis',
      },

      {
        name: 'cellMaps',
        icon: 'smile',
        path: '/dashboard/cellMaps',
        component: './Dashboard/cellMaps',
      },

      {
        name: 'cabinetMaps',
        icon: 'smile',
        path: '/dashboard/cabinetMaps',
        component: './Dashboard/cabinetMaps',
      },
    ],
  },

  {
    path: '/asset',
    name: 'asset',
    icon: 'user',
    routes: [
      {
        path: '/asset',
        redirect: '/asset/cell',
      },
      {
        name: 'cell',
        icon: 'smile',
        path: '/asset/cell',
        component: './Asset/cell',
      },
      {
        name: 'cabinet',
        icon: 'smile',
        path: '/asset/cabinet',
        component: './Asset/cabinet',
      },

      {
        name: 'pile',
        icon: 'smile',
        path: '/asset/pile',
        component: './Asset/pile',
      },

      {
        name: 'electric',
        icon: 'smile',
        path: '/asset/electric',
        component: './Asset/electric',
      },

      {
        name: 'stage',
        icon: 'smile',
        path: '/asset/stage',
        component: './Asset/stage',
      },

      {
        name: 'other',
        icon: 'smile',
        path: '/asset/other',
        component: './Asset/other',
      },
    ],
  },

  {
    path: '/qixing',
    name: 'qixing',
    icon: 'user',
    routes: [
      {
        path: '/qixing/iasset',
        redirect: '/iasset/stockCell',
      },

      {
        name: 'stockCell',
        icon: 'smile',
        path: '/qixing/iasset/stockCell',
        component: './Asset/stockCell',
      },
      {
        name: 'stockCabinet',
        icon: 'smile',
        path: '/qixing/iasset/stockCabinet',
        component: './Asset/stockCabinet',
      },


      {
        name: 'storeAnalyse',
        icon: 'smile',
        path: '/qixing/ioperation/storeAnalyse',
        component: './Operation/storeAnalyse',
      },


      {
        name: 'stockOperation',
        icon: 'smile',
        path: '/qixing/ioperation/stockOperation',
        component: './Operation/stockOperation',
      },
      {
        name: 'storeGroup',
        icon: 'smile',
        path: '/qixing/ioperation/storeGroup',
        component: './Operation/qxStoreGroup',
      },

      {
        name: 'store',
        icon: 'smile',
        path: '/qixing/ioperation/store',
        component: './Operation/qxStore',
      },

      

    ],
  },


  {
    path: '/operation',
    name: 'operation',
    icon: 'user',
    routes: [
      {
        path: '/operation',
        redirect: '/operation/store',
      },

      {
        name: 'store',
        icon: 'smile',
        path: '/operation/store',
        component: './Operation/store',
      },
      
      {
        name: 'storeGroup',
        icon: 'smile',
        path: '/operation/storeGroup',
        component: './Operation/storeGroup',
      },

    
      {
        name: 'check',
        icon: 'smile',
        path: '/operation/check',
        component: './Operation/check',
      },
      {
        name: 'lease',
        icon: 'smile',
        path: '/operation/lease',
        component: './Operation/lease',
      },
      {
        name: 'business',
        icon: 'smile',
        path: '/operation/business',
        component: './Operation/business',
      },

      {
        name: 'partner',
        icon: 'smile',
        path: '/operation/partner',
        component: './Operation/partner',
      },

      {
        name: 'cabinetWarninfo',
        icon: 'smile',
        path: '/operation/cabinetWarninfo',
        component: './Operation/cabinetWarninfo',
      },

      {
        name: 'article',
        path: '/operation/article',
        component: './Operation/article',
      },

      {
        name: 'article.type',
        path: '/operation/articleType',
        component: './Operation/articleType',
      },

      {
        name: 'celltWarninfo',
        icon: 'smile',
        path: '/operation/cellWarninfo',
        component: './Operation/cellWarninfo',
      },
    ],
  },
  {
    path: '/setting',
    name: 'setting',
    icon: 'setting',
    routes: [
      {
        path: '/setting',
        redirect: '/setting/user',
      },
      {
        name: 'user',
        icon: 'smile',
        path: '/setting/user',
        component: './Setting/user',
      },
      {
        name: 'role',
        icon: 'smile',
        path: '/setting/role',
        component: './Setting/role',
      },
      {
        name: 'config',
        icon: 'smile',
        path: '/setting/config',
        component: './Setting/config',
      },
      {
        name: 'privilege',
        icon: 'smile',
        path: '/setting/privilege',
        component: './Setting/privilege',
      },
      {
        name: 'task',
        icon: 'smile',
        path: '/setting/task',
        component: './Setting/task',
      },
      {
        name: 'fnjuser',
        icon: 'smile',
        path: '/setting/fnjuser',
        component: './Setting/fnjuser',
      },
      {
        name: 'option',
        icon: 'smile',
        path: '/setting/option',
        component: './Setting/option',
      },
    ],
  },

  {
    name: 'account',
    icon: 'user',
    path: '/account',
    routes: [
      {
        path: '/account',
        redirect: '/account/settings',
      },
      {
        name: 'settings',
        icon: 'smile',
        path: '/account/settings',
        component: './Account/index',
      },
    ],
  },

  {
    component: '404',
    path: '/*',
  },
];
