import { Layout, Menu, Avatar, Typography } from 'antd';
import { CalendarOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getOwner } from '../api/endpoints';
import type { Owner } from '../api/types';
import AppHeader from './AppHeader';
import PageContent from './PageContent';

const { Content, Sider } = Layout;

export default function OwnerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [ownerLoading, setOwnerLoading] = useState(true);

  useEffect(() => {
    getOwner()
      .then(setOwner)
      .catch(() => setOwner(null))
      .finally(() => setOwnerLoading(false));
  }, []);

  const menuItems = [
    {
      key: '/owner',
      icon: <CalendarOutlined />,
      label: 'Календарь',
      style: { margin: 0, borderRadius: 0, width: '100%' },
    },
    {
      key: '/owner/event-types',
      icon: <UnorderedListOutlined />,
      label: 'Типы событий',
      style: { margin: 0, borderRadius: 0, width: '100%' },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <div style={{ width: '80vw', margin: '0 auto' }}>
        <PageContent>
          <Layout style={{ flex: 1, columnGap: 16, height: '100%' }}>
            <Sider
              breakpoint="lg"
              collapsedWidth={0}
              style={{ borderRadius: 8, overflow: 'hidden', height: '100%' }}
            >
              <div
                style={{
                  padding: '16px 16px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <Avatar
                  size={40}
                  icon={<UserOutlined style={{ color: '#fff' }} />}
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px solid #fff',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
                <Typography.Text
                  strong
                  style={{
                    color: '#fff',
                    fontSize: 14,
                    lineHeight: 1.4,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {ownerLoading ? 'Загрузка...' : (owner?.username ?? 'Владелец')}
                </Typography.Text>
              </div>
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={({ key }) => navigate(key)}
                style={{ padding: 0 }}
              />
            </Sider>
            <Content style={{ display: 'flex', flexDirection: 'column' }}>
              <Outlet />
            </Content>
          </Layout>
        </PageContent>
      </div>
    </Layout>
  );
}
