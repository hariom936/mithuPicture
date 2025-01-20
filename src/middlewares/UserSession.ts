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
import { Role } from "../model";

@Service()
@Middleware({ type: "before" })
export class UserSession implements ExpressMiddlewareInterface {
  responseService = new ResponseService();
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.headers?.authorization) {
      const jwtToken = (req.headers?.authorization?.split("Bearer ")[1] ||
        req.headers?.authorization?.split("bearer ")[1] ||
        req.headers?.authorization?.split("b ")[1]) as string;
      console.log("jwtToken", jwtToken);
      const token = jwt.decode(jwtToken);
      console.log("token decoded -------", token);
      // const id = token?.sub as unknown as UserJwtPayload;
      const { id }: any = token
      const userData = await UserModel.findOne({ _id: id });

      let permissionData;
      console.log(userData, "Ud");
      if (userData) {
        const role = userData.role.toString().toLowerCase();
        // console.log(role , "role -")
        permissionData = await Role.findOne({ title: role  });
        console.log(permissionData, "permissionData");
      }
      
      // console.log(permissionData, "permissionData");
      if (!id || !userData || userData?.session === null) {
        // console.log("catch ---")
        return this.responseService.validationError({
          res,
          status: httpStatus.UNAUTHORIZED,
          message: errorMessages.auth.INVALID_TOKEN.errorMessage,
        });
      }
      const { expiresOn }: any = userData?.session;
      const userExpireCheck = Date.now() > expiresOn
      if (userExpireCheck) {
        userData.session = null;
        await userData.save();
        return this.responseService.validationError({
          res,
          status: httpStatus.UNAUTHORIZED,
          message: errorMessages.auth.SESSION_EXPIRE_TIME.errorMessage,
        });
      } else {
        req["user"] = userData;
       if(permissionData) req["permissionData"] = permissionData;
        return next();
      }
    }
    else {
      return this.responseService.validationError({
        res,
        status: httpStatus.UNAUTHORIZED,
        message: errorMessages.auth.TOKEN_NOT_PROVIDED.errorMessage,
      });

    }
  }
}
