import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import {
  ProForm,
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-components'
import { getUserById, saveUser, nextId } from '../data/mockUsers'

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === undefined
  const user = isNew ? undefined : getUserById(id)

  return (
    <div style={{ maxWidth: 640 }}>
      <Button
        icon={<ArrowLeftOutlined />}
        type="link"
        style={{ paddingLeft: 0, marginBottom: 16 }}
        onClick={() => navigate('/users')}
      >
        Back to Users
      </Button>

      <ProForm
        initialValues={user}
        onFinish={async (values) => {
          saveUser({
            name: values.name,
            email: values.email,
            phone: values.phone ?? '',
            role: values.role,
            status: values.status,
            id: isNew ? nextId() : id!,
            createdAt: user?.createdAt ?? new Date().toISOString().slice(0, 10),
          })
          navigate('/users')
        }}
        submitter={{
          render: (_, dom) => (
            <div style={{ display: 'flex', gap: 8 }}>
              {dom}
              <Button onClick={() => navigate('/users')}>Cancel</Button>
            </div>
          ),
        }}
      >
        <ProFormText
          name="name"
          label="Full Name"
          placeholder="Full name"
          rules={[{ required: true, message: 'Name is required' }]}
        />
        <ProFormText
          name="email"
          label="Email"
          placeholder="user@example.com"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email' },
          ]}
        />
        <ProFormText
          name="phone"
          label="Phone"
          placeholder="+55 11 99999-0000"
        />
        <ProFormSelect
          name="role"
          label="Role"
          options={[
            { label: 'Admin', value: 'Admin' },
            { label: 'Editor', value: 'Editor' },
            { label: 'Viewer', value: 'Viewer' },
          ]}
          rules={[{ required: true, message: 'Role is required' }]}
        />
        <ProFormSelect
          name="status"
          label="Status"
          options={[
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ]}
          rules={[{ required: true, message: 'Status is required' }]}
        />
      </ProForm>
    </div>
  )
}
