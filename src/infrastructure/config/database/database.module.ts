import { Module } from "@nestjs/common";
import { createPool } from "mysql2";

const dbProvider = {
  provide: "MYSQL_CONNECTION",
  useValue: createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "gestionfinance",
    port: 3306,
  }),
};
@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
