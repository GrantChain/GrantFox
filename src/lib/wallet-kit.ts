import {
  AlbedoModule,
  FREIGHTER_ID,
  FreighterModule,
  StellarWalletsKit,
  WalletNetwork,
} from "@creit.tech/stellar-wallets-kit";

export const kit: StellarWalletsKit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: FREIGHTER_ID,
  modules: [new FreighterModule(), new AlbedoModule()],
});

interface signTransactionProps {
  unsignedTransaction: string;
  address: string;
}

/**
 * Sign a transaction
 *
 * @Flow:
 * 1. Sign the unsigned transaction
 * 2. Return the signed transaction
 */
export const signTransaction = async ({
  unsignedTransaction,
  address,
}: signTransactionProps): Promise<string> => {
  const { signedTxXdr } = await kit.signTransaction(unsignedTransaction, {
    address,
    networkPassphrase: WalletNetwork.TESTNET,
  });

  return signedTxXdr;
};
