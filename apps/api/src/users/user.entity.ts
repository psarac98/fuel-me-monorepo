import { Entity, Column } from "typeorm";
import { BaseEntity } from "../common/base.entity";
import { UserRole } from "./user-role.enum";

@Entity("users")
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: "enum", enum: UserRole })
  role: UserRole;
}
