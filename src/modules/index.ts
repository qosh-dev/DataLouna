import { Module } from '../lib/module';
import { ItemsModule } from './items/items.module';
import { UserModule } from './user/user.module';

const modules: Module[] = [new UserModule(), new ItemsModule()];

export default modules;
