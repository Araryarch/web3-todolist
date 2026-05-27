import { viem } from "hardhat"
import * as fs from "node:fs"
import * as path from "node:path"

async function main() {
  const publicClient = await viem.getPublicClient()
  const [deployer] = await viem.getWalletClients()

  const balance = await publicClient.getBalance({ address: deployer.account.address })
  console.log("Deploying from:", deployer.account.address)
  console.log("Balance:", balance.toString(), "wei")

  const todoList = await viem.deployContract("TodoList")
  console.log("TodoList deployed to:", todoList.address)

  const todoNFT = await viem.deployContract("TodoNFT", [deployer.account.address])
  console.log("TodoNFT deployed to:", todoNFT.address)

  const nftArtifact = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "..", "artifacts", "contracts", "TodoNFT.sol", "TodoNFT.json"),
      "utf8"
    )
  )
  const hash = await deployer.writeContract({
    address: todoNFT.address,
    abi: nftArtifact.abi,
    functionName: "setTodoList",
    args: [todoList.address],
  })
  await publicClient.waitForTransactionReceipt({ hash })
  console.log("TodoNFT linked to TodoList")

  const envPath = path.resolve(__dirname, "..", ".env.local")
  const envContent = `NEXT_PUBLIC_CONTRACT_ADDRESS=${todoList.address}\nNEXT_PUBLIC_NFT_ADDRESS=${todoNFT.address}\n`
  fs.writeFileSync(envPath, envContent)
  console.log("Addresses written to .env.local")
}

main().catch(console.error)
