import { z } from "zod";

const AssetTypeDAOScheme = z.object({
  id: z.number(),
  name: z.string(),
});

/** Exportable type */
/**
 * AssetTypeDAO
 * @type {z.ZodObject}
 * @memberof module:domain/model/asset-type-dto~AssetTypeDTOScheme
 * @property {number} id - Asset type id
 * @property {string} name - Asset type name
 *
 */
export type AssetTypeDAO = z.infer<typeof AssetTypeDAOScheme>;
