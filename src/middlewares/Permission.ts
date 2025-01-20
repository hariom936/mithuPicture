import { NextFunction, Request, Response } from "express";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { Service } from "typedi";
import { UserModel } from "../model/User";
import { UserJwtPayload } from "../types/userToken";
import jwt from "jsonwebtoken";
import errorMessages from "../constant/errorMessage";
import httpStatus from "http-status";
import config from "../config/config";
import { ResponseService } from "../services/ResponseService";

@Service()
@Middleware({ type: "before" })
export class userPermission implements ExpressMiddlewareInterface {
    responseService = new ResponseService();
    async use(req: Request, res: Response, next: NextFunction) {
        console.log("permission")


        console.log(req["user"], "we have pushed through middleware for further use in controller")
        next()

    }
}
