import { Injectable } from "@nestjs/common";
import { AssetDTO } from "../../../domain/model/asset-dto/asset.dto";
import { AssetDAO } from "../../entities/asset-dao/asset.dao";
import { DatabaseAssetRepository } from "../../repositories/asset-repository/asset.repository";

export type AssetResponse = { asset: AssetDTO };
export type AssetListResponse = { assetList: AssetDTO[] };

@Injectable()
export class AssetService {
  constructor(private readonly assetRepository: DatabaseAssetRepository) {}

  public getAllAssetsByPortfolio(portfolioId: number): Promise<AssetDTO[]> {
    const assetList = this.assetRepository.getAllAssetsByPortfolio(portfolioId);
    // .then((res) => res.map((asset) => this.mappeAssetDAOToAssetDTO(asset)));

    return assetList;
  }

  public getAllAssetFromLastMonth(portfolioId: number): Promise<AssetDTO[]> {
    const assetList =
      this.assetRepository.getAllAssetFromLastMonth(portfolioId);
    // .then((res) => res.map((asset) => this.mappeAssetDAOToAssetDTO(asset)));
    return assetList;
  }

  public getOneAsset(portfolioId: number, assetId: number): Promise<AssetDTO> {
    const asset = this.assetRepository.getOneAsset(portfolioId, assetId);

    return asset;
    // if (!asset) throw new NotFoundException("Asset not found");
    // return { asset };
  }

  public createAsset(
    assetDTO: AssetDTO,
    portfolioId: number
  ): Promise<AssetDTO> {
    const asset = this.assetRepository.createAsset(assetDTO, portfolioId);
    return asset;
    // return { asset };
  }

  public updateAsset(portfolioId: number, assetDTO: any): Promise<AssetDTO> {
    const asset = this.assetRepository.updateAsset(portfolioId, assetDTO);
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
      quantity: assetDAO.quantity,
      valuePerPeriod: [
        { date: assetDAO.purchasedAt, value: assetDAO.quantity },
        { date: assetDAO.soldAt, value: assetDAO.quantity },
      ],
      amount: assetDAO.amount,
      purchased: assetDAO.purchased,
      assetType: assetDAO.fk_idAssetType,
    };
  }
}
