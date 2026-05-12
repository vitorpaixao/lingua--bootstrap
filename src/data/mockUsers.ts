export interface User {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Editor' | 'Viewer'
  status: 'active' | 'inactive'
  phone: string
  createdAt: string
}

let store: User[] = [
  { id: '1', name: 'Alice Ferreira', email: 'alice@example.com', role: 'Admin', status: 'active', phone: '+55 11 99999-0001', createdAt: '2024-01-15' },
  { id: '2', name: 'Bruno Carvalho', email: 'bruno@example.com', role: 'Editor', status: 'active', phone: '+55 11 99999-0002', createdAt: '2024-02-03' },
  { id: '3', name: 'Carla Santos', email: 'carla@example.com', role: 'Viewer', status: 'inactive', phone: '+55 21 99999-0003', createdAt: '2024-02-18' },
  { id: '4', name: 'Diego Martins', email: 'diego@example.com', role: 'Editor', status: 'active', phone: '+55 31 99999-0004', createdAt: '2024-03-07' },
  { id: '5', name: 'Elena Rodrigues', email: 'elena@example.com', role: 'Viewer', status: 'active', phone: '+55 41 99999-0005', createdAt: '2024-03-22' },
  { id: '6', name: 'Felipe Lima', email: 'felipe@example.com', role: 'Admin', status: 'inactive', phone: '+55 51 99999-0006', createdAt: '2024-04-10' },
  { id: '7', name: 'Gabriela Costa', email: 'gabriela@example.com', role: 'Editor', status: 'active', phone: '+55 61 99999-0007', createdAt: '2024-04-28' },
  { id: '8', name: 'Hugo Nascimento', email: 'hugo@example.com', role: 'Viewer', status: 'active', phone: '+55 71 99999-0008', createdAt: '2024-05-14' },
  { id: '9', name: 'Isabela Oliveira', email: 'isabela@example.com', role: 'Editor', status: 'inactive', phone: '+55 81 99999-0009', createdAt: '2024-06-01' },
  { id: '10', name: 'João Pereira', email: 'joao@example.com', role: 'Viewer', status: 'active', phone: '+55 91 99999-0010', createdAt: '2024-06-19' },
]

export const getUsers = (): User[] => [...store]

export const getUserById = (id: string): User | undefined =>
  store.find((u) => u.id === id)

export const saveUser = (user: User): void => {
  const idx = store.findIndex((u) => u.id === user.id)
  if (idx >= 0) {
    store[idx] = user
  } else {
    store = [...store, user]
  }
}

export const deleteUser = (id: string): void => {
  store = store.filter((u) => u.id !== id)
}

export const nextId = (): string =>
  String(Math.max(...store.map((u) => Number(u.id)), 0) + 1)
