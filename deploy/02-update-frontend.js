const { frontEndContractsFile, frontEndAbiFile } = require("../helper-hardhat-config")
const fs = require("fs")
const { network } = require("hardhat")
const { ethers } = require("hardhat")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const lottery = await ethers.getContract("Lottery")
    console.log(lottery.target + "frontend update")
    fs.writeFileSync(frontEndAbiFile, lottery.interface.formatJson())
}

async function updateContractAddresses() {
    const lottery = await ethers.getContract("Lottery")
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (network.config.chainId.toString() in contractAddresses) {
        if (!contractAddresses[network.config.chainId.toString()].includes(lottery.target)) {
            contractAddresses[network.config.chainId.toString()] = lottery.target
        }
    } else {
        contractAddresses[network.config.chainId.toString()] = [lottery.target]
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
