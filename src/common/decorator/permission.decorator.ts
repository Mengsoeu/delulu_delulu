import { SetMetadata } from '@nestjs/common';
import { PERMISSION } from '../enum/role.enum';

export const PERMISSIONS_KEY = 'permission';
export const Permissions = (...permission: PERMISSION[]) =>
  SetMetadata(PERMISSIONS_KEY, permission);
