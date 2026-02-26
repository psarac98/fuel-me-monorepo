import { IsEmail, IsEnum, IsString } from "class-validator";
import { UserRole } from "../user-role.enum";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(UserRole)
  role: UserRole;
}
