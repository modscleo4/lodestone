import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useContext } from 'react';
import { useCookies } from 'react-cookie';
import { LodestoneContext } from './LodestoneContext';

export type Permission =
  | 'CanViewInstance'
  | 'CanStartInstance'
  | 'CanStopInstance'
  | 'CanAccessConsole'
  | 'CanChangeSetting'
  | 'CanManageResource'
  | 'CanAccessMacro'
  | 'CanCreateInstance'
  | 'CanDeleteInstance'
  | 'CanManageUser'
  | 'CanManagePermission';

export interface PublicUser {
  uid: string;
  username: string;
  is_owner: boolean;
  is_admin: boolean;
  permissions: Record<Permission, Array<string>>;
}

export const useUserInfo = () => {
  return useQuery<PublicUser, AxiosError>(['user', 'info'], () => {
    return axios
      .get<PublicUser>(`/users/info`)
      .then((response) => response.data);
  }, {
    enabled: useContext(LodestoneContext).isReady,
  });
};
