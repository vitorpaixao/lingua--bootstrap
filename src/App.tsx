import { useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { ConfigProvider, theme, Tooltip, Avatar, Drawer, Space } from 'antd'
import { ProLayout, PageContainer } from '@ant-design/pro-components'
import {
  HomeOutlined,
  TeamOutlined,
  SettingOutlined,
  UserOutlined,
  SunOutlined,
  MoonOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import UserListPage from './pages/UserListPage'
import UserDetailPage from './pages/UserDetailPage'

const routeConfig = {
  path: '/',
  routes: [
    { path: '/', name: 'Dashboard', icon: <HomeOutlined /> },
    { path: '/users', name: 'Users', icon: <TeamOutlined /> },
    { path: '/settings', name: 'Settings', icon: <SettingOutlined /> },
  ],
}

export default function App() {
  const [isDark, setIsDark] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <ProLayout
        route={routeConfig}
        title="Lingua"
        logo={<img src="/vite.svg" style={{ height: 28 }} alt="logo" />}
        layout="side"
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ minHeight: '100vh' }}
        menuFooterRender={() => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
            <Space>
              <Avatar size="small" icon={<UserOutlined />} />
              {!collapsed && <span>User</span>}
            </Space>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
              <Space>
                <Tooltip title="Help">
                  <QuestionCircleOutlined
                    style={{ cursor: 'pointer', fontSize: 16 }}
                    onClick={() => setHelpOpen(true)}
                  />
                </Tooltip>
              </Space>
              <Space style={{ marginLeft: 16 }}>
                <Tooltip
                  key="theme"
                  title={isDark ? 'Switch to light' : 'Switch to dark'}
                >
                  <span
                    onClick={() => setIsDark(!isDark)}
                    style={{ cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center' }}
                  >
                    {isDark ? <SunOutlined /> : <MoonOutlined />}
                  </span>
                </Tooltip>
              </Space>
            </div>

          </div>
        )}
        menuItemRender={(item, dom) => (
          <Link to={item.path ?? '/'}>{dom}</Link>
        )}
        onMenuHeaderClick={() => navigate('/')}
      >
        <PageContainer breadcrumbRender={false}>
          <Routes>
            <Route path="/" element={<div />} />
            <Route path="/users" element={<UserListPage />} />
            <Route path="/users/new" element={<UserDetailPage />} />
            <Route path="/users/:id" element={<UserDetailPage />} />
            <Route path="/settings" element={<div />} />
          </Routes>
        </PageContainer>
      </ProLayout>

      <Drawer
        title="Help"
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        width={400}
      />
    </ConfigProvider>
  )
}
