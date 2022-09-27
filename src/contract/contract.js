import { address, ART_GOBBLER_ABI } from './config'
import web3 from 'web3'
import axios from 'axios'

// const MaxUint256 = (/*#__PURE__*/BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"));

const defaultW3 = new web3('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161')
const DEFAULT_CHAIN_ID = '4'

const cache = {}

const loadConractABI = async (nftAddress) => {
    const resp = await axios.get(
        `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${nftAddress}`
    )
    console.log(resp)
    return resp.data.result
}

const loadContract = (web3Ref, contractAddress, contractABI) => {
    const contract = new web3Ref.eth.Contract(
        contractABI,
        contractAddress
    )
    return contract
}

const loadContractWithABI = async (w3, address) => {
    let contract_abi

    if(!cache[address]) {
        cache[address] = await loadConractABI(address)
    }

    contract_abi = JSON.parse(cache[address])
    const contract = loadContract(w3, address, contract_abi)
    return contract
}

const getContractAddress = (name, chainId) => {
    if(!chainId) {
        return address[name][DEFAULT_CHAIN_ID]
    }
    return address[name][chainId]
}

const gobble = async (w3, userAddress, gobblerId, nft, nftId, isERC1155) => {
    const address = getContractAddress('ArtGobbler', DEFAULT_CHAIN_ID)
    const contract = loadContract(w3, address, ART_GOBBLER_ABI)
    const result = await contract.methods.gobble(
        gobblerId, 
        nft,
        nftId, 
        isERC1155
    ).send({
        from: userAddress
    })
    return result
}

const loadNFTInfo = async (nftAddress, nftId) => {
    
    const contract = await loadContractWithABI(defaultW3, nftAddress)
    const owner = await contract.methods.ownerOf(nftId).call()
    const tokenURI = await contract.methods.tokenURI(nftId).call()
    const metadata = await axios.get(tokenURI)
    const result = {
        owner,
        imageUrl: metadata.data.image
    }
    console.log(result)
    return result
}

const isNFTApproved = async (account, nftAddress) => {
    
    const contract = await loadContractWithABI(defaultW3, nftAddress)

    const artGobblerAddress = address['ArtGobbler'][DEFAULT_CHAIN_ID]

    const result = await contract.methods.isApprovedForAll(
        account, artGobblerAddress
    ).call()

    return result
}

const approveArtGobbler = async (w3, account, nftAddress) => {

    const contract = await loadContractWithABI(w3, nftAddress)

    const result = await contract.methods.setApprovalForAll(
        address['ArtGobbler'][DEFAULT_CHAIN_ID],
        true
    ).send(
        {
            from: account
        }
    )

    return result

}

export {
    getContractAddress,
    isNFTApproved,
    approveArtGobbler,
    loadNFTInfo,
    gobble
}