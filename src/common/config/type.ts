export enum RootConfigKeys {
  USER_PASSWORD = 'userPassword',
  AUTH_CONFIG = 'authConfig',
}
export type UserPassword = {
  saltLength: number;
  hashLength: number;
  hashSecret: string;
  iterations: number;
  digest: string;
};

export type AuthConfig = {
  access: {
    expiresIn: string;
  };
  refresh: {
    expiresIn: string;
    maxAge: number;
  };
};

export interface Config {
  [RootConfigKeys.USER_PASSWORD]: UserPassword;
  [RootConfigKeys.AUTH_CONFIG]: AuthConfig;
}
