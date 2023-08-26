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
    const assetList = this.assetRepository
      .getAllAssetsByPortfolio(portfolioId)
      .then((res) =>
        res
          .map((asset) => this.mappeAssetDAOToAssetDTO(asset, res))
          .filter(
            (asset, index, self) =>
              index === self.findIndex((t) => t.name === asset.name)
          )
      );

    return assetList;
  }

  public getAllAssetFromLastMonth(portfolioId: number): Promise<AssetDTO[]> {
    const assetList = this.assetRepository
      .getAllAssetFromLastMonth(portfolioId)
      .then((res) =>
        res
          .map((asset) => this.mappeAssetDAOToAssetDTO(asset, res))
          .filter(
            (asset, index, self) =>
              index === self.findIndex((t) => t.name === asset.name)
          )
      );
    // .then((res) => res.map((asset) => this.mappeAssetDAOToAssetDTO(asset)));
    return assetList;
  }

  public getOneAsset(portfolioId: number, assetId: number): Promise<AssetDTO> {
    const asset = this.assetRepository
      .getOneAsset(portfolioId, assetId)
      .then((res) => this.mappeAssetDAOToAssetDTO(res, [res]));

    return asset;
    // if (!asset) throw new NotFoundException("Asset not found");
    // return { asset };
  }

  public createAsset(
    assetDTO: AssetDTO,
    portfolioId: number
  ): Promise<AssetDTO> {
    const asset = this.assetRepository
      .createAsset(assetDTO, portfolioId)
      .then((res) => this.mappeAssetDAOToAssetDTO(res, [res]));
    return asset;
    // return { asset };
  }

  public updateAsset(portfolioId: number, assetDTO: any): Promise<AssetDTO> {
    const asset = this.assetRepository
      .updateAsset(portfolioId, assetDTO)
      .then((res) => this.mappeAssetDAOToAssetDTO(res, [res]));
    return asset;
    // if (!asset) throw new NotFoundException("Asset not found");
    // return { asset };
  }

  public deleteAsset(assetId: number): Promise<AssetDTO> {
    const asset = this.assetRepository
      .deleteAsset(assetId)
      .then((res) => this.mappeAssetDAOToAssetDTO(res, [res]));
    return asset;
    // if (!asset) throw new NotFoundException("Asset not found");
    // return { asset };
  }

  public mappeAssetDAOToAssetDTO(
    assetDAO: AssetDAO,
    res: AssetDAO[]
  ): AssetDTO {
    const listSimilarAsset = res.filter(
      (asset: any) => assetDAO.name === asset.name
    );
    const arrValuePerPeriod = this.genererValuePerPeriod(listSimilarAsset);
    return {
      id: assetDAO.idAsset,
      name: assetDAO.name,
      distribution: assetDAO.distribution,
      quantity: assetDAO.quantity,
      valuePerPeriod: arrValuePerPeriod,
      amount: assetDAO.amount,
      totalAmount: arrValuePerPeriod.reduce((acc, cur) => acc + cur.value, 0),
      purchased: assetDAO.purchased,
      assetType: assetDAO.fk_idAssetType,
    };
  }

  public genererValuePerPeriod(listSimilarAsset: AssetDAO[]) {
    let valuePerPeriod = [];
    let totalAmount = 0;
    for (const asset of listSimilarAsset) {
      totalAmount = totalAmount + asset.amount;
      if (asset.purchasedAt !== undefined && asset.purchasedAt !== null) {
        valuePerPeriod.push({
          date: asset.purchasedAt,
          value: asset.amount,
          totalAmount: totalAmount,
          topBuy: "B",
        });
      }
      if (asset.soldAt !== undefined && asset.soldAt !== null) {
        valuePerPeriod.push({
          date: asset.soldAt,
          value: asset.amount,
          topBuy: "S",
          totalAmount: totalAmount,
        });
      }
    }

    return valuePerPeriod;
  }
}
