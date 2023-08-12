import { Injectable } from "@nestjs/common";
import { AssetDTO } from "../../../domain/model/asset-dto/asset.dto";
import { AssetDAO } from "../../entities/asset-dao/asset.dao";
import { DatabaseAssetRepository } from "../../repositories/asset-repository/asset.repository";

export type AssetResponse = { asset: AssetDTO };
export type AssetListResponse = { assetList: AssetDTO[] };

@Injectable()
export class AssetService {
  constructor(private readonly assetRepository: DatabaseAssetRepository) {}

  public getAllAssetsByPortfolio(): Promise<AssetDTO[]> {
    const assetList = this.assetRepository.getAllAssetsByPortfolio(1);
    // .then((res) => res.map((asset) => this.mappeAssetDAOToAssetDTO(asset)));

    return assetList;
  }

  public getOneAsset(assetId: number): Promise<AssetDTO> {
    const asset = this.assetRepository.getOneAsset(assetId);

    return asset;
    // if (!asset) throw new NotFoundException("Asset not found");
    // return { asset };
  }

  public createAsset(assetDTO: AssetDTO): Promise<AssetDTO> {
    const asset = this.assetRepository.createAsset(assetDTO);
    return asset;
    // return { asset };
  }

  public updateAsset(assetId: number, assetDTO: any): Promise<AssetDTO> {
    const asset = this.assetRepository.updateAsset(assetId, assetDTO);
    return asset;
    // if (!asset) throw new NotFoundException("Asset not found");
    // return { asset };
  }

  public deleteAsset(assetId: number): Promise<AssetDTO> {
    const asset = this.assetRepository.deleteAsset(assetId);
    return asset;
    // if (!asset) throw new NotFoundException("Asset not found");
    // return { asset };
  }

  public mappeAssetDAOToAssetDTO(assetDAO: AssetDAO): AssetDTO {
    return {
      id: assetDAO.idAsset,
      name: assetDAO.name,
      distribution: assetDAO.amount,
      valuePerPeriod: [
        { date: assetDAO.purchasedAt, value: assetDAO.quantity },
        { date: assetDAO.soldAt, value: assetDAO.quantity },
      ],
      totalAmount: assetDAO.amount,
    };
  }
}
