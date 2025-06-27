export enum RootConfigKeys {
  USER_PASSWORD = 'userPassword',
}
export type UserPassword = {
  saltLength: number;
  hashLength: number;
  hashSecret: string;
  iterations: number;
  digest: string;
};

export interface Config {
  [RootConfigKeys.USER_PASSWORD]: UserPassword;
}
