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
  QueryParam,
} from "routing-controllers";
import { Service } from "typedi";
import { ResponseService } from "../../services/ResponseService";
import {
  CreateUser,
  LoginUser,
  UpdateUser,
  UserId,
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
      // Return success with user data and JWT token
      return this.responseService.success({
        res,
        message: messages.USER.LOGIN_USER_SUCCESS,
        data: {
          user: user.user,  // The user data
          // The JWT token
        },
      });
    } else {
      // If user login failed
      return this.responseService.failure({
        res,
        message: messages.USER.LOGIN_USER_FAILED,
      });
    }
  } catch (error) {
    // If an error occurs, return an internal server error
    return this.responseService.serverError({
      res,
      error: error.message,  // Only send the error message, not the stack trace
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
    @QueryParams() query: UserId,
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
  @QueryParams() userDetails: UserId, // Get userDetails from query parameter
  @Body() updateUser: { password: number }, // Get password from the body
  @Res() res: Response,
  @Req() req: Request
) {
  try {
    const userId = userDetails.userId; // Extract userId from userDetails

    // Pass both userId and password to the updateUser method
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
    @QueryParams() userDetails: UserId, // Get userDetails from query parameter
    @Res() res: Response,
    @Req() req: Request
  ) {
    try {
      const userId = userDetails.userId; // Extract userId from userDetails
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