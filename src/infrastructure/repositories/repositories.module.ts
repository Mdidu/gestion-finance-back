import { Module } from "@nestjs/common";
import { DatabaseModule } from "../config/database/database.module";
import { DatabaseAssetRepository } from "./asset-repository/asset.repository";

@Module({
  imports: [DatabaseModule],
  controllers: [],
  exports: [DatabaseAssetRepository],
  providers: [DatabaseAssetRepository],
})
export class RepositoriesModule {}
