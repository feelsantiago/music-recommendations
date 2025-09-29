import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RecommendationLimitGuard implements CanActivate {
  public canActivate(_: ExecutionContext): boolean {
    return false;
  }
}
