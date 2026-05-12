import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Popconfirm, Space, Tag, Typography } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { getUsers, deleteUser } from '../data/mockUsers'
import type { User } from '../data/mockUsers'

export default function UserListPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>(getUsers)

  const handleDelete = (id: string) => {
    deleteUser(id)
    setUsers(getUsers())
  }

  const columns: ProColumns<User>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_, record) => (
        <Typography.Link onClick={() => navigate(`/users/${record.id}`)}>
          {record.name}
        </Typography.Link>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      valueEnum: {
        Admin: { text: 'Admin' },
        Editor: { text: 'Editor' },
        Viewer: { text: 'Viewer' },
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_, record) => (
        <Tag color={record.status === 'active' ? 'green' : 'red'}>
          {record.status}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <EditOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/users/${record.id}`)}
          />
          <Popconfirm
            title="Delete user?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <DeleteOutlined style={{ cursor: 'pointer', color: '#ff4d4f' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <ProTable<User>
      rowKey="id"
      columns={columns}
      dataSource={users}
      search={false}
      toolBarRender={() => [
        <Button
          key="add"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/users/new')}
        >
          Add User
        </Button>,
      ]}
      pagination={{ pageSize: 10 }}
      headerTitle="Users"
    />
  )
}
