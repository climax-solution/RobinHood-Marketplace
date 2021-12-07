import InnerNav from '../layout/marketplace-nav';
import './mint.scss';

const Mint = () => {
    return (
        <section className="live-auctions ">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12 col-lg-12 main-image-ss">
                        <div className="image-back-main ">
                            <div className="nav-nmn pt-5">
                                <InnerNav active="mint"/>

                                <div className="row">
                                    <div className="col-md-7 m-auto">
                                        <div className="main-outer-content">
                                            <div className="col-xl-12 col-lg-12 col-md-12  col-12  main-paddss">

                                                <div className="right-side-mbn">
                                                    <h4>Create New Item</h4>
                                                    <h5>Create Item</h5>

                                                    <div className="upload-item">
                                                        <h5>Upload Item File</h5>
                                                        <div className="outer-items">
                                                            <p>PNG, GIF, WEBP, MP4 or MP3. Max 100mb</p>
                                                            <label className="buttonsdi" for="filess">Upload File</label>
                                                            <input type="file" id="filess" className="d-none"></input>
                                                        </div>

                                                    </div>

                                                    <div className="form-mnb">

                                                        <div class="form-group">

                                                            <input type="text" class="form-control" placeholder="Item name" id="exampleitemname" aria-describedby="emailHelp" />
                                                        </div>
                                                        <div className="choosecat">
                                                            <h6>Choose Item Category</h6>
                                                            <div className="outer-choose">
                                                                <button><i class="fas fa-list-ul"></i>Art</button>
                                                                <button><i class="fas fa-camera-retro"></i>Photography</button>
                                                                <button><i class="fas fa-futbol"></i>Sports</button>
                                                                <button><i class="far fa-image"></i>Painting</button>
                                                                <button><i class="far fa-heart"></i>Collectibles</button>
                                                                <button><i class="fas fa-exchange-alt"></i>Gifts</button>
                                                            </div>
                                                        </div>
                                                        <div class="form-group mt-4 mb-5">
                                                            <label>Item Description</label>
                                                            <textarea type="text" class="form-control" id="exampleitemname" aria-describedby="emailHelp" />
                                                        </div>
                                                        <div class="form-group">
                                                            <input type="text" class="form-control" placeholder="Item Price in ETH" id="exampleitemname" aria-describedby="emailHelp" />
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6 col-12 pl-md-0">
                                                                <div class="form-group">

                                                                    <input type="text" class="form-control" placeholder="Royalties" id="exampleitemname" aria-describedby="emailHelp" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 col-12 pr-md-0">
                                                                <div class="form-group">

                                                                    <input type="text" class="form-control" placeholder="Size" id="exampleitemname" aria-describedby="emailHelp" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="form-group">
                                                            <input type="text" class="form-control" id="exampleitemname" placeholder="Number of copies" aria-describedby="emailHelp" />
                                                        </div>
                                                        
                                                    </div>
                                                    <div className="anme-button text-center mt-5">
                                                            <button>Create Now</button>
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