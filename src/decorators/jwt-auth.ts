import { AdminGuard } from '@modules/auth/guards/admin.guard';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { SuperAdminGuard } from '@modules/auth/guards/super-admin.guard';
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export const IS_OPTIONAL_KEY = 'isOptional';

export const JwtOptional = () => SetMetadata(IS_OPTIONAL_KEY, true);

export function JwtAuth() {
  return applyDecorators(ApiBearerAuth(), UseGuards(JwtAccessTokenGuard));
}

export function JwtAuthOptional() {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAccessTokenGuard),
    JwtOptional(),
  );
}

export function JwtAdminAuth() {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAccessTokenGuard),
    UseGuards(AdminGuard),
  );
}

export function JwtSuperAdminAuth() {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAccessTokenGuard),
    UseGuards(AdminGuard),
    UseGuards(SuperAdminGuard),
  );
}
