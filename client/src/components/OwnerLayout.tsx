import { Layout, Menu } from 'antd';
import { CalendarOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AppHeader from './AppHeader';
import PageContent from './PageContent';

const { Content, Sider } = Layout;

export default function OwnerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/owner',
      icon: <CalendarOutlined />,
      label: 'Календарь',
    },
    {
      key: '/owner/event-types',
      icon: <UnorderedListOutlined />,
      label: 'Типы событий',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <div style={{ width: '80vw', margin: '0 auto' }}>
        <PageContent>
          <Layout style={{ flex: 1, columnGap: 16 }}>
            <Sider
              breakpoint="lg"
              collapsedWidth={0}
              style={{ borderRadius: 8, overflow: 'hidden' }}
            >
              <div style={{ color: '#fff', padding: 16, textAlign: 'center', fontWeight: 'bold' }}>
                Календарь событий
              </div>
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={({ key }) => navigate(key)}
              />
            </Sider>
            <Content>
              <Outlet />
            </Content>
          </Layout>
        </PageContent>
      </div>
    </Layout>
  );
}
