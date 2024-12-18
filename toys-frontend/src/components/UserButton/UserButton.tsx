import { UnstyledButton, Group, Avatar, Text, rem } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import classes from './UserButton.module.css';
import { UserContext } from '../../context/UserContext';
import React, { useContext, useState } from 'react';

export function UserButton() {
  const { user } = useContext(UserContext);
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
          {userContext.user.profile.role}
          </Text>
          <Text c="dimmed" size="xs">
          {/*{userContext.user.profile.email}*/}
          email
          </Text>
          
        </div>

        <IconChevronRight style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
      </Group>
    </UnstyledButton>
  );
}