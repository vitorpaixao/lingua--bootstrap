import { useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { ConfigProvider, theme, Tooltip } from 'antd'
import { ProLayout, PageContainer } from '@ant-design/pro-components'
import {
  HomeOutlined,
  TeamOutlined,
  SettingOutlined,
  UserOutlined,
  SunOutlined,
  MoonOutlined,
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
        avatarProps={{
          icon: <UserOutlined />,
          title: 'User',
          size: 'small',
        }}
        actionsRender={() => [
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
          </Tooltip>,
        ]}
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
    </ConfigProvider>
  )
}
