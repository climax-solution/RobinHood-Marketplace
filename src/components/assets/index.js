import { useEffect, useState } from "react";
import { useWeb3React } from '@web3-react/core'
import Swal from "sweetalert2";
import getWeb3NoAccount from "../../utils/web3";
import InnerNav from '../layout/marketplace-nav';
import Token from "../../ABI/Token.json";
import Robinhood from "../../ABI/Mint.json";
import Marketplace from "../../ABI/Marketplace.json";
import address from "../../config/address.json";
import { IpfsStorage } from "../../IPFSStorage/ipfs";
const { marketplace_address, nft_address, token_address } = address;

const MyAssets = () => {
    const {account} = useWeb3React();
    const [web3, setWeb3] = useState({});
    const [token, setToken] = useState({});
    const [robinHood, setNFT] = useState({});
    const [marketplace, setMarketplace] = useState({});
    const [assets, setAssets] = useState([]);

    useEffect(async () => {
        const _web3 = await getWeb3NoAccount();
        const _robinHood = new _web3.eth.Contract(Robinhood, nft_address);
        const _token = new _web3.eth.Contract(Token, token_address);
        const _marketplace = new _web3.eth.Contract(Marketplace, marketplace_address);

        setWeb3(_web3);
        setToken(_token);
        setNFT(_robinHood);
        setMarketplace(_marketplace);

    },[]);


    const putOnSale = async (id) => {
        await Swal.fire({
          title: '<span style="font-size: 22px">PLEASE ENTER PRICE</span>',
          input: 'number',
          width: 350,
          inputAttributes: {
            autocapitalize: 'off',
          },
          inputValidator: (value) => {
            if (value < 0.1)  return "Price must be greater than 0.1.";
          },
          color: '#000',
          showCancelButton: true,
          confirmButtonText: 'OK',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading()
        }).on('receipt',async(result) => {
          if (result.isConfirmed) {
  
            try {
              const photoPrice = web3.utils.toWei((result.value).toString(), 'ether');
              await robinHood.methods.approve(marketplace_address, id).send({from : account });
              await token.methods.approve(marketplace_address, photoPrice).send({ from: account });
              await marketplace.methods.openTrade(id, photoPrice / 20).send({ from: account })
              .then( async(res) => {
                // NotificationManager.success("Success");
                await this.getPersonalNFT();
              })
            } catch(err) {
            //   NotificationManager.error("Failed");
            }
          }
        })
          
    }

    const cancelOnSale = async (id) => {
        try {
        const photo = await marketplace.methods.getNFTItem(id).call();
        const buyAmount = photo.marketData.price;
        await token.methods.approve(marketplace_address, buyAmount).send({ from: account });
        await marketplace.methods.cancelTrade(id).send({ from: account, value: buyAmount / 20 })
        .on('receipt',async(result) => {
            // NotificationManager.success("Success");
            await this.getPersonalNFT();
        });
        } catch(err) {
            // NotificationManager.error("Failed");
        }
    }

    const getPersonalNFT = async() => {
        let list = await marketplace.methods.getAllPhotos().call();
        list = list.filter(item => item.baseInfo.owner == account);
        const finalResult = await Promise.all(list.map(async (item) => {
            const response = await fetch(`${process.env.REACT_APP_IPFS}/ipfs/${item.baseInfo.tokenURI}`);
            if(!response.ok)
                throw new Error(response.statusText);
  
            const json = await response.json();
            
            return {...item, ...json}
        }) );

        setAssets(finalResult);
    }

    return (
        <section className="live-auctions ">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12 col-lg-12 main-image-ss">
                        <div className="image-back-main ">
                            <div className="nav-nmn pt-5">
                                <InnerNav active="personal"/>
                                <div className="row">
                                    <div className="col-md-11 m-auto">
                                        <div className="main-outer-content">
                                            <div className="row">
                                                
                                                {
                                                    assets.map(item => {
                                                        return (
                                                            <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                                                                <div className="ITEM-CARD">
                                                                    <div className="upper-div-img">
                                                                        <img alt="" src={`${process.env.REACT_APP_IPFS}/ipfs/${item.image}`} className="img-fluid " />
                                                                    </div>


                                                                    <div className="lower-text-ares">

                                                                        <h4>{item.name}</h4>
                                                                        <div className="price">
                                                                            <h6 className="mr-5">Price <span>{web3.utils.fromWei(item.marketInfo.price, 'gwei')}</span></h6>
                                                                            <h6>1 of {item.copyNumber}</h6>
                                                                        </div>
                                                                        <div className="buttonss">
                                                                            {
                                                                                item.marketInfo.marketStatus ?
                                                                                    <button onClick={() => putOnSale(item.baseInfo.tokenID)}>Sell</button>
                                                                                : <button onClick={() => cancelOnSale(item.baseInfo.tokenID)}>Cancel Sell</button>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                                {
                                                    !assets.length && <h3>Empty</h3>
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
    )
}

export default MyAssets;