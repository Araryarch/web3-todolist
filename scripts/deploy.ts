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

  const envPath = path.resolve(__dirname, "..", ".env.local")
  const envContent = `NEXT_PUBLIC_CONTRACT_ADDRESS=${todoList.address}\n`
  fs.writeFileSync(envPath, envContent)
  console.log("Address written to .env.local")
}

main().catch(console.error)
