import React, { useEffect, useState } from 'react';
import { useFormik } from "formik";
import axios from 'axios';
import { useToasts } from "react-toast-notifications";

/**
 *  Changes:
 *      At 34th Line: 'store_id' need to be taken from localStorage( saved while performing 'login' ) 
 */

function AddMedicine() {

    const { addToast } = useToasts();
    const [medicines, setMedicines] = useState([]);

    useEffect(() => {
        axios.post('medicine/all/')
            .then(res => {
                setMedicines(res.data)
            })
            .catch(error => console.error(error))
    }, [])

    const storeMedicineForm = useFormik({
        initialValues: {
            medicine_id: 0,
            quantity: 0,
            price: 0,
            mfg_date: null,
            exp_date: null,
        },
        onSubmit: data => {
            data['store_id'] = 2 // get value from localstorage : store_id 
            console.log(data)
            axios.post('storemedicine/addmedicine/', data)
                .then(res => {
                    storeMedicineForm.resetForm(storeMedicineForm.initialValues);
                    console.log(res.data)

                    if (res.status === 200) {
                        addToast(res.data.msg, {
                            autoDismiss: true,
                            appearance: "success"
                        })
                    } else {
                        addToast("Server Error", {
                            appearance: 'error',
                            autoDismiss: true
                        });
                    }
                })
                .catch(error => console.error(error))
        }
    })

    const addMedicineForm = useFormik({
        initialValues: {
            medicine_name: "",
            image: null
        },
        onSubmit: data => {
            console.log(data);
            const formData = new FormData();
            formData.append('medicine_name', data.medicine_name);
            formData.append('image', data.image)
            axios.post('medicine/add/', formData)
                .then(res => {
                    addMedicineForm.resetForm(addMedicineForm.initialValues);
                    console.log(res.data)

                    if (res.status === 200) {
                        addToast(res.data.msg, {
                            autoDismiss: true,
                            appearance: "success"
                        })
                    } else {
                        addToast("Server Error", {
                            appearance: 'error',
                            autoDismiss: true
                        });
                    }
                })
                .catch(error => console.error(error))
        }
    });

    const onFileChoose = eve => {
        addMedicineForm.setFieldValue('image', eve.target.files[0])
    }
    return (
        <div className="container">
            <div className="row justify-content-evenly">

                {/* 'add medicine form */}
                <div className="col-12 col-xl-5">
                    <h2 className="display-5">Add Medicine</h2>
                    <hr style={{ width: "12rem" }} />
                    <form onSubmit={addMedicineForm.handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="medicine_name" className="form-label">Medicine Name</label>
                            <input required type="text" name="medicine_name" className="form-control" id="exampleFormControlInput1" placeholder="Paracetamol"
                                value={addMedicineForm.values.medicine_name}
                                onChange={addMedicineForm.handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Image For Medicine</label>
                            <input required type="file" className="form-control" aria-label="file example" onChange={onFileChoose} />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>

                {/* 'Add store medicine' form */}
                <div className="col-xl-5 col-xl-offset-1">
                    <h2 className="display-5">Add Medicine In Store</h2>
                    <hr style={{ width: "12rem" }} />
                    <form onSubmit={storeMedicineForm.handleSubmit} >
                        <div className="mb-3">
                            <label htmlFor="exampleDataList" className="form-label">Medicine :</label>
                            <input
                                name="medicine_id"
                                type="number"
                                onChange={storeMedicineForm.handleChange}
                                required
                                className="form-control"
                                list="datalistOptions"
                                placeholder="Type to search..."
                            />
                            <datalist id="datalistOptions">
                                {
                                    medicines.map(ele => {
                                        return (
                                            <option
                                                key={ele.medicine_id}
                                                value={ele.medicine_id}
                                            >
                                                {ele.medicine_name}
                                            </option>
                                        )
                                    })
                                }
                            </datalist>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="quantity" className="form-label">Availabel Quantity :</label>
                            <input required type="number" name="quantity" className="form-control"
                                value={storeMedicineForm.values.quantity}
                                onChange={storeMedicineForm.handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Price :</label>
                            <input required type="number" name="price" className="form-control"
                                value={storeMedicineForm.values.price}
                                onChange={storeMedicineForm.handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="mfg_date" className="form-label">Manufacture Date :</label>
                            <input valu={storeMedicineForm.values.mfg_date} name="mfg_date" onChange={storeMedicineForm.handleChange} className="form-control" placeholder="dd/mm/yyyy" type="date" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exp_date" className="form-label">Expiry Date :</label>
                            <input valu={storeMedicineForm.values.exp_date} name="exp_date" onChange={storeMedicineForm.handleChange} className="form-control" placeholder="dd/mm/yyyy" type="date" />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddMedicine;