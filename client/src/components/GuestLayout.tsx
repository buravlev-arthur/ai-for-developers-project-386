import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import AppHeader from './AppHeader';
import PageContent from './PageContent';

const { Content } = Layout;

export default function GuestLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <Layout
      style={{
        minHeight: '100vh',
        ...(isHome && {
          background: 'linear-gradient(135deg, #e8f4fd 0%, #f0e6ff 50%, #e6f7ff 100%)',
        }),
      }}
    >
      <AppHeader />
      <Content style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '80vw' }}>
          <PageContent>
            <Outlet />
          </PageContent>
        </div>
      </Content>
    </Layout>
  );
}
