import Web3 from "web3";
import { toast } from 'react-toastify'
import { ENV } from './../config/config';
import contractAbi from './../utils/abis/token.json';
let Contract = require('web3-eth-contract');
const nftContractAddress = ENV.nftContractAddress;
let requiredChainId = ENV.requiredChainId;
Contract.setProvider(
    new Web3(Web3.givenProvider || new Web3.providers.HttpProvider(ENV.web3ProviderAddress))
);
export const getWeb3 = async () => {
    if (window.ethereum) {
        const web3 = new Web3(Web3.givenProvider);
        return web3;
    }
    else {
        return false;
    }
}

export const connectMetamask = async () => {
    if (window.ethereum) {
        const web3 = await getWeb3();
        await window.ethereum.enable();
        let accounts = await web3.eth.getAccounts();
        let chainId = await web3.eth.getChainId();
        if (chainId !== requiredChainId) {
            toast.error(`Please switch to ${ENV.requiredChainName} in order to use all features of Marketplace`);
        }
        return accounts[0];
    }
    else {
        toast.error("Please install Metamask Wallet in order to use all features of Marketplace");
    }
}

export const getPercentagesWeb3 = async () => {
    const web3 = await getWeb3();
    if (!web3) {
        toast.error("No web3 instance found");
        return false;
    }
    try {
        let tokenContract = new Contract(contractAbi, nftContractAddress);
        const percentage = await tokenContract.methods.checkRoyaltySplitPercent().call()
        return percentage
    } catch (e) {
        console.log(e);
        return false;
    }
}

export const updatePercentagesWeb3 = async (share) => {
    const web3 = await getWeb3();
    if (!web3) {
        toast.error("No web3 instance found");
        return true;
    }
    try {
        let connectedAddress = await connectMetamask();
        let tokenContract = new Contract(contractAbi, nftContractAddress);
        const percentage = await tokenContract.methods.updatePlatformSharePercent(share).send({ from: connectedAddress })
        return percentage
    } catch (e) {
        console.log(e);
        let eMessage = e.message.split('{')[0] || '';
        toast.error(eMessage);
        return true;
    }
}