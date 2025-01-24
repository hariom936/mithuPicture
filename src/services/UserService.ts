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
import { generateJwtToken } from "../utils/jwt";


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
      role: userData.role, 
    } as unknown as Users;
  }


  /**
   * Login a user with email and password
   * @param {string} email
   * @param {number} password
   */
  public async login(loginUserData: LoginUserData) {
    try {
      // Check if the user exists by email and password
      const existingUser = await this.user.findOne({
        where: { email: loginUserData.email.toLowerCase(), password: loginUserData.password },
        select: ["id", "first_name", "last_name", "email", "phone", "password", "role", "createdAt", "updatedAt", "token"],
      });
  
      if (!existingUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Email or password is incorrect");
      }
  
      // Generate the JWT token
      const token = generateJwtToken(existingUser.id, existingUser.email, existingUser.password, existingUser.role);
  
      // Save the token in the user's record
      existingUser.token = token;
      await this.user.save(existingUser);
  
      // Optionally save the login attempt in LoginUser (for logging purposes)
      const loginAttempt = new LoginUser();
      loginAttempt.email = existingUser.email;
      loginAttempt.password = existingUser.password;
      loginAttempt.role = existingUser.role;
      await this.logins.save(loginAttempt);
  
      // Return the user with the token as part of the user object
      return {
        user: {
          ...existingUser,
          token: token,  // Include token inside the user object
        },
      };
  
    } catch (error) {
      console.error("Login error:", error);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred during login");
    }
  }
  


  public async fetchData(query): Promise<{ count: number; users: Users[] }> {
    let queryCondition;
    let search = query.search || null;

    // Check if there's a search term and construct the query condition accordingly
    if (search && search !== "" && search !== undefined && search !== null) {
        queryCondition = { where: { storeName: Like(`%${search}%`) } };
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

    // Count the total number of users
    const count = await this.user.count(queryCondition);

    // Fetch the users based on the query condition
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


  
public async updateUser(userId: number, updateUser: { password: number }): Promise<Users | undefined> {
  const userToUpdate = await this.user.findOne({ where: { id: userId } });
  if (!userToUpdate) {
    throw new Error(`User with id ${userId} not found`);
  }

  // If password is passed, update it
  if (updateUser.password) {
    userToUpdate.password = updateUser.password;
  }

  // Save the updated user entity back to the database
  try {
    await this.user.save(userToUpdate);
    return userToUpdate;
  } catch (error) {
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
