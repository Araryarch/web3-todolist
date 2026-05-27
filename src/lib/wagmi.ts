import { createConfig, http } from "wagmi"
import { sepolia, hardhat } from "wagmi/chains"

export const wagmiConfig = createConfig({
  chains: [hardhat, sepolia],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
    [sepolia.id]: http(),
  },
})
