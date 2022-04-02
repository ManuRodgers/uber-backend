import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/modules/user/user.entity';

export const ROLES_KEY = 'roles';
export type AllowedRole = keyof typeof UserRole | 'ANY';
export const Roles = (roles: AllowedRole[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
