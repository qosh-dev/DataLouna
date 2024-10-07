import { FastifyLoggerOptions, RawServerDefault } from 'fastify';
import { PinoLoggerOptions } from 'fastify/types/logger';
import path from 'path';
import pino from 'pino';
import { asyncLocalStorage } from '../../plugins/als/als.plugin';
import { NodeEnv } from '../../plugins/env-validator/env.config';
import { SystemHeaders } from './context.type';
import { TransportType } from './logger.type';

type LoggerConfigType = FastifyLoggerOptions<RawServerDefault> &
  PinoLoggerOptions;

export class LoggerConfig implements LoggerConfigType {
  enabled = true;

  redact = {
    paths: []
  };

  hooks = {
    logMethod: this.logMethod
  };

  transport = {
    targets: this.transportTargets()
  };

  mixin: (
    mergeObject: object,
    level: number,
    logger: pino.Logger<never, boolean>
  ) => object = this.customizeLog.bind(this);

  // -----------------------------------------------------

  private logMethod(
    inputArgs: Parameters<pino.LogFn>,
    method: pino.LogFn,
    level: number
  ) {
    const logData = inputArgs[0] as any;
    const res = logData?.res as any;
    const req = res?.request;

    if (req?.body) {
      inputArgs[0]['x-req'] = { body: req.body };
    }

    if (res && req) {
      const store = asyncLocalStorage.getStore();
      const requestId = store?.[SystemHeaders.xRequestId];

      inputArgs[0] = {
        ...inputArgs[0] as any,
        req: {
          ...req,
          reqId: requestId || logData.req?.id
        },
        res: {
          ...res,
          request: {
            [SystemHeaders.xRequestId]: requestId || logData.req?.id,
            ...res?.request
          }
        }
      };
    }

    return method.apply(this, inputArgs);
  }

  private customizeLog() {
    const store = asyncLocalStorage.getStore();
    return {
      [SystemHeaders.xRequestId]: store?.[SystemHeaders.xRequestId]
    };
  }

  private transportTargets() {
    const logsDirectory: string = path.join(__dirname, '../../..', 'logs/');
    const transportFormatted: TransportType[] = [];

    // if (process.env.NODE_ENV === NodeEnv.production) {
      transportFormatted.push({
        target: 'pino/file',
        options: {
          destination: logsDirectory + `app.log`,
          translateTime: "yyyy-mm-dd'T'HH:MM:ss.l'Z'",
          mkdir: true
        }
      });
    // }

    if (process.env.NODE_ENV === NodeEnv.development) {
      transportFormatted.push({
        target: 'pino-pretty',
        options: {
          name: 'terminal',
          colorize: true,
          singleLine: true
        }
      });
    }

    return transportFormatted;
  }
}
