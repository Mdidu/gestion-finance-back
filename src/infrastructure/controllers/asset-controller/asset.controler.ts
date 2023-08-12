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
import { AssetDTO } from "src/domain/model/asset-dto/asset.dto";
import {
  AssetListResponse,
  AssetResponse,
  AssetService,
} from "../../services/asset-service/asset.service";

@Controller("/asset")
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get("/:portfolioId")
  public getAllAssetsByPortfolio(): Promise<AssetListResponse> {
    return this.assetService.getAllAssetsByPortfolio().then((res) => {
      return { assetList: res };
    });
  }

  @Get("/:portfolioId/:assetId")
  public getOneAsset(
    @Param("assetId", ParseIntPipe) assetId: number
  ): Promise<AssetResponse> {
    return this.assetService.getOneAsset(assetId).then((res: AssetDTO) => {
      return { asset: res };
    });
  }

  @Post()
  public createAsset(@Body() assetDTO: any): Promise<AssetResponse> {
    return this.assetService.createAsset(assetDTO).then((res: AssetDTO) => {
      return { asset: res };
    });
  }

  @Put("/:portfolioId/:assetId")
  public updateAsset(
    @Param("assetId", ParseIntPipe) assetId: number,
    @Body() assetDTO: any
  ): Promise<AssetResponse> {
    return this.assetService
      .updateAsset(assetId, assetDTO)
      .then((res: AssetDTO) => {
        return { asset: res };
      });
  }

  @Delete("/:portfolioId/:assetId")
  public deleteAsset(
    @Param("assetId", ParseIntPipe) assetId: number
  ): Promise<AssetResponse> {
    return this.assetService.deleteAsset(assetId).then((res: AssetDTO) => {
      return { asset: res };
    });
  }
}
// async function getAllAssetsByPortfolio(): Promise<AssetDTO[]> {
//   const connection = await mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "password",
//     database: "mydatabase",
//   });

//   const [rows] = await connection.query<AssetDTO[]>(
//     "SELECT * FROM `asset` WHERE fk_idWallet = 1"
//   );

//   await connection.end();

//   return rows;
// }
