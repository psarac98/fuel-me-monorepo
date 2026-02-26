import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersValidator {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async validateCreateUser(dto: CreateUserDto): Promise<void> {
    const existing = await this.usersRepository.findOneBy({
      email: dto.email,
    });
    if (existing) {
      throw new ConflictException(
        `A user with email "${dto.email}" already exists`,
      );
    }
  }

  async validateUpdateUser(id: string, dto: UpdateUserDto): Promise<void> {
    if (!dto.email) return;

    const existing = await this.usersRepository.findOneBy({
      email: dto.email,
      id: Not(id),
    });
    if (existing) {
      throw new ConflictException(
        `A user with email "${dto.email}" already exists`,
      );
    }
  }
}
