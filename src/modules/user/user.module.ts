import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRegisterOptions
} from 'fastify';
import { Module } from '../../lib/module';
import UserRepository from './user.repository';
import { InitUserRouter } from './user.router';
import UserService from './user.service';

export class UserModule extends Module {
  opts: FastifyRegisterOptions<FastifyPluginOptions> = {
    prefix: '/user'
  };

  async use(app: FastifyInstance) {
    const userRepository = new UserRepository(app.pg);
    const userService = new UserService(userRepository);

    InitUserRouter(app, userService);
  }
}
