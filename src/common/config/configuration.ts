import { Config, RootConfigKeys } from './type';

export default (): Config => ({
  [RootConfigKeys.USER_PASSWORD]: {
    saltLength: 32,
    hashLength: 32,
    hashSecret: 'secret',
    iterations: 2,
    digest: 'sha512',
  },
  [RootConfigKeys.AUTH_CONFIG]: {
    access: {
      expiresIn: '1h',
    },
    refresh: {
      expiresIn: '7d',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  },
  [RootConfigKeys.JWT_SECRET]: 'secret',
});
