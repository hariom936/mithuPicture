import {
  JsonController,
  Get,
  Post,
  Body,
  Req,
  Res,
  QueryParams,
  Patch,
  Delete,
} from "routing-controllers";
import { Service } from "typedi";
import { ResponseService } from "../../services/ResponseService";
import {
  CreateUser,
  LoginUser,
  UpdateUser,
  UserDetailsListing,
  UserListing,
} from "../../validations/UserValidation";
import messages from "../../constant/messages";
import { action, component } from "../../constant/api";
import { Request, Response } from "express";
import { apiRoute } from "../../utils/apiSemver";
import { UserService } from "../../services/UserService";
import { Users } from "../../entity/Users";

@Service()
@JsonController(apiRoute(component.USER))
export default class CustomerAdminAuthController {
  constructor(
    private userService: UserService,
    private responseService: ResponseService
  ) {
    this.userService = new UserService();
    this.responseService = new ResponseService();
  }

  @Post(action.ADD)
  public async completeUserOnboarding(
  @Req() req: Request,
  @Body() userData: CreateUser,
  @Res() res: Response
) {
  try {
    // Call the createUser method to add the user
    const user = await this.userService.createUser(userData);

    // If the user creation is successful, return a success response
    if (user && user.createdUser) {
      return this.responseService.success({
        res,
        message: messages.USER.ADD_USER_SUCCESS,
        data: user.createdUser,  // Return the created user
      });
    } else {
      // If user creation fails for some reason
      return this.responseService.failure({
        res,
        message: messages.USER.ADD_USER_FAILED,
      });
    }
  } catch (error) {
    // If any error occurs (e.g., email already exists, internal error)
    return this.responseService.serverError({
      res,
      error,
    });
  }
}


  @Post(action.LOGIN)
  public async loginUser(
    @Req() req: Request,
    @Body() userData: LoginUser,
    @Res() res: Response
  ) {
    try {
      const user = await this.userService.login(userData);
      if (user) {
        return this.responseService.success({
          res,
          message: messages.USER.LOGIN_USER_SUCCESS,
          data: user,
        });
      } else {
        return this.responseService.failure({
          res,
          message: messages.USER.LOGIN_USER_FAILED,
        });
      }
    } catch (error) {
      return this.responseService.serverError({
        res,
        error,
      });
    }
  }

  @Get(action.LIST)
  public async getListing(
    @Req() req: Request,
    @QueryParams() query: UserListing,
    @Res() res: Response
  ) {
    try {
      const fetchData = await this.userService.fetchData(query);
      if (fetchData) {
        return this.responseService.success({
          res,
          message: messages.SUCCESS,
          data: fetchData,
        });
      } else {
        return this.responseService.noDataFound({
          res,
          message: messages.NOT_FOUND,
        });
      }
    } catch (error) {
      return this.responseService.serverError({
        res,
        error,
      });
    }
  }

  @Get(action.DETAIL)
  public async getMallDetails(
    @Req() req: Request,
    @QueryParams() query: UserDetailsListing,
    @Res() res: Response
  ) {
    try {
      const fetchData = await this.userService.fetchDetails(query);
      if (fetchData) {
        return this.responseService.success({
          res,
          message: messages.SUCCESS,
          data: fetchData,
        });
      } else {
        return this.responseService.noDataFound({
          res,
          message: messages.NOT_FOUND,
        });
      }
    } catch (error) {
      return this.responseService.serverError({
        res,
        error,
      });
    }
  }

  @Patch(action.UPDATE)
  public async editUserData(
    @Body() updateUser: UpdateUser,
    @Res() res: Response,
    @Req() req: Request
  ) {
    try {
      const userId = Users.id;
      const upData = await this.userService.updateUser(userId, updateUser);
      if (!upData) {
        return this.responseService.failure({
          res,
          message: messages.USER.USER_UPDATE_FAILED,
        });
      }
      return this.responseService.success({
        res,
        message: messages.USER.USER_UPDATE_SUCCESS,
        data: upData,
      });
    } catch (error) {
      return this.responseService.serverError({
        res,
        error: error.message || 'Server Error',
      });
    }
  }

  @Delete(action.DELETE)
  public async deleteUser(
    @Res() res: Response,
    @Req() req: Request
  ) {
    try {
      const userId = Users.id; 
      await this.userService.deleteUser(userId); 
      
      return this.responseService.success({
        res,
        message: messages.USER.DELETE_USER_SUCCESS,
      });
    } catch (error) {
      return this.responseService.serverError({
        res,
        error: messages.USER.DELETE_USER_FAILED,
      });
    }
  }
}