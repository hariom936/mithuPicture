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
  @IsOptional()
  @IsIn(validationConstants.VALIDATE_USER.SORT_TYPE_FILTERS, {
    message: "Filter must be of the following values: $constraint1",
  })
  @IsOptional()
  @IsString({ message: validationConstants.IS_STRING_TYPE })
  filterBy: string;

  @IsOptional()
  @MaxLength(100, { message: validationConstants.MAX_LENGTH })
  @IsString({ message: validationConstants.IS_STRING_TYPE })
  filterValue: string;

  @IsOptional()
  @IsIn(validationConstants.VALIDATE_USER.USER_LISTING_FILTER_CONDITIONS, {
    message: "Filter Condition must be of the following values: $constraint1",
  })
  @IsString({ message: validationConstants.IS_STRING_TYPE })
  filterCondition: string;

  @IsOptional()
  @IsIn(validationConstants.VALIDATE_USER.SORT_TYPE_FILTERS, {
    message: "Sort type must be of the following values: $constraint1",
  })
  @IsNumber(
    {},
    {
      message: validationConstants.IS_NUMBER_TYPE,
    }
  )
  sortType: number;

  @IsOptional()
  @IsIn(validationConstants.VALIDATE_USER.USER_LISTING_FILTERS, {
    message: "Sort By must be of the following values: $constraint1",
  })
  @IsOptional()
  @IsString({ message: validationConstants.IS_STRING_TYPE })
  sortBy: string;


  @IsNotEmpty({ message: "Page is Required" })
  @IsNumber()
  @Min(1)
  page: number;
}

export class UpdateUser {
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
  @IsDateString({},{ message: validationConstants.INVALID_DATE_FORMAT })
  birthday: Date;

  

}