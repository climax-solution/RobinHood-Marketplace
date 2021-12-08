import { useEffect, useState } from "react";
import { useWeb3React } from '@web3-react/core'
import getWeb3NoAccount from "../../utils/web3";
import InnerNav from '../layout/marketplace-nav';
import './mint.scss';
import Token from "../../ABI/Token.json";
import Robinhood from "../../ABI/Mint.json";
import Marketplace from "../../ABI/Marketplace.json";
import address from "../../config/address.json";
import { IpfsStorage } from "../../IPFSStorage/ipfs";
const { marketplace_address, nft_address, token_address } = address;

const Mint = () => {
    const {account} = useWeb3React();
    const [web3, setWeb3] = useState({});
    const [token, setToken] = useState({});
    const [robinHood, setNFT] = useState({});
    const [marketplace, setMarketplace] = useState({});

    const [nftName, setNFTName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [royalty, setRoyalty] = useState('');
    const [size, setSize] = useState('');
    const [copyNumber, setCopyNumber] = useState('');
    const [assetFile, setAssetFile] = useState();

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

    const captureFile = (event) => {
        const file = event.target.files[0];

        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file); // Read bufffered file

        // Callback
        reader.onloadend = () => {
            setAssetFile(Buffer(reader.result));
        };
    }
    const onMint = async () => {
        const _price = web3.utils.toWei(price, "gwei");
        const image_hash = await IpfsStorage(assetFile);
        console.log(image_hash);
        const details = {
            image: image_hash,
            name: nftName,
            category: category,
            royalty: royalty,
            size: size,
            copyNumber: copyNumber,
            description: description
        }
        const details_hash = await IpfsStorage(Buffer.from(JSON.stringify(details)));
        await token.methods.approve(marketplace, _price).send({ from : account });
        await robinHood.methods.mint(details_hash).send({ from : account })
        .on('receipt', async(reciept) => {
            const index = reciept.events.returnValues.Minted.tokenID;
            await marketplace.methods.openTrade(index, _price / 10).send({ from : account });
        })
    }

    return (
        <section className="live-auctions ">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12 col-lg-12 main-image-ss">
                        <div className="image-back-main ">
                            <div className="nav-nmn pt-5">
                                <InnerNav active="mint"/>

                                <div className="row">
                                    <div className="col-lg-7 col-12 m-auto">
                                        <div className="main-outer-content">
                                            <div className="col-xl-12 col-lg-12 col-md-12  col-12  main-paddss">

                                                <div className="right-side-mbn">
                                                    <h4>Create New Item</h4>
                                                    <h5>Create Item</h5>

                                                    <div className="upload-item">
                                                        <h5>Upload Item File</h5>
                                                        <div className="outer-items">
                                                            <p>PNG, GIF, WEBP, MP4 or MP3. Max 100mb</p>
                                                            <label className="buttonsdi" htmlFor="filess">Upload File</label>
                                                            <input
                                                                type="file"
                                                                id="filess"
                                                                className="d-none"
                                                                onChange={captureFile}
                                                            />
                                                        </div>

                                                    </div>

                                                    <div className="form-mnb">
                                                        <div className="form-group">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Item name"
                                                                id="exampleitemname"
                                                                aria-describedby="emailHelp"
                                                                onChange={ (e) => setNFTName(e.target.value) }
                                                            />
                                                        </div>
                                                        <div className="choosecat">
                                                            <h6>Choose Item Category</h6>
                                                            <div className="outer-choose">
                                                                <label className="category-item">
                                                                    <input type="radio" name="category" onChange={() => setCategory('art')}/>
                                                                    <span  className="category-btn">
                                                                        <i className="fas fa-list-ul"></i>Art
                                                                    </span>
                                                                </label>
                                                                <label className="category-item">
                                                                    <input type="radio" name="category" onChange={() => setCategory('photography')}/>
                                                                    <span className="category-btn">
                                                                        <i className="fas fa-camera-retro"></i>Photography
                                                                    </span>
                                                                </label>
                                                                <label className="category-item">
                                                                    <input type="radio" name="category" onChange={() => setCategory('sports')}/>
                                                                    <span className="category-btn">
                                                                        <i className="fas fa-futbol"></i>Sports
                                                                    </span>
                                                                </label>
                                                                <label className="category-item">
                                                                    <input type="radio" name="category" onChange={() => setCategory('painting')}/>
                                                                    <span className="category-btn">
                                                                        <i className="far fa-image"></i>Painting
                                                                    </span>
                                                                </label>
                                                                <label className="category-item">
                                                                    <input type="radio" name="category" onChange={() => setCategory('collectibles')}/>
                                                                    <span className="category-btn">
                                                                        <i className="far fa-heart"></i>Collectibles
                                                                    </span>
                                                                </label>
                                                                <label className="category-item">
                                                                    <input type="radio" name="category" onChange={() => setCategory('gifts')}/>
                                                                    <span className="category-btn">
                                                                        <i className="fas fa-exchange-alt"></i>Gifts
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="form-group mt-4 mb-5">
                                                            <label>Item Description</label>
                                                            <textarea
                                                                type="text"
                                                                className="form-control"
                                                                id="exampleitemname"
                                                                aria-describedby="emailHelp"
                                                                value={description}
                                                                onChange={(e) => setDescription(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Item Price in ETH"
                                                                id="exampleitemname"
                                                                aria-describedby="emailHelp"
                                                                value={price}
                                                                onChange={(e) => setPrice(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6 col-12 pl-md-0">
                                                                <div className="form-group">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Royalties"
                                                                        id="exampleitemname"
                                                                        aria-describedby="emailHelp"
                                                                        value={royalty}
                                                                        onChange={(e) => setRoyalty(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 col-12 pr-md-0">
                                                                <div className="form-group">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Size"
                                                                        id="exampleitemname"
                                                                        aria-describedby="emailHelp"
                                                                        value={size}
                                                                        onChange={(e) => setSize(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="exampleitemnam"
                                                                placeholder="Number of copies"
                                                                aria-describedby="emailHelp"
                                                                value={copyNumber}
                                                                onChange={(e) => setCopyNumber(e.target.value)}
                                                            />
                                                        </div>
                                                        
                                                    </div>
                                                    <div className="anme-button text-center mt-5">
                                                        <button onClick={onMint}>Create Now</button>
                                                    </div>
                                                </div>
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

export default Mint;