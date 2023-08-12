import { Inject, Injectable } from "@nestjs/common";
import { AssetRepository } from "src/domain/repositories/asset-repository/asset.repository";
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
      .query("SELECT * FROM `asset` WHERE fk_idWallet = 1");
    console.log(rows);
    const assetDAO = this.mappeToAssetDAO(rows);
    const assetDTO = assetDAO.map((asset) => this.toDTO(asset));
    return assetDTO;
  }

  // TODO Penser à refacto le code
  // public async getAllAssetsByPortfolio(
  //   portfolioId: number
  // ): Promise<AssetDTO[]> {
  //   const connection = await createConnection({
  //     host: "localhost",
  //     user: "root",
  //     password: "",
  //     database: "gestionfinance",
  //     port: 3306,
  //   });

  //   const [rows] = await connection.query<RowDataPacket[]>(
  //     "SELECT * FROM `asset` WHERE fk_idWallet = 1"
  //   );
  //   console.log(rows);
  //   await connection.end();
  //   const assetDAO = this.mappeToAssetDAO(rows);
  //   const assetDTO = assetDAO.map((asset) => this.toDTO(asset));
  //   return assetDTO;
  // }

  public getAllAssetFromLastMonth(currentMonth: number): Promise<AssetDTO[]> {
    return new Promise((resolve, reject) => {});
  }

  public getAllAssetsByMonth(month: number): Promise<AssetDTO[]> {
    return new Promise((resolve, reject) => {});
  }

  public getOneAsset(assetId: number): Promise<AssetDTO> {
    return new Promise((resolve, reject) => {});
  }

  public createAsset(asset: AssetDTO): Promise<AssetDTO> {
    return new Promise((resolve, reject) => {});
  }

  public updateAsset(assetId: number, asset: AssetDTO): Promise<AssetDTO> {
    return new Promise((resolve, reject) => {});
  }

  public deleteAsset(assetId: number): Promise<AssetDTO> {
    return new Promise((resolve, reject) => {});
  }

  public toDTO(assetDAO: AssetDAO): AssetDTO {
    return {
      id: assetDAO.idAsset,
      name: assetDAO.name,
      distribution: assetDAO.quantity,
      valuePerPeriod: [
        { date: assetDAO.purchasedAt, value: assetDAO.amount },
        { date: assetDAO.soldAt, value: assetDAO.amount },
      ],
      totalAmount: assetDAO.amount,
    };
  }

  public toDAO(assetDTO: AssetDTO): AssetDAO {
    // TODO Ajuster la fonction
    return {
      idAsset: assetDTO.id ? assetDTO.id : -1,
      name: assetDTO.name,
      amount: assetDTO.totalAmount,
      quantity: assetDTO.distribution,
      purchasedAt: assetDTO.valuePerPeriod[0].date,
      soldAt: assetDTO.valuePerPeriod[1].date,
      purchased: true,
      fk_idAssetType: 1,
      fk_idWallet: 1,
    };
  }

  // TODO Modifier pour return direct un dto ?
  public mappeToAssetDAO(rows: any[]): AssetDAO[] {
    return rows.map((row) => {
      return {
        idAsset: row.idAsset,
        name: row.name,
        amount: row.amount,
        quantity: row.quantity,
        purchasedAt: row.purchasedAt,
        soldAt: row.soldAt,
        purchased: row.purchased,
        fk_idAssetType: row.fk_idAssetType,
        fk_idWallet: row.fk_idWallet,
      };
    });
  }
}
