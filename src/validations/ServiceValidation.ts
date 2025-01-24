import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    MaxLength,
    IsIn,
    Min,
  } from "class-validator";
  
  import validationConstants from "../constant/validationConstants";
  
  export class CreateService {
    @IsNotEmpty({ message: validationConstants.REQUIRED })
    @IsString({ message: validationConstants.INVALID_VALUE })
    type: string;
  
    @IsNotEmpty({ message: validationConstants.REQUIRED })
    @IsString({ message: validationConstants.INVALID_VALUE })
    description: string;
  
    @IsNotEmpty({ message: validationConstants.REQUIRED })
    @IsString({ message: validationConstants.INVALID_VALUE })
    internPriceRange: string;
  
    @IsNotEmpty({ message: validationConstants.REQUIRED })
    @IsString({ message: validationConstants.INVALID_VALUE })
    entryLevelPriceRange: string;
  
    @IsNotEmpty({ message: validationConstants.REQUIRED })
    @IsString({ message: validationConstants.INVALID_VALUE })
    intermediatePriceRange: string;
  
    @IsNotEmpty({ message: validationConstants.REQUIRED })
    @IsString({ message: validationConstants.INVALID_VALUE })
    advancedPriceRange: string;
  }

  export class ServiceListing {
    
    @IsNotEmpty({ message: "Page is Required" })
    @IsNumber()
    @Min(1)
    page: number;
  
    @IsNotEmpty({ message: "limit is Required" })
    @IsNumber()
    @Min(10)
    limit: number;
  }
  