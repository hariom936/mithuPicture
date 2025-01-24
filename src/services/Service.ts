import { Service } from "typedi";
import { ApiError } from "../utils/Apierror";
import { Like, Repository } from "typeorm";
import AppDataSource from "../config/dbconfig";
import { Services  } from "../entity/Service"; // Adjust based on your actual entity path
import httpStatus from "http-status";

interface ServiceData {
  type: string;
  description: string;
  internPriceRange: string;
  entryLevelPriceRange: string;
  intermediatePriceRange: string;
  advancedPriceRange: string;
}

@Service()
export class Servicess {
  private service: Repository<Services>;

  constructor() {
    // Initialize the service repository
    this.service = AppDataSource.getRepository(Services);
  }

  /**
   * Create a new service (e.g., a graphic design service)
   * @param {ServiceData} serviceData - The data for the new service
   * @returns {Promise<ServiceEntity>} - The newly created service
   */
  public async createService(serviceData: ServiceData): Promise<Services> {
    try {
      // Check if the service already exists by its type and description
      const existingService = await this.service.findOne({
        where: { description: serviceData.description },
      });

      if (existingService) {
        // If the service already exists, throw an error
        throw new ApiError(httpStatus.BAD_REQUEST, "Service already exists");
      }

      // Create the new service from the provided data
      const serviceToCreate = this.service.create(serviceData);

      // Save the newly created service
      const createdService = await this.service.save(serviceToCreate);

      return createdService;
    } catch (error: any) {
      console.error("Error creating service:", error);
     (httpStatus.INTERNAL_SERVER_ERROR, "Error creating service");
    }
  }


  //fetch Service Data
    public async fetchData(query): Promise<{ count: number; servicess: Services[] }> {
        let queryCondition;
        let search = query.search || null;
    
        // Check if there's a search term and construct the query condition accordingly
        if (search && search !== "" && search !== undefined && search !== null) {
            queryCondition = { where: { type: Like(`%${search}%`) } };
        } else {
            queryCondition = {};
        }
    
        // Add ordering by 'id' in ascending order
        queryCondition = {
            ...queryCondition,
            order: {
                id: 'ASC'  // Order by 'id' in ascending order
            }
        };
    
        // Count the total number of service
        const count = await this.service.count(queryCondition);
    
        // Fetch the users based on the query condition
        const service = await this.service.find(queryCondition);
    
        return { count, servicess: service };
    }
}
export { Service };

