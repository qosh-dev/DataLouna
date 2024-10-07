import pino from 'pino';

export type TransportType =
  | pino.TransportTargetOptions<Record<string, any>>
  | pino.TransportPipelineOptions<Record<string, any>>;
