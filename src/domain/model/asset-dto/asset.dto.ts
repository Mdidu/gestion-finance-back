import { z } from "zod";

const AssetDTOScheme = z.object({
  id: z.number().optional(),
  name: z.string(),
  distribution: z.number(),
  valuePerPeriod: z.array(
    z.object({
      date: z.date(),
      value: z.number(),
    })
  ),
  totalAmount: z.number(),
});

/** Exportable type */
export type AssetDTO = z.infer<typeof AssetDTOScheme>;
