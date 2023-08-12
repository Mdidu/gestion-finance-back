import { AssetDTO } from "src/domain/model/asset-dto/asset.dto";

export interface AssetRepository {
  getAllAssetsByPortfolio(portfolioId: number): Promise<AssetDTO[]>;
  getAllAssetFromLastMonth(currentMonth: number): Promise<AssetDTO[]>;
  getAllAssetsByMonth(month: number): Promise<AssetDTO[]>;
  getOneAsset(assetId: number): Promise<AssetDTO>;
  createAsset(asset: AssetDTO): Promise<AssetDTO>;
  updateAsset(assetId: number, asset: AssetDTO): Promise<AssetDTO>;
  deleteAsset(assetId: number): Promise<AssetDTO>;
}
