import { z } from "zod";

const AssetTypeDTOScheme = z.object({
  id: z.number(),
  name: z.string(),
});

/** Exportable type */
/**
 * AssetTypeDTO
 * @type {z.ZodObject}
 * @memberof module:domain/model/asset-type-dto~AssetTypeDTOScheme
 * @property {number} id - Asset type id
 * @property {string} name - Asset type name
 *
 */
export type AssetTypeDTO = z.infer<typeof AssetTypeDTOScheme>;
