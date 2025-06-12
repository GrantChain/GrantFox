import { Trustline } from "@trustless-work/escrow/types";

/**
 *
 * The allows the user to interact with some tokens, in this case, we're using USDC and EURC. But you can add more trustlines.
 *
 */
export const trustlines = [
  {
    name: "USDC",
    address: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
    decimals: 10000000,
  },
  {
    name: "EURC",
    address: "GB3Q6QDZYTHWT7E5PVS3W7FUT5GVAFC5KSZFFLPU25GO7VTC3NM2ZTVO",
    decimals: 10000000,
  },

  // you can add more trustlines here
];

export const trustlinesOptions = trustlines.map(
  (trustline: Trustline & { name?: string }) => ({
    value: trustline.address,
    label: trustline.name,
  }),
);
