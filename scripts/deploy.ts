// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { Interface } from '@ethersproject/abi'
import { Contract } from 'ethers'
import hre, { ethers } from 'hardhat'
import * as IMPLEMAENTATION_CONTRACT from '../artifacts/contracts/Implementation.sol/Implementation.json'

async function main() {
	// Hardhat always runs the compile task when running scripts with its command
	// line interface.
	//
	// If this script is run directly using `node` you may want to call compile
	// manually to make sure everything is compiled
	await hre.run('compile')

	// We get the contract to deploy
	const Proxy = await ethers.getContractFactory('Proxy')
	const proxy = await Proxy.deploy()
	await proxy.deployed()

	console.log('Proxy deployed to:', proxy.address)

	const Implementation = await ethers.getContractFactory('Implementation')
	const implementation = await Implementation.deploy()
	await implementation.deployed()

	console.log('Implementation deployed to:', implementation.address)

	await proxy.setImplementation(implementation.address)

	// const implementationInterface = Implementation.interface

	// Creating interface from ABI
	const implementationInterface = new Interface(IMPLEMAENTATION_CONTRACT.abi)

	// Defining Proxy contract as contract with logic
	const contract = new Contract(proxy.address, implementationInterface, ethers.provider)

	// Call any function on contract
	const tx = await contract.add(1, 2) // 1 + 2
	console.log(tx) // 3
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
