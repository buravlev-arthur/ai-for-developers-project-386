import { Layout, Menu } from 'antd';
import { CalendarOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AppHeader from './AppHeader';

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
      <Layout>
        <Sider breakpoint="lg" collapsedWidth={0}>
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
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
