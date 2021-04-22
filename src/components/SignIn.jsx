import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import { signInWithEmail } from '../firebase';
class SignIn extends Component {
    state = { email: "", password: ""}

    handleChange = event => {
        const { name, value } = event.target;

        this.setState({ [name]: value });
    };

    handleSubmit = event => {
        event.preventDefault();
        const { email, password } = this.state;
        signInWithEmail(email, password).then((res) =>{
            this.props.history.push('/mainPage');
        }).catch(err => alert("Kullanıcı adı veya şifreniz yanlış"));
        this.setState({ email: '', password: '' });
    };
    render() {
        const { email, password } = this.state;
        return (
            <div className="container">
                <Link to="/"><h1 className="text-center">Hoşgeldiniz</h1></Link>
                <div className="row justify-content-center mt-5">
                    <form className="form-horizontal" onSubmit={this.handleSubmit}>
                        <h2 className="text-center display-4" style={{ color: "#F0FDFF" }}><u>Tripper</u></h2>
                        <div className="form-group">
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    className="form-control"
                                    value={email}
                                    onChange={this.handleChange}
                                    style={{ color: "#F0FDFF", backgroundColor: "#415661" }}
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
                                    value={password}
                                    onChange={this.handleChange}
                                    style={{ color: "#F0FDFF", backgroundColor: "#415661" }}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-9">
                                <button type="submit" className="btn-lg btn-block " style={{ color: "#415661", backgroundColor: "#C4C4C4", fontWeight: "bold", borderRadius: "30%" }}>Giriş yap</button>
                            </div>
                        </div>
                    </form>
                </div>
                <Link to="/signUp"><h5 className="text-center" style={{ color: "#F0FDFF" }}>Yeni misiniz ? Üye ol</h5></Link>
            </div>
        );
    }
}

export default withRouter(SignIn);