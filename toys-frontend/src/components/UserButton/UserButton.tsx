import { UnstyledButton, Group, Avatar, Text } from '@mantine/core';
import classes from './UserButton.module.css';
import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';
import {UserRoleText} from "../../types/enum.ts";

export function UserButton() {
  const userContext = useContext(UserContext);
  return (
    <UnstyledButton className={classes.user}>
      <Group>
        <Avatar
          src={userContext.user.profile.profile_picture}
          radius="xl"
        />

        <div style={{ flex: 1 }}>
        <Text size="sm" fw={500}>
        <b>{userContext.user.profile.fullname}</b>
        </Text>

        <Text size="xs">
          {UserRoleText[userContext.user.profile.role]}
          </Text>
          <Text c="dimmed" size="xs">
            {userContext.user.profile.email}
          </Text>
        </div>

        
      </Group>
    </UnstyledButton>
  );
}