import React from 'react';
import { Link } from 'react-router-dom';


const Header = ({signOut}) => (
    <header>
            <div className="row justify-content-center ">
                <h2>Tripper</h2>
                <Link to="/" onClick={signOut} className="mt-2 ml-5"><i className="fas fa-2x fa-sign-out-alt"></i></Link>
            </div>
            <div className=" justify-content-center">
                <nav className="d-flex justify-content-between">
                    <Link to="/mainPage"><i className="fas fa-search fa-2x"></i></Link>
                    <Link to="/matches"><i className="fas fa-user-friends fa-2x"></i></Link>
                    <Link to="/messages" ><i className="fas fa-envelope fa-2x"></i></Link>
                </nav>
            </div>
    </header>
);


export default Header;