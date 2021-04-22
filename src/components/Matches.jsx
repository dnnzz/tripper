import React, { useEffect, useState, useContext } from 'react';
import Header from './Header';
import { signOut, getMatchDoc, getLikedCurrUserDoc } from '../firebase';
import { UserContext } from "../providers/UserProvider";

function Matches(props) {
    const user = useContext(UserContext);
    const [matchDoc, setMatchDoc] = useState([]);
    const [likedDoc, setLikedDoc] = useState([]);
    useEffect(() => {
        getMatchDoc(user.uid)
            .then(data => setMatchDoc(data));

        getLikedCurrUserDoc(user.uid)
            .then(data => setLikedDoc(data));
    }, []);

    return (
        <>
            <Header signOut={signOut} />
            <div className="container">
                <div className="row">
                    <h2>Eşleşmelerim</h2>
                    <div className="col-md-12 text-left d-flex justify-content-between flex-wrap">
                        {
                            matchDoc.map(item => {
                                return item.data.user === user.uid ?
                                    <img key={item.id} className="profile-img-card" src={item.data.likedUserPhotoUrl} 
                                    style={{ width: "105px" }} 
                                    alt="match img" />
                                    :
                                    <img key={item.id} className="profile-img-card" src={item.data.userPhotoUrl} 
                                    style={{ width: "105px" }} 
                                    alt="match img" />
                            }
                            )
                        }
                    </div>
                    <h2>Bekleyen eşleşmeler</h2>
                    <div className="col-md-12 text-left d-flex justify-content-between flex-wrap">
                    {
                            likedDoc.map(item => {
                                    return <img key={item.id} className="profile-img-card" src={item.data.userPhotoUrl} 
                                    style={{ width: "105px" }} 
                                    alt="match img" />
                            }
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default Matches;