import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useToasts } from "react-toast-notifications";

/**
 *  Changes:
 *      At 19th Line: 'store_id' need to be taken from localStorage( saved while performing 'login' ) 
 */

function SellerDashboard() {

    const { addToast } = useToasts()

    const [data, setData] = useState([]);
    const [state, setState] = useState(false);

    useEffect(() => {
        axios.post('order/bystore/', {
            store_id: 1 // // get value from localstorage : store_id 
        })
            .then(res => {
                setData(res.data);

                setState(false)
            })
            .catch(error => console.error(error))
    }, [state]);

    const onDelivered = eve => {
        eve.preventDefault();
        const order_id = eve.target.value
        const data = {
            'order_id': order_id,
            'is_delivered': true
        }

        axios.post('order/delivered/', data)
            .then(res => {
                if (res.status === 200) {
                    addToast(res.data.msg, {
                        autoDismiss: true,
                        appearance: "success"
                    })
                    setState(true)
                } else {
                    addToast("Server Error", {
                        autoDismiss: true,
                        appearance: "error"
                    })
                    setState(false)
                }
            })
            .catch(error => console.error(error))
    }


    return (
        <>
            <div className="container">
                <div className="row mt-3">
                    {
                        data.map(obj => {
                            return (

                                <div key={obj.order_id} className="col-xl-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <p className="card-text lead">
                                                <b>Customer Name: </b><small>{obj.user_name}</small><br />
                                                <b>Customer Email: </b><small>{obj.user_email}</small><br />
                                                <b>Total Amount: </b><small>{obj.total_amount} ₹</small><br />
                                                <b>Customer Address: </b><small>{obj.address}</small><br />
                                                <b>Medicine Name: </b><small>{obj.medicine_name}</small><br />
                                                <b>Order Quantity: </b><small>{obj.order_quantity}</small><br />
                                            </p>
                                            <button name="order_id" value={obj.order_id} onClick={onDelivered} className="btn btn-primary">Delivered</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default SellerDashboard;