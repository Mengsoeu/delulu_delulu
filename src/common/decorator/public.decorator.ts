import { SetMetadata } from '@nestjs/common';

export const PUBLIC_KEY = 'isPublick';
export const Public = () => SetMetadata(PUBLIC_KEY, true);
