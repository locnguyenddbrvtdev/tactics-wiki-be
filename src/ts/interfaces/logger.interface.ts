export interface LoggerInterface {
  warn(message: string): void;

  error(message: string): void;

  debug(message: string): void;

  info(message: string): void;

  reqInfo(reqId: string): void;
}
