import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import {
  AssetListResponse,
  AssetResponse,
  AssetService,
} from "./asset.service";

@Controller("/asset")
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get("")
  public getAllAssetsByPortfolio(): AssetListResponse {
    return this.assetService.getAllAssetsByPortfolio();
  }

  @Get("/:assetId")
  public getOneAsset(
    @Param("assetId", ParseIntPipe) assetId: number
  ): AssetResponse {
    return this.assetService.getOneAsset(assetId);
  }

  @Post()
  public createAsset(@Body() assetDTO: any): AssetResponse {
    return this.assetService.createAsset(assetDTO);
  }

  @Put("/:assetId")
  public updateAsset(
    @Param("assetId", ParseIntPipe) assetId: number,
    @Body() assetDTO: any
  ): AssetResponse {
    return this.assetService.updateAsset(assetId, assetDTO);
  }

  @Delete("/:assetId")
  public deleteAsset(
    @Param("assetId", ParseIntPipe) assetId: number
  ): AssetResponse {
    return this.assetService.deleteAsset(assetId);
  }
}
