import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MaxLength,
  IsNumber,
  Min,
  IsString,
  IsIn,
  IsDateString,
  IsEnum,
} from "class-validator";

import validationConstants from "../constant/validationConstants";
import { UserRole } from "../entity/Users"; // Adjust the import path as necessary

export class CreateUser {
  @IsOptional({ message: validationConstants.REQUIRED })
  first_name: string;

  @IsOptional({ message: validationConstants.REQUIRED })
  last_name: string;

  @IsOptional({ message: validationConstants.INVALID_VALUE })
  @IsEmail({}, { message: validationConstants.INVALID_VALUE })
  email: string;

  @IsNotEmpty({ message: validationConstants.REQUIRED })
  @IsNumber({}, { message: validationConstants.IS_NUMBER_TYPE })
  phone: number;

  @IsNotEmpty({ message: validationConstants.REQUIRED })
  @IsNumber({},{ message: validationConstants.IS_NUMBER_TYPE })
  password: number;

  @IsNotEmpty({ message: validationConstants.REQUIRED })
  @IsEnum(UserRole, { message: validationConstants.INVALID_VALUE })
  role: UserRole;  // Use the enum to validate the role field


}

export class LoginUser {

  @IsOptional({ message: validationConstants.INVALID_VALUE })
  @IsEmail({}, { message: validationConstants.INVALID_VALUE })
  email: string;


  @IsNotEmpty({ message: validationConstants.REQUIRED })
  @IsNumber({},{ message: validationConstants.IS_NUMBER_TYPE })
  password: number;

}

export class UserListing {
  
  @IsNotEmpty({ message: "Page is Required" })
  @IsNumber()
  @Min(1)
  page: number;

  @IsNotEmpty({ message: "limit is Required" })
  @IsNumber()
  @Min(10)
  limit: number;
}

export class UserId {
  
  @IsOptional({ message: "UserId is Required" })
  @IsNumber()
  @Min(1)
  userId: number;

}

export class UpdateUser {
  

  @IsOptional({ message: "UserId is Required" })
  @IsNumber()
  @Min(1)
  userId: number;

  

}