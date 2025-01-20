// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { verifyToken } from '../utils/jwt';
import { UserService } from '../services/UserService';
import AppDataSource from '../config/dbconfig';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { ResponseService } from '../services/ResponseService';
import { Repository } from 'typeorm';
import { Users } from '../entity/Users';
import errorMessage from '../constant/errorMessage';
import { tokenSession } from '../entity/tokenSession';
import moment from 'moment';
import { validate } from 'class-validator';



@Middleware({ type: "before" })
export class authMiddleware implements ExpressMiddlewareInterface {
    private user: Repository<Users>;
    private tokenSession: Repository<tokenSession>
    constructor() {
        this.user = AppDataSource.getRepository(Users);
        this.tokenSession = AppDataSource.getRepository(tokenSession);
        this.user = AppDataSource.getRepository(Users);
    }
    responseService = new ResponseService();
    async use(req: Request, res: Response, next: NextFunction) {
        console.log("staarted ---")
        try {
            if (!req.headers?.authorization) {
                return this.responseService.Unauthorized({
                    res,
                    message: errorMessage.user.AUTHORIZEDUSER.errorMessage,
                });
            }
            console.log("staarted ---22")
            const authHeader = (req.headers?.authorization?.split("Bearer ")[1] ||
                req.headers?.authorization?.split("bearer ")[1] ||
                req.headers?.authorization?.split("b ")[1]) as string;
            console.log(authHeader, "jeader")
            const decoded = verifyToken(authHeader);
            let user
            if (decoded?.userType == 'user') {
                user = await this.user.findOne({ where: { id: decoded.id } });
            } else {
                user = await this.user.findOne({ where: { id: decoded.id } });
            }
            console.log(user, "user ")
            if (!user) {
                return this.responseService.Unauthorized({
                    res,
                    message: errorMessage.user.AUTHORIZEDUSER.errorMessage,
                });
            }
            let tokenFromDb
            const validateToken = await this.tokenSession.findOne({ where: { userId: user.id, userType: decoded.userType } });
            console.log(validateToken, "validateToken")
            if (validateToken) tokenFromDb = verifyToken(validateToken?.token);
            if (validateToken && (moment().isAfter(moment(validateToken?.expiredAt)))) {
                return this.responseService.Unauthorized({
                    res,
                    message: errorMessage.user.TOKENEXPIRED.errorMessage,
                });
            } else if (validateToken.status && JSON.stringify(decoded) === JSON.stringify(tokenFromDb)) {
                req["user"] = user;
                next();
            } else {
                return this.responseService.Unauthorized({
                    res,
                    message: errorMessage.user.AUTHORIZEDUSER.errorMessage,
                });
            }
        } catch (error) {
            return this.responseService.Unauthorized({
                res,
                message: errorMessage.user.AUTHORIZEDUSER.errorMessage,
            });
        }
    }
}
