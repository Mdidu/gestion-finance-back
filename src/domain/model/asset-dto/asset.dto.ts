import { z } from "zod";

const AssetDTOScheme = z.object({
  id: z.number().optional(),
  name: z.string(),
  distribution: z.number().optional(),
  quantity: z.number(),
  valuePerPeriod: z.array(
    z.object({
      date: z.date(),
      value: z.number(),
    })
  ),
  amount: z.number(),
  purchased: z.boolean(),
  assetType: z.number(),
});

/** Exportable type */
export type AssetDTO = z.infer<typeof AssetDTOScheme>;
