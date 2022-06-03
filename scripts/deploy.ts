// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { Contract } from 'ethers'
import hre, { ethers } from 'hardhat'

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

	const implementationInterface = Implementation.interface

	const proxyWithImplementationInterface = new Contract(proxy.address, implementationInterface, ethers.provider)
	const tx = await proxyWithImplementationInterface.add(1, 2)
	console.log(tx)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
