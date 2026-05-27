import { createConfig, http } from "wagmi"
import { sepolia, hardhat } from "wagmi/chains"
import { metaMask } from "wagmi/connectors"

export const wagmiConfig = createConfig({
  chains: [hardhat, sepolia],
  connectors: [metaMask({ dappMetadata: { name: "MyTodoList", url: "http://localhost:3000" } })],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
    [sepolia.id]: http(),
  },
})
