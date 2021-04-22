import React, { Component } from 'react';
import { auth, firestore, storage , signOut } from '../firebase';
import DatePicker from 'react-date-picker';
import {withRouter} from "react-router-dom";



class CreateProfile extends Component {
    state = { displayName: "", userType: "", age: new Date(), gender: "" ,city:"",userPref:{gender:"",petFriendly:""}};
    imageInput = null;

    get uid() {
        return auth.currentUser.uid;
    }

    get userRef() {
        return firestore.doc(`users/${this.uid}`);
    }

    get file() {
        return this.imageInput && this.imageInput.files[0];
    }

    handleChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }
    handleSubmit = async event => {
        event.preventDefault();
        const { displayName,userType,age,gender,city,userPref } = this.state;

        if (displayName && userType && age && gender && city) {
            this.userRef.update({ displayName,userType,age,gender,city,userPref});
        }

        if (this.file) {
            storage
                .ref()
                .child("user-profiles")
                .child(this.uid)
                .child(this.file.name)
                .put(this.file)
                .then(res => res.ref.getDownloadURL())
                .then(photoUrl => this.userRef.update({ photoUrl }));
            console.log(this.file);
        }

        this.setState({displayName:"",userType:"",age:"",gender:"",city:""});
        //signOut();
        this.props.history.push("/mainPage");

    }
    render() {

        const { displayName, age, city} = this.state;
        return (
            <div className="container">
                <h2 className="text-center" style={{ color: "#54799B" }}>Profil Oluştur</h2>
                <div className="col-xs-12">
                    <img src="https://firebasestorage.googleapis.com/v0/b/tripper-d14cc.appspot.com/o/pp.png?alt=media&token=4eafa993-6c58-4815-b680-32e59252e7fd"
                        className="rounded mx-auto d-block rounded-circle"
                        alt="Custom"
                        height="200"
                        width="200"
                    />
                    <div className="row justify-content-center mt-2 ml-5">
                        <form onSubmit={this.handleSubmit}>
                            <div className="col-xs-3 form-group">
                                <input
                                    type="file"
                                    ref={ref => this.imageInput = ref}
                                />
                            </div>
                            <div className="col-xs-3 mt-2 form-group">
                                <input
                                    placeholder="İsim"
                                    value={displayName}
                                    name="displayName"
                                    onChange={this.handleChange}
                                    style={{ color: "#F0FDFF", backgroundColor: "#415661", fontWeight: "bold" }}
                                />
                            </div>
                            <div className="col-xs-3 mt-2 form-group">
                                <input
                                    placeholder="Şehir"
                                    value={city}
                                    name="city"
                                    onChange={this.handleChange}
                                    style={{ color: "#F0FDFF", backgroundColor: "#415661", fontWeight: "bold" }}
                                />
                            </div>
                            <div className="col-xs-3 mt-2 form-group">
                                <DatePicker
                                    name="age"
                                    calendarAriaLabel="Toggle calendar"
                                    clearAriaLabel="Clear value"
                                    dayAriaLabel="Day"
                                    monthAriaLabel="Month"
                                    nativeInputAriaLabel="Date"
                                    onChange={date => this.handleChange({ target: { value: date, name: 'age' } })}
                                    value={age}
                                    yearAriaLabel="Year"
                                />
                            </div>
                            <div className="col-xs-3 mt-2 form-group">
                                <h3>Cinsiyetiniz</h3>
                                <div className="col-xs-3">
                                    <div className="d-flex">
                                        <button
                                            name="gender"
                                            value="female"
                                            onClick={this.handleChange}
                                            type="button"
                                            style={{ backgroundColor: "transparent", backgroundRepeat: "none", border: "none", cursor: "pointer", overflow: "hidden", outline: "none" }}
                                        >
                                            <img
                                                width="50"
                                                height="50"
                                                alt="female"
                                                src="https://firebasestorage.googleapis.com/v0/b/tripper-d14cc.appspot.com/o/female.png?alt=media&token=7e89af78-9ddc-4695-9d47-cc4f3171391e" />
                                        Kadın
                                        </button>
                                        <button
                                            name="gender"
                                            value="male"
                                            onClick={this.handleChange}
                                            type="button"
                                            style={{ backgroundColor: "transparent", backgroundRepeat: "none", border: "none", cursor: "pointer", overflow: "hidden", outline: "none" }}
                                        >
                                            <img
                                                className="ml-5"
                                                width="50"
                                                height="50"
                                                alt="male"
                                                src="https://firebasestorage.googleapis.com/v0/b/tripper-d14cc.appspot.com/o/male.png?alt=media&token=06d58198-dd53-4dc3-a68d-c8cd8e36498a" />
                                        Erkek
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-3 mt-2 form-group">
                                <h3>Üye türünüz</h3>
                                <div className="col-xs-3">
                                    <div className="d-flex">
                                        <button
                                            name="userType"
                                            value="traveler"
                                            onClick={this.handleChange}
                                            type="button"
                                            style={{ backgroundColor: "transparent", backgroundRepeat: "none", border: "none", cursor: "pointer", overflow: "hidden", outline: "none" }}
                                        >
                                            <img
                                                width="50"
                                                height="50"
                                                alt="traveler"
                                                src="https://firebasestorage.googleapis.com/v0/b/tripper-d14cc.appspot.com/o/traveler.png?alt=media&token=d87568e9-1afd-44c9-8e3d-7fd1c60c6039" />
                                        Gezgin
                                        </button>
                                        <button
                                            name="userType"
                                            value="host"
                                            onClick={this.handleChange}
                                            type="button"
                                            style={{ backgroundColor: "transparent", backgroundRepeat: "none", border: "none", cursor: "pointer", overflow: "hidden", outline: "none" }}
                                        >
                                            <img
                                                className="ml-5"
                                                width="50"
                                                height="50"
                                                alt="host"
                                                src="https://firebasestorage.googleapis.com/v0/b/tripper-d14cc.appspot.com/o/host.png?alt=media&token=9009ceb9-7634-4496-bede-b74e70bd48ea" />
                                        Ev sahibi
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn-lg btn-block"
                                    style={{ color: "#415661", backgroundColor: "#C4C4C4", fontWeight: "bold", borderRadius: "20%" }}>Profil Oluştur</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(CreateProfile);