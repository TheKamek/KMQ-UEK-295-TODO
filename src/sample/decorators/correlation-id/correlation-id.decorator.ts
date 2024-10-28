import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Constants } from '../../constants/constants';

export const CorrId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request[Constants.correlationId];
});
