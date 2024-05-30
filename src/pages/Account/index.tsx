import { currentUser } from '@/services/ant-design-pro/api';
import { GridContent } from '@ant-design/pro-layout';
import { FormattedMessage, useRequest } from '@umijs/max';
import { Menu } from 'antd';
import React, { useLayoutEffect, useRef, useState } from 'react';
import BaseView from './base';
import SecurityView from './security';
import styles from './style.less';

const { Item } = Menu;

type SettingsStateKeys = 'base' | 'security' | 'binding' | 'notification';
type SettingsState = {
  mode: 'inline' | 'horizontal';
  selectKey: SettingsStateKeys;
};

const Settings: React.FC = () => {
  const { loading } = useRequest(() => {
    return currentUser;
  });

  const menuMap: Record<string, React.ReactNode> = {
    base: <FormattedMessage id="pages.account.base" />,
    security: <FormattedMessage id="pages.account.security" />,
  };

  const [initConfig, setInitConfig] = useState<SettingsState>({
    mode: 'inline',
    selectKey: 'base',
  });
  const dom = useRef<HTMLDivElement>();

  const resize = () => {
    requestAnimationFrame(() => {
      if (!dom.current) {
        return;
      }
      let mode: 'inline' | 'horizontal' = 'inline';
      const { offsetWidth } = dom.current;
      if (dom.current.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      setInitConfig({ ...initConfig, mode: mode as SettingsState['mode'] });
    });
  };

  useLayoutEffect(() => {
    if (dom.current) {
      window.addEventListener('resize', resize);
      resize();
    }
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [dom.current]);

  const getMenu = () => {
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };

  const renderChildren = () => {
    const { selectKey } = initConfig;
    switch (selectKey) {
      case 'base':
        return <BaseView />;
      case 'security':
        return <SecurityView />;
      default:
        return null;
    }
  };

  return (
    <>
      {loading ? null : (
        <GridContent>
          <div
            className={styles.main}
            ref={(ref) => {
              if (ref) {
                dom.current = ref;
              }
            }}
          >
            <div className={styles.leftMenu}>
              <Menu
                mode={initConfig.mode}
                selectedKeys={[initConfig.selectKey]}
                onClick={({ key }) => {
                  setInitConfig({
                    ...initConfig,
                    selectKey: key as SettingsStateKeys,
                  });
                }}
              >
                {getMenu()}
              </Menu>
            </div>
            <div className={styles.right}>
              <div className={styles.title}>{menuMap[initConfig.selectKey]}</div>
              {renderChildren()}
            </div>
          </div>
        </GridContent>
      )}
    </>
  );
};
export default Settings;
