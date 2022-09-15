import axios, { AxiosError } from 'axios';
import Button from 'components/Button';
import DashboardLayout from 'components/DashboardLayout';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { pushKeepQuery } from 'utils/util';
import { NextPageWithLayout } from './_app';
import { useQueryClient } from '@tanstack/react-query';
import { useCookies } from 'react-cookie';
import Link from 'next/link';
import { PublicUser } from 'data/UserInfo';
import { useToken } from 'utils/hooks';

export interface LoginReply {
  token: string;
  user: PublicUser;
}

const Auth: NextPageWithLayout = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const queryClient = useQueryClient();
  const {token, setToken} = useToken();

  useEffect(() => {
    if (token) {
      alert('Logged in!');
      pushKeepQuery(router, '/');
    }
  }, [token]);

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setButtonLoading(true);

    // login using basic auth
    axios
      .get<LoginReply>('/users/login', {
        auth: {
          username,
          password,
        },
      })
      .then((response) => {
        // set the token cookie
        setToken(response.data.token);
      })
      .catch((error: Error | AxiosError) => {
        if (axios.isAxiosError(error)) {
          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            alert('Invalid username or password');
          }
        } else {
          alert(`Login failed: ${error.message}`);
        }
      })
      .finally(() => {
        setButtonLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
      <div className="flex flex-col items-stretch justify-center w-[500px] gap-12 px-12 py-24 bg-gray-900 rounded-3xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <img src="/logo.svg" alt="logo" className="w-40" />
          <h1 className="font-bold tracking-tight text-gray-300 text-larger">
            Welcome Back!
          </h1>
          <p>
            Connect to your Lodestone client.
            <br />
            Don&apos;t have Lodestone?{' '}
            <Link href="/get-started">
              <span className="text-green-accent hover:text-green hover:cursor-pointer">
                Get started here
              </span>
            </Link>
          </p>
        </div>
        <form noValidate autoComplete="off" onSubmit={onSubmit}>
          <div className="flex flex-col gap-y-6">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 text-gray-300 bg-gray-700 border border-gray-400 rounded-lg placeholder:text-gray-500"
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 text-gray-300 bg-gray-700 border border-gray-400 rounded-lg placeholder:text-gray-500"
            />
            <Button
              label="Login"
              type="submit"
              loading={buttonLoading}
              className="font-bold text-medium"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
