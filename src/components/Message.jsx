import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from "react-router-dom";
import { firestore, signOut, getOneMatchDoc} from '../firebase';
import Header from './Header';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {UserContext} from '../providers/UserProvider';
function Message(props) {
    const id = props.match.params.id;
    const user = useContext(UserContext);
    const messagesRef = firestore.collection("matches").doc(id).collection("messages");
    const query = messagesRef.orderBy('createdAt').limit(25);
    const [messages] = useCollectionData(query,{idField:'id'});
    const [chatDetails,setChatDetails] = useState([]);
    useEffect(() => {
        setChatDetails(getOneMatchDoc(id));
    }, []);
    return (
        <>
            <Header signOut={signOut} />
            <div className="container py-5 px-4">
                <div className="row rounded-lg overflow-hidden shadow">
                    <div className="col-12 px-0">
                        <div className="px-4 py-5 chat-box bg-white">
                            <div className="col-12">
                                <div className="media w-50 mb-1">
                                    <img src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg" alt="user" width="50" className="rounded-circle" />
                                    <div className="media-body ml-3">
                                        <div className="bg-light rounded py-2 px-3 mb-2">
                                            {messages && messages.map(item => <p key={item.id}
                                            className="text-small mb-0 text-muted">{item.text}</p>)}
                                        </div>
                                        <p className="small text-muted">12:00 PM | Aug 13</p>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="media w-500 ml-auto mb-3">
                                        <div className="media-body">
                                            <div className="bg-primary rounded py-2 px-3 mb-2">
                                                <p className="text-small mb-0 text-white">Test which is a new approach to have all solutions</p>
                                            </div>
                                            <p className="small text-muted">12:00 PM | Aug 13</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <form action="#" className="bg-light">
                            <div className="input-group">
                                <input type="text" placeholder="Type a message" aria-describedby="button-addon2" className="form-control rounded-0 border-0 py-4 bg-light" />
                                <div className="input-group-append">
                                    <button id="button-addon2" type="submit" className="btn btn-link"> <i className="fa fa-paper-plane"></i></button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default withRouter(Message);