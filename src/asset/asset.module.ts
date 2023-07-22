import { Module } from "@nestjs/common";
import { AssetController } from "./asset.controler";
import { AssetRepository } from "./asset.repository";
import { AssetService } from "./asset.service";

@Module({
  imports: [],
  controllers: [AssetController],
  providers: [AssetRepository, AssetService],
})
export default class AssetModule {}
