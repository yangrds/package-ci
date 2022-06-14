import { decrypt } from '@/utils/verify';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';

@Injectable()
export class RootMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let headers: any = req.headers
    try {
      // 令牌（token）私钥解密
      let token: {
        account: string;
        access: string;
        password: string;
        job_id: string;
        valid: number;
        date: number
      } = JSON.parse(decrypt(headers.token))
      if (token.access === '1') {
        next();
      } else {
        res.status(200).send({ code: 500, msg: '权限不足，需要超级用户权限' })
      }
    } catch (error) {
      res.status(200).send({ code: 500, msg: error.message })
    }
  }
}
