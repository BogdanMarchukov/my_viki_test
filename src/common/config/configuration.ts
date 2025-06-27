import { Config, RootConfigKeys } from './type';

export default (): Config => ({
  [RootConfigKeys.USER_PASSWORD]: {
    saltLength: 32,
    hashLength: 32,
    hashSecret: 'secret',
    iterations: 2,
    digest: 'sha512',
  },
});
