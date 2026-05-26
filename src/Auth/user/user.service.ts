import { Model } from "mongoose";
import { UserDoc } from "@mainshopapp/common";
import { AuthDto } from "../dtos/auth.dto";
import { User } from "./user.model";

export class UserService {
  constructor(public userModel: Model<UserDoc>) {}
  async create(createUserDto: AuthDto): Promise<UserDoc> {

    const user = new this.userModel({ 
      email: createUserDto.email,
      password: createUserDto.password,
    });
    await user.save();
    return user;
  }

  async findByEmail(email: string): Promise<UserDoc | null> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<UserDoc | null> {
    return this.userModel.findById(id);
  }

  async update(
    id: string,
    updateUserDto: Partial<AuthDto>,
  ): Promise<UserDoc | null> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async delete(id: string): Promise<UserDoc | null> {
    return this.userModel.findByIdAndDelete(id);
  }

  async findAll(): Promise<UserDoc[]> {
    return this.userModel.find();
  }
}

export const userService = new UserService(User);