/**
 * @author: Hariom Verma
 * @file: src/services/UserService.ts
 * @description: User Service is used as a service for exposing user related methods for primarily
 * UserController. User Service interacts with Database for user related CRUD operations.
 */


import { Service } from "typedi";
import { ApiError } from "../utils/Apierror";
import httpStatus from "http-status";
import { Like, Repository } from "typeorm";
import AppDataSource from "../config/dbconfig";
import { Users } from "../entity/Users";
import { LoginUser } from "../entity/LoginUser";

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  phone: number;
  password: number;
  role: string;
}

interface LoginUserData {
  email: string;
  password: number;  // Change to string for better security handling
}

@Service()
export class UserService {
  private user: Repository<Users>;
  private logins: Repository<LoginUser>;

  constructor() {
    this.user = AppDataSource.getRepository(Users);
    this.logins = AppDataSource.getRepository(LoginUser);
  }

  /**
   * Create a new user in system database
   * @param {Object} user
   * @returns {boolean} true if created successfully, false if not.
   */
  public async createUser(userData: UserData) {
    try {
      // Check if the email already exists in the database
      const existingUser = await this.user.findOne({ where: { email: userData.email } });

      if (existingUser) {
        // If the email exists, throw an error indicating the email is already taken
        throw new ApiError(httpStatus.BAD_REQUEST, "User email is already existed");
      }

      // Map userData to the user entity
      const userToCreate = this.mapToUserEntity(userData);

      // Create and save the new user
      const createdUser = await this.user.create(userToCreate);
      await this.user.save(createdUser);

      return { createdUser };
    } catch (error: any) {
      console.error("Error creating user:", error);
      // If any error occurs, throw a generic internal server error

    }
  }


  private mapToUserEntity(userData: UserData): Users {
    return {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      role: userData.role
    } as unknown as Users;
  }


  /**
   * Login a user with email and password
   * @param {string} email
   * @param {number} password
   */
  public async login(loginUserData: LoginUserData) {
    try {
      // Check if the user exists by email and password in the Users table
      const existingUser = await this.user.findOne({
        where: { email: loginUserData.email.toLowerCase(), password: loginUserData.password },
        select: ["id", "first_name", "last_name", "email", "phone", "password", "role", "createdAt", "updatedAt"], // Select all user data
      });

      if (!existingUser) {
        // If no user is found, throw an error indicating the email doesn't exist
        throw new ApiError(httpStatus.BAD_REQUEST, "Email or password is incorrect");
      }
      // If the email exists and matches the password, save the login attempt in the LoginUser tabl

      // Save the login attempt to the LoginUser table
      await this.logins.save(existingUser);

      // If the email exists and matches the password, return the full user data (indicating successful login)
      return existingUser;

    } catch (error: any) {
      console.error("Login error:", error);
      // Handle any internal errors by throwing a generic internal server error

    }
  }


  public async fetchData(query): Promise<{ count: number; users: Users[] }> {
    let queryCondition;
    let search = query.search || null;
    if (search && search !== "" && search !== undefined && search !== null)
      queryCondition = { where: { storeName: Like(`%${search}%`) } };
    else queryCondition = {};
    const count = await this.user.count(queryCondition);
    const users = await this.user.find(queryCondition);

    return { count, users };
  }

  public async fetchDetails(queryParam: any) {
    try {
        const { userId, search } = queryParam;

        // If searching by `userId`
        if (userId) {
            const user = await this.user.findOne({ where: { id: userId } });
            if (!user) {
                throw new Error("User not found");
            }
            return { data: [user] };
        }

        // If searching by `first_name`
        if (search) {
            const users = await this.user.find({ where: { first_name: search } });
            if (users.length === 0) {
                throw new Error("No users found with the given name");
            }
            return { data: users };
        }

        // If neither `userId` nor `search` is provided
        throw new Error("Either userId or search parameter is required ");
    } catch (error) {
        // Return a clean error message
        return { message: error.message };
    }
}


  
  public async updateUser(
    userId: number,
    updateUser: any
  ): Promise<Users | undefined> {
    const userToUpdate = await this.user.findOne({ where: { id: userId } });
    if (!userToUpdate) {
      throw new Error(`User with id ${userId} not found`);
    }

    // Update the user entity with the new data
    Object.assign(userToUpdate, updateUser);

    // Save the updated user entity back to the database
    try {
      await this.user.save(userToUpdate);
      return userToUpdate;
    } catch (error) {
      // Handle errors such as validation errors, database errors, etc.
      throw new Error(
        `Unable to update user with id ${userId}. Error: ${error.message}`
      );
    }
  }

  public async deleteUser(userId: number): Promise<void> {
    // Find the user to delete
    const userToDelete = await this.user.findOne({ where: { id: userId } });

    if (!userToDelete) {
      throw new Error(`User with id ${userId} not found`);
    }

    try {
      // Delete the user from the database
      await this.user.remove(userToDelete);
    } catch (error) {
      // Handle errors such as database errors, integrity constraints, etc.
      throw new Error(`Unable to delete user with id ${userId}. Error: ${error.message}`);
    }
  }



}
