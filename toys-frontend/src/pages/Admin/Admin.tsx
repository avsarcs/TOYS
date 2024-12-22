import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Container,
  Group,
  TextInput,
  Title,
  Text,
  Stack,
  Badge,
  Space,
  Button,
  Modal,
  Select,
  Notification,
} from '@mantine/core';
import { UserContext } from '../../context/UserContext';
import {
  IconSearch,
  IconUser,
  IconStarFilled,
  IconBriefcase,
  IconPlus,
  IconTrash,
  IconEdit,
} from '@tabler/icons-react';
import { SimpleUserData } from '../../types/data';
import { UserRole } from '../../types/enum';

const ALL_USERS_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + '/admin/all-users');
const CHANGE_ROLE_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + '/admin/change-role');
const ADD_USER_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + '/admin/add-user');
const REMOVE_USER_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + '/admin/remove-user');

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const [users, setUsers] = useState<SimpleUserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<SimpleUserData | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Redirect non-admin users
  useEffect(() => {
    if (userContext.user.role !== UserRole.ADMIN) {
      navigate('/dashboard');
    }
  }, [userContext.user.role, navigate]);

  const fetchUsers = useCallback(async () => {
    const usersUrl = new URL(ALL_USERS_URL);
    usersUrl.searchParams.append('auth', await userContext.getAuthToken());
    usersUrl.searchParams.append('name', searchQuery);

    const res = await fetch(usersUrl, {
      method: 'GET',
    });

    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchUsers().catch(console.error);
  }, [fetchUsers]);

  const handleAddUser = async () => {
    const addUserUrl = new URL(ADD_USER_URL);
    addUserUrl.searchParams.append('auth', await userContext.getAuthToken());
    addUserUrl.searchParams.append('name', newUserName);
    addUserUrl.searchParams.append('role', newUserRole || '');

    const res = await fetch(addUserUrl, {
      method: 'POST',
    });

    if (res.ok) {
      setNotification('User added successfully');
      fetchUsers();
      setIsAddUserModalOpen(false);
    } else {
      setNotification('Failed to add user');
    }
  };

  const handleRemoveUser = async (id: string) => {
    const removeUserUrl = new URL(REMOVE_USER_URL);
    removeUserUrl.searchParams.append('auth', await userContext.getAuthToken());
    removeUserUrl.searchParams.append('id', id);

    const res = await fetch(removeUserUrl, {
      method: 'DELETE',
    });

    if (res.ok) {
      setNotification('User removed successfully');
      fetchUsers();
    } else {
      setNotification('Failed to remove user');
    }
  };

  const handleChangeRole = async () => {
    if (!selectedUser) return;

    const changeRoleUrl = new URL(CHANGE_ROLE_URL);
    changeRoleUrl.searchParams.append('auth', await userContext.getAuthToken());
    changeRoleUrl.searchParams.append('id', selectedUser.id);
    changeRoleUrl.searchParams.append('new_role', newUserRole || '');

    const res = await fetch(changeRoleUrl, {
      method: 'POST',
    });

    if (res.ok) {
      setNotification('User role changed successfully');
      fetchUsers();
      setIsChangeRoleModalOpen(false);
    } else {
      setNotification('Failed to change user role');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'TRAINEE':
        return <IconUser size={20} />;
      case 'GUIDE':
        return <IconStarFilled size={20} />;
      case 'ADVISOR':
        return <IconBriefcase size={20} />;
      default:
        return <IconUser size={20} />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'TRAINEE':
        return 'blue';
      case 'GUIDE':
        return 'green';
      case 'ADVISOR':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'TRAINEE':
        return 'Amatör Rehber';
      case 'GUIDE':
        return 'Rehber';
      case 'ADVISOR':
        return 'Danışman';
      default:
        return role;
    }
  };

  return (
    <Container size="xl" p="md">
      <Title order={1} className="text-blue-700 font-bold mb-6">
        TOYS Admin Paneli
      </Title>

      <Card shadow="sm" p="lg" radius="md" withBorder className="mb-6">
        <Stack gap="md">
          <TextInput
            placeholder="İsme göre ara..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={() => setIsAddUserModalOpen(true)}>
            <IconPlus size={16} style={{ marginRight: 8 }} />
            Kullanıcı Ekle
          </Button>
        </Stack>
      </Card>

      <Stack gap="md">
        {users.map((user) => (
          <Card
            key={user.id}
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <Group wrap="nowrap" justify="space-between">
              <Group wrap="nowrap" gap="md">
                <Box>{getRoleIcon(user.role)}</Box>
                <Stack gap="xs">
                  <Group gap="sm">
                    <Text fw={700}>{user.name}</Text>
                    <Badge color={getRoleColor(user.role)} variant="light">
                      {getRoleName(user.role)}
                    </Badge>
                  </Group>
                </Stack>
              </Group>

              <Group>
                <Button
                  onClick={() => {
                    setSelectedUser(user);
                    setIsChangeRoleModalOpen(true);
                  }}
                >
                  <IconEdit size={16} style={{ marginRight: 8 }} />
                  Rol Değiştir
                </Button>
                <Button color="red" onClick={() => handleRemoveUser(user.id)}>
                  <IconTrash size={16} style={{ marginRight: 8 }} />
                  Sil
                </Button>
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>
      <Space h="xl" />

      <Modal
        opened={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Kullanıcı Ekle"
      >
        <Stack>
          <TextInput
            placeholder="İsim"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
          <Select
            placeholder="Rol"
            data={Object.values(UserRole)}
            value={newUserRole}
            onChange={(value) => setNewUserRole(value as UserRole)}
          />
          <Button onClick={handleAddUser}>Ekle</Button>
        </Stack>
      </Modal>

      <Modal
        opened={isChangeRoleModalOpen}
        onClose={() => setIsChangeRoleModalOpen(false)}
        title="Rol Değiştir"
      >
        <Stack>
          <Select
            placeholder="Yeni Rol"
            data={Object.values(UserRole)}
            value={newUserRole}
            onChange={(value) => setNewUserRole(value as UserRole)}
          />
          <Button onClick={handleChangeRole}>Değiştir</Button>
        </Stack>
      </Modal>

      {notification && (
        <Notification onClose={() => setNotification(null)}>
          {notification}
        </Notification>
      )}
    </Container>
  );
};

export default Admin;
