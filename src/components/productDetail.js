import React from  'react'
import Axios from 'axios'
import {urlApi} from './../support/urlApi'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import swal from 'sweetalert'
import CurrencyFormat from 'react-currency-format'
import {fnHitungCart} from './../1.actions'

class ProductDetail extends React.Component {
    state ={product : {}, cart : 0}
    
    componentDidMount(){
        this.getDataApi()
    }
    
    getDataApi = () => {
        var idUrl = this.props.match.params.id
        Axios.get(urlApi+'/products/'+idUrl)
        .then((res) => {
            this.setState({product: res.data})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    proteksiJumlah = () => {
        if(this.refs.jumlah.value < 1){
            this.refs.jumlah.value = 1
        }
    }
    

    onBtnCart = () => {
        Axios.get( urlApi + '/products?id='+ this.state.product.id )
        .then((res) => {
            var username = this.props.username
            var userId = this.props.id
            var productId = res.data[0].id
            var namaProduk = res.data[0].nama
            var harga = res.data[0].harga
            var discount = res.data[0].discount
            var kategori = res.data[0].kategori
            var img = res.data[0].img
            var quantity = parseInt(this.refs.jumlah.value)
            var newData = {
                username, userId, productId, namaProduk, 
                harga, discount, kategori, img, quantity
            }
            Axios.get(urlApi+'/cart?userId='+this.props.id+'&productId='+newData.productId)
                .then((res)=> {
                    console.log(res)
                    if(res.data.length > 0){
                        var username = this.props.username
                        var userId = this.props.id
                        var productId = newData.productId
                        var namaProduk = res.data[0].namaProduk
                        var harga = res.data[0].harga
                        var discount = res.data[0].discount
                        var kategori = res.data[0].kategori
                        var img = res.data[0].img
                        quantity = res.data[0].quantity+parseInt(this.refs.jumlah.value)
                        var editedData = {
                            username, userId, productId, namaProduk, 
                            harga, discount, kategori, img, quantity
                        }
                    Axios.put(urlApi+'/cart/'+res.data[0].id, editedData)
                        .then((res) => {
                            console.log(res)
                            swal('Success', 'Item added to Cart', 'success')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    } else {
                    Axios.post(urlApi + '/cart', newData)
                        .then((res) => {
                            console.log(res)
                            swal('Success', "Item added to Cart", 'success')
                            this.props.fnHitungCart(this.props.username)
                            })
                        .catch((err) => {
                                console.log(err)
                            })
                }
                })
            })
            .catch((err) => console.log(err))
    }
    
    
    render(){
        var {nama, img, discount, deskripsi, harga} = this.state.product
        return (
            <div className ='container'>
                <div className="row">
                    <div className="col-md-4">
                        <div className="card" style={{width: '100%'}}>
                            <img className="card-img-top" src={img} alt="Card cap" />
                        </div>
                    </div>
                    <div className="col-md-8">
                        <h1 style={{color : '#4C4C4C'}}>{nama}</h1>
                        { discount > 0 ?
                            <div style={{backgroundColor:'#D50000', 
                                    width:"50px" , height:"22px" , 
                                    color:'white', textAlign:"center",
                                    display:'inline-block'}}>{discount}%</div> : null
                        }
                        { discount > 0 ? 
                            <CurrencyFormat value={harga} displayType={'text'} thousandSeparator={true} prefix={'Rp'} renderText={value => <span style={{fontSize:'12px', fontWeight:'600', color:'#606060' , 
                            marginLeft:'10px', textDecoration:"line-through"}}>{value}</span>}/>
                             : null}
                        <CurrencyFormat value={harga - (harga*(discount/100))} displayType={'text'} thousandSeparator={true} prefix={'Rp'} renderText={value => <div style={{fontSize:'24px', fontWeight : '700', 
                                    color:'#FF5722', marginTop:'20px'}}>{value} </div>}/>
                        <div className="row">
                            <div className="col-md-2">
                                <div style={{marginTop:"10px" ,color:"#606060" , 
                                            fontWeight:"700", fontSize:"14px"}}>Jumlah</div>
                                <input type='number' ref ='jumlah' min={1} placeholder={1} className='form-control'  onChange={this.proteksiJumlah} style={{width : '60px' , 
                                            marginTop:'10px'}}/>
                            </div>
                            <div className="col-md-6">
                                <div style={{marginTop:"10px" ,color:"#606060" , 
                                            fontWeight:"700", fontSize:"14px"}}>Catatan untuk Penjual (Opsional)</div>
                                <input type='text' className='form-control' placeholder="Contoh: Warna putih, Ukuran XL, Edisi ke-2" 
                                        style={{marginTop:'13px'}}/>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-md-8">
                                <p style={{color:"#606060", fontStyle:"italic"}}>{deskripsi}</p> 
                            </div>
                        </div>

                        {this.props.username !== "" ?
                         <div className="row mt-4">
                            <input type='button' className='btn btn-outline-secondary col-md-2 ml-3' value='Add to Wishlist' />
                            <input type='button' className='btn btn-outline-danger col-md-3 ml-2' value='Buy Now'/>
                            <input type='button' className='btn btn-outline-success col-md-3 ml-2' value='Add to Cart' onClick={() => this.onBtnCart()}/>
                        </div>
                        : 
                        <div className="row mt-4">
                            <Link to='/login'><input type='button' className='btn btn-outline-secondary col-md-2 ml-3' value='Add to Wishlist'/></Link>
                            <Link to='/login'><input type='button' className='btn btn-outline-danger col-md-3 ml-2' value='Buy Now'/></Link>
                            <Link to='/login'><input type='button' className='btn btn-outline-success col-md-3 ml-2' value='Add to Cart'/></Link>
                        </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        username : state.user.username,
        id : state.user.id,
        cart : state.cart.cart
    }
}

export default connect(mapStateToProps, {fnHitungCart})(ProductDetail);