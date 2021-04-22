import React, { Component } from 'react';
import "../App.css";
import { auth, createUserProfileDocument } from '../firebase';
import {withRouter} from "react-router-dom";

class SignUp extends Component {
    state = { displayName: '', email: '', password: '' };
    handleChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
      };
      handleSubmit = async event => {
        event.preventDefault();
        const {email,password,displayName} = this.state;
        try {
          const {user} = await auth.createUserWithEmailAndPassword(
            email,
            password,
          );
          createUserProfileDocument(user, {displayName});
        } catch(error){
          console.error(error);
        }
        this.setState({ displayName: '', email: '', password: '' });
        this.props.history.push("/createProfile");
      };
    render() {
        const { displayName, email, password } = this.state;
        return (
            <div className="container">
                <h1 className="text-center" style={{ color: "#54799B" }}>Kayıt Ol</h1>
                <div className="row justify-content-center mt-5">
                    <form className="form-horizontal" onSubmit={this.handleSubmit}>
                        <h2 className="text-center display-4" style={{ color: "#F0FDFF" }}><u>Tripper</u></h2>
                        <div className="form-group">
                            <div className="col-sm-9">
                                <input type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    className="form-control"
                                    style={{ color: "#F0FDFF", backgroundColor: "#415661" }}
                                    value={email}
                                    onChange={this.handleChange}
                                    />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-9">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Şifre"
                                    className="form-control"
                                    style={{ color: "#F0FDFF", backgroundColor: "#415661" }}
                                    value={password}
                                    onChange={this.handleChange}
                                    />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-9">
                                <button
                                    type="submit"
                                    className="btn-lg btn-block register-btn"
                                    style={{ color: "#415661", backgroundColor: "#C4C4C4", fontWeight: "bold", borderRadius: "30%" }}>Üye ol</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(SignUp);