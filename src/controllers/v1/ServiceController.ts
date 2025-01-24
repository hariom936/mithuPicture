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
    CreateService,
    ServiceListing
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
    

    //fetch Service Data
    @Get(action.LIST)
      public async getListing(
        @Req() req: Request,
        @QueryParams() query: ServiceListing,
        @Res() res: Response
      ) {
        try {
          const fetchData = await this.servicess.fetchData(query);
          if (fetchData) {
            return this.responseService.success({
              res,
              message: messages.SERVICE.SERVICE_LIST_SUCCESS,
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

}