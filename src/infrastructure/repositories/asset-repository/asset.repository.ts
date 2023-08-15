import { Inject, Injectable } from "@nestjs/common";
import { AssetRepository } from "src/domain/repositories/asset-repository/asset.repository";
import { DateToolsService } from "src/lib/tools/date-tools/date-tools.service";
import { AssetDTO } from "../../../domain/model/asset-dto/asset.dto";
import { AssetDAO } from "../../entities/asset-dao/asset.dao";

@Injectable()
export class DatabaseAssetRepository implements AssetRepository {
  constructor(@Inject("MYSQL_CONNECTION") private conn: any) {}

  public async getAllAssetsByPortfolio(
    portfolioId: number
  ): Promise<AssetDTO[]> {
    const [rows] = await this.conn
      .promise()
      .query(`SELECT * FROM asset WHERE fk_idWallet = ${portfolioId}`);
    const assetDAO: AssetDAO[] = rows.map((row: any) =>
      this.mappeToAssetDAO(row)
    );
    const listAssetDTO = assetDAO.map((asset) => this.toDTO(asset));
    return listAssetDTO;
  }

  public async getAllAssetFromLastMonth(
    portfolioId: number
  ): Promise<AssetDTO[]> {
    const previousMonthDate = DateToolsService.getPreviousMonthDate(new Date());
    const previousMonthDateString =
      DateToolsService.formatDateToDateString(previousMonthDate);
    const currentDate = DateToolsService.formatDateToDateString(new Date());
    const [rows] = await this.conn
      .promise()
      .query(
        `SELECT * FROM asset WHERE fk_idWallet = ${portfolioId} AND purchasedAt BETWEEN ${previousMonthDateString} AND ${currentDate} OR soldAt BETWEEN ${previousMonthDateString} AND ${currentDate}`
      );
    const assetDAO: AssetDAO[] = rows.map((row: any) =>
      this.mappeToAssetDAO(row)
    );
    const listAssetDTO = assetDAO.map((asset) => this.toDTO(asset));
    return listAssetDTO;
  }

  public getAllAssetsByMonth(month: number): Promise<AssetDTO[]> {
    return new Promise((resolve, reject) => {});
  }

  public async getOneAsset(
    portfolioId: number,
    assetId: number
  ): Promise<AssetDTO> {
    const [rows] = await this.conn
      .promise()
      .query(
        `SELECT * FROM asset WHERE fk_idWallet = ${portfolioId} AND idAsset = ${assetId}`
      );
    const assetDAO: AssetDAO[] = rows.map((row: any) =>
      this.mappeToAssetDAO(row)
    );
    const assetDTO = assetDAO.map((asset) => this.toDTO(asset))[0];
    return assetDTO;
  }

  public async createAsset(
    asset: AssetDTO,
    portfolioId: number
  ): Promise<AssetDTO> {
    let purchasedAt = null;
    let soldAt = null;

    if (asset.purchased) {
      purchasedAt = DateToolsService.formatDateToDateString(
        new Date(asset.valuePerPeriod[0].date)
      );
    } else {
      soldAt = DateToolsService.formatDateToDateString(
        new Date(asset.valuePerPeriod[0].date)
      );
    }

    const rows = await this.conn
      .promise()
      .query(
        `INSERT INTO asset (name, amount, quantity, purchasedAt, soldAt, purchased, fk_idAssetType, fk_idWallet) VALUES ('${asset.name}', ${asset.amount}, ${asset.quantity}, ${purchasedAt}, ${soldAt}, ${asset.purchased}, ${asset.assetType}, ${portfolioId})`
      );
    const assetDAO = this.mappeToAssetDAO(rows);
    const assetDTO = this.toDTO(assetDAO);
    return assetDTO;
  }

  public async updateAsset(
    portfolioId: number,
    asset: AssetDTO
  ): Promise<AssetDTO> {
    let purchasedAt = null;
    let soldAt = null;

    if (asset.purchased) {
      purchasedAt = DateToolsService.formatDateToDateString(
        new Date(asset.valuePerPeriod[0].date)
      );
    } else {
      soldAt = DateToolsService.formatDateToDateString(
        new Date(asset.valuePerPeriod[0].date)
      );
    }
    const rows = await this.conn
      .promise()
      .query(
        `UPDATE asset SET name = '${asset.name}', amount = ${asset.amount}, quantity = ${asset.quantity}, purchasedAt = ${purchasedAt}, soldAt = ${soldAt}, purchased = ${asset.purchased}, fk_idAssetType = ${asset.assetType} WHERE idAsset = ${asset.id} AND fk_idWallet = ${portfolioId}`
      );
    const assetDAO = this.mappeToAssetDAO(rows);
    const assetDTO = this.toDTO(assetDAO);
    return assetDTO;
  }

  public async deleteAsset(assetId: number): Promise<AssetDTO> {
    const rows = await this.conn
      .promise()
      .query(`DELETE FROM asset WHERE idAsset = ${assetId}`);
    const assetDAO = this.mappeToAssetDAO(rows);
    const assetDTO = this.toDTO(assetDAO);
    return assetDTO;
  }

  public toDTO(assetDAO: AssetDAO): AssetDTO {
    return {
      id: assetDAO.idAsset,
      name: assetDAO.name,
      distribution: assetDAO.distribution,
      quantity: assetDAO.quantity,
      valuePerPeriod: [
        { date: assetDAO.purchasedAt, value: assetDAO.amount },
        { date: assetDAO.soldAt, value: assetDAO.amount },
      ],
      amount: assetDAO.amount,
      purchased: assetDAO.purchased,
      assetType: assetDAO.fk_idAssetType,
    };
  }

  public toDAO(assetDTO: AssetDTO): AssetDAO {
    // TODO Ajuster la fonction
    return {
      idAsset: assetDTO.id ? assetDTO.id : -1,
      name: assetDTO.name,
      amount: assetDTO.amount,
      quantity: assetDTO.quantity,
      purchasedAt: assetDTO.valuePerPeriod[0].date,
      soldAt: assetDTO.valuePerPeriod[1].date,
      purchased: assetDTO.purchased,
      fk_idAssetType: 1,
      fk_idWallet: 1,
    };
  }

  // TODO Modifier pour return direct un dto ?
  public mappeToAssetDAO(row: any): AssetDAO {
    return {
      idAsset: row.idAsset,
      name: row.name,
      amount: row.amount,
      quantity: row.quantity,
      purchasedAt: row.purchasedAt,
      soldAt: row.soldAt,
      purchased: row.purchased === 1 ? true : false,
      fk_idAssetType: row.fk_idAssetType,
      fk_idWallet: row.fk_idWallet,
    };
  }
}
