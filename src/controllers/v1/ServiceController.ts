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
    CreateService
  } from "../../validations/ServiceValidation";
  import messages from "../../constant/messages";
  import { action, component } from "../../constant/api";
  import { Request, Response } from "express";
  import { apiRoute } from "../../utils/apiSemver";
  import { Servicess } from "../../services/Service";


  @Service()
  @JsonController(apiRoute(component.SERVICE))
  export default class CustomerAdminAuthController {
    constructor(
      private servicess: Servicess,
      private responseService: ResponseService
    ) {
      this.servicess = new Servicess();
      this.responseService = new ResponseService();
    }
  
    @Post(action.ADD)
    @Post(action.ADD)
    public async createService(
      @Req() req: Request,
      @Body() serviceData: CreateService, // Accept the validated service data
      @Res() res: Response
    ) {
      try {
        // Assuming createService method throws an ApiError or HttpError
        const service = await this.servicess.createService(serviceData);
    
        // If the service creation is successful, return a success response
        if (service) {
          return this.responseService.success({
            res,
            message: messages.SERVICE.SERVICE_ADD_SUCCESS,
            data: service,
          });
        } else {
          return this.responseService.failure({
            res,
            message: messages.SERVICE.SERVICR_FAILED,
          });
        }
      } catch (error: any) {
        // Catch any error thrown and send a clean server error response
        return this.responseService.serverError({
          res,
          error,  // Pass the error object directly
        });
      }
    }
    

}