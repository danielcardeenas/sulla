export interface CreateConfig {
  headless?: boolean;
  devtools?: boolean;
  useChrome?: boolean;
  debug?: boolean;
  browserArgs?: string[];
  logQR?: boolean;
}

export const defaultOptions: CreateConfig = {
  headless: true,
  devtools: false,
  useChrome: true,
  debug: false,
  logQR: true,
  browserArgs: [''],
};
