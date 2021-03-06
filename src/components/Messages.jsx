import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from "../providers/UserProvider";
import { getMatchDoc, signOut } from '../firebase';
import Header from './Header';
import { Link } from 'react-router-dom';
function Messages(props) {
    const user = useContext(UserContext);
    const [messageDoc, setMessageDoc] = useState([]);
    const tempMsgArr = [];
    const tempMsgArr1= [];
    useEffect(() => {
        getMatchDoc(user.uid)
            .then(data => {          
                data.forEach(item => {
                    item.data.user === user.uid ? tempMsgArr.push(
                        {
                            id: item.id,
                            matchedUser: item.data.user1,
                            matchedUserPhotoUrl: item.data.likedUserPhotoUrl,
                            likedUserName: item.data.likedUserName
                        })
                        :
                        tempMsgArr1.push(
                            {
                                id: item.id,
                                matchedUser: item.data.user,
                                matchedUserPhotoUrl: item.data.userPhotoUrl,
                                likedUserName: item.data.currUserName
                            },
                        )
                    return; 
                })
                const finalTmpArr = [...tempMsgArr,...tempMsgArr1];
                setMessageDoc(finalTmpArr);
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.uid]);
    return (
        <>
            <Header signOut={signOut} />
            <div className="container">
                <div className="row">
                    <div className="col-12 pt-5 d-flex">
                        {
                            messageDoc.map(item => {
                                return <Link key={item.id} to={`messages/${item.id}`} >
                                    <div key={item.id} className="list-group-item-action border-0">
                                        <div key={item.id} className="d-flex align-items-start">
                                            <img src={item.matchedUserPhotoUrl}
                                                className="rounded-circle img-fluid" alt={item.likedUserName} width="100" height="120" />
                                            <div className="chat-details">
                                                <h4 style={{ color: 'black' }}>{item.likedUserName}</h4>
                                                <div className="medium ml-3">Chat ekran?? ac??k!</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default Messages;