import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';
import { encrypt, decrypt } from '@/utils/verify'
import { _findOne, ModelResult } from '@/utils/sql';
import { memberModel } from '@/members/members.sql'

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    let headers: any = req.headers
    try {
      // 令牌（token）私钥解密
      let token: {
        account: string;
        password: string;
        job_id: string;
        valid: number;
        date: number
      } = JSON.parse(decrypt(headers.token))


      // 登录时间超过登录时指定的有效时长（默认一天），令牌失效
      if ((Math.round(new Date() as any) - token.date) > token.valid) {
        res.status(200).send({ code: 304, msg: '无效的令牌' })
        return
      }

      // 用户数据数据查询
      const user: ModelResult = await _findOne(memberModel, { account: token.account })

      // 数据查询失败
      if (user.code != 200) {
        res.status(200).send({ code: 304, msg: '无效的令牌' })
        return
      }
      // 密码错误
      if (user.data.pwd != token.password) {
        res.status(200).send({ code: 304, msg: '无效的令牌' })
        return
      }
      next()
    } catch (error) {
      // 解密过程中出现未知错误
      res.status(200).send({ code: 304, msg: '无效的令牌' })
    }
  }
}
