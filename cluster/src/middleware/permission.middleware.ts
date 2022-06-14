import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';
import PackageConfig from '@/config'
@Injectable()
export class PermissionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let headers: any = req.headers
    if (PackageConfig.sign(headers.token)) {
      next();
    } else {
      res.status(200).send({ code: 404, msg: '节点签名信息异常，解密失败。' })
      return
    }
  }
}
