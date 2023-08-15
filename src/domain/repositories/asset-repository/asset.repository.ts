import { AssetDTO } from "src/domain/model/asset-dto/asset.dto";

export interface AssetRepository {
  getAllAssetsByPortfolio(portfolioId: number): Promise<AssetDTO[]>;
  getAllAssetFromLastMonth(
    portfolioId: number,
    currentMonth: number
  ): Promise<AssetDTO[]>;
  getAllAssetsByMonth(month: number): Promise<AssetDTO[]>;
  getOneAsset(portfolioId: number, assetId: number): Promise<AssetDTO>;
  createAsset(asset: AssetDTO, portfolioId: number): Promise<AssetDTO>;
  updateAsset(portfolioId: number, asset: AssetDTO): Promise<AssetDTO>;
  deleteAsset(assetId: number): Promise<AssetDTO>;
}
