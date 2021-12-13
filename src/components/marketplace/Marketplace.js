import { useEffect, useState } from "react";
import { useWeb3React } from '@web3-react/core'
import Swal from "sweetalert2";
import getWeb3NoAccount from "../../utils/web3";
import InnerNav from '../layout/marketplace-nav';
import Token from "../../ABI/Token.json";
import Robinhood from "../../ABI/Mint.json";
import RobinMarket from "../../ABI/Marketplace.json";
import address from "../../config/address.json";
import './market.scss';
import empty from "../../Assets/empty.png";

import ScreenLoading from "../Loading/screenLoading";
import ItemLoading from "../Loading/itemLoading";
import { NotificationManager } from "react-notifications";

const { marketplace_address, nft_address, token_address } = address;

const Marketplace = () => {

    const [web3, setWeb3] = useState(null);
    const [token, setToken] = useState(null);
    const [robinHood, setNFT] = useState(null);
    const [marketplace, setMarketplace] = useState(null);
    const [assets, setAssets] = useState([]);
    const [isScreen, setScreenLoading] = useState(false);
    const [isItem, setItemLoading] = useState(false);

    useEffect(async () => {
        const _web3 = await getWeb3NoAccount();
        const _robinHood = new _web3.eth.Contract(Robinhood, nft_address);
        const _token = new _web3.eth.Contract(Token, token_address);
        const _marketplace = new _web3.eth.Contract(RobinMarket, marketplace_address);

        setWeb3(_web3);
        setToken(_token);
        setNFT(_robinHood);
        setMarketplace(_marketplace);

    },[]);

    const buyNFT = async (id) => {        
        // if (!isMetaMask) {
        //   NotificationManager.warning("Metamask is not connected!", "Warning");
        //   return;
        // }
        setScreenLoading(true);
        try {
            const photo = await marketplace.methods.getNFTItem(id).call();
            const buyAmount = photo.marketInfo.price;
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];
            await token.methods.approve(marketplace_address, buyAmount).send({ from : account })
            .on('receipt', async(receipt) => {
                await marketplace.methods.buyNFT(id, buyAmount).send({ from: account });
                setScreenLoading(false);
                NotificationManager.success("Success");
                await getPersonalNFT();
            });
           
        } catch(err) {
            console.log(err);
            setScreenLoading(false);
            NotificationManager.error("Failed");
        }
    }
    
    useEffect(async() => {
        if (!web3 || !robinHood || !marketplace) return;
        await getPersonalNFT();
    },[web3, robinHood, marketplace])

    const getPersonalNFT = async() => {
        setItemLoading(true);
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        let list = await marketplace.methods.getAllNFTs().call();
        list = list.filter(item => item.marketInfo.marketStatus &&( item.baseInfo.owner != account || !account));
        let finalList = [];
        await Promise.all(list.map(async (item) => {
            try {
                const response = await fetch(`http://localhost:8080/ipfs/${item.baseInfo.tokenURI}`);
                if(!response.ok)
                    throw new Error(response.statusText);
                const json = await response.json();
                finalList.push({ ...item, ...json });
            } catch(err) {

            }
        }) );

        setAssets(finalList);
        setItemLoading(false);
    }

    return (
        <>
            { isScreen && <ScreenLoading/> }
            <section className="live-auctions ">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-12 col-lg-12 main-image-ss">
                            <div className="image-back-main ">
                                <div className="nav-nmn pt-5">
                                    <InnerNav active="marketplace"/>
                                    <div className="row"style={{minHeight: '300px'}}>
                                        <div className="col-md-11 m-auto">
                                            <div className="main-outer-content">
                                                <div className="row">
                                                    { isItem && <ItemLoading/>}
                                                    
                                                    {
                                                        !isItem &&
                                                        assets.map((item, idx) => {
                                                            return (
                                                                <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3" key={idx}>
                                                                    <div className="ITEM-CARD">
                                                                        <div className="upper-div-item">
                                                                            {
                                                                                item.ext == "mp4" ?
                                                                                    <video className="nft-item-fluid" autoplay muted>
                                                                                        <source src={`http://localhost:8080/ipfs/${item.asset}`} type="video/mp4"/>
                                                                                    </video>
                                                                                :(
                                                                                    item.ext == "mp3" ?
                                                                                    <audio className="nft-item-fluid" controls>
                                                                                        <source src={`http://localhost:8080/ipfs/${item.asset}`} type="audio/mp3" />
                                                                                    </audio>
                                                                                    : <img alt="" src={`http://localhost:8080/ipfs/${item.asset}`} className="nft-item-fluid" />
                                                                                )
                                                                            }
                                                                        </div>


                                                                        <div className="lower-text-ares">

                                                                            <h4>{item.name}</h4>
                                                                            <div className="price">
                                                                                <h6 className="mr-5">Price <span>{web3.utils.fromWei(item.marketInfo.price, 'gwei')}</span></h6>
                                                                                <h6>1 of {item.copyNumber}</h6>
                                                                            </div>
                                                                            <div className="buttonss">
                                                                                <button onClick={() => buyNFT(item.baseInfo.tokenID)}>Buy</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                    {
                                                        !assets.length && !isItem &&
                                                        <div className="text-center w-100"><img src={empty}/></div>
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Marketplace;
