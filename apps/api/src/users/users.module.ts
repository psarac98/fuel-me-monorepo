import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { UsersValidator } from "./users.validator";
import { UsersController } from "./users.controller";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersValidator, UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
