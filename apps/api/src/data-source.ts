import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "./users/user.entity";

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5433", 10),
  username: process.env.DB_USERNAME || "fuelme",
  password: process.env.DB_PASSWORD || "fuelme",
  database: process.env.DB_NAME || "fuelme",
  entities: [User],
  migrations: [__dirname + "/migrations/*.{ts,js}"],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
