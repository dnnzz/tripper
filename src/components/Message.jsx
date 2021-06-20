import React, { useContext, useState, useMemo } from 'react';
import { withRouter } from "react-router-dom";
import { firestore, signOut, firebaseTimeStamp } from '../firebase';
import Header from './Header';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { UserContext } from '../providers/UserProvider';
// eslint-disable-next-line no-extend-native
Date.prototype.toTurkishFormatDate = function (format) {
    var date = this,
        day = date.getDate(),
        weekDay = date.getDay(),
        month = date.getMonth(),
        year = date.getFullYear(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds();

    // eslint-disable-next-line no-array-constructor
    var monthNames = new Array("Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık");
    // eslint-disable-next-line no-array-constructor
    var dayNames = new Array("Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi");

    if (!format) {
        format = "dd.MM.yyyy";
    }


    format = format.replace("mm", month.toString().padStart(2, "0"));

    format = format.replace("MM", monthNames[month]);

    if (format.indexOf("yyyy") > -1) {
        format = format.replace("yyyy", year.toString());
    } else if (format.indexOf("yy") > -1) {
        format = format.replace("yy", year.toString().substr(2, 2));
    }

    format = format.replace("dd", day.toString().padStart(2, "0"));

    format = format.replace("DD", dayNames[weekDay]);

    if (format.indexOf("HH") > -1) {
        format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'));
    }

    if (format.indexOf("hh") > -1) {
        if (hours > 12) {
            hours -= 12;
        }

        if (hours === 0) {
            hours = 12;
        }
        format = format.replace("hh", hours.toString().replace(/^(\d)$/, '0$1'));
    }

    if (format.indexOf("ii") > -1) {
        format = format.replace("ii", minutes.toString().replace(/^(\d)$/, '0$1'));
    }

    if (format.indexOf("ss") > -1) {
        format = format.replace("ss", seconds.toString().replace(/^(\d)$/, '0$1'));
    }

    return format;
};
function Message(props) {
    const id = props.match.params.id;
    const user = useContext(UserContext);
    const messagesRef = firestore.collection("matches").doc(id).collection("messages");
    const query = useMemo(() => {
        const messagesRef = firestore.collection("matches").doc(id).collection("messages");
        const query = messagesRef.orderBy('createdAt').limit(25);
        return query;
    }, [id]);
    const [messages] = useCollectionData(query, { idField: 'id' });
    const [formValue, setFormValue] = useState('');
    const sendMessage = async (e) => {
        e.preventDefault();
        const { uid, photoUrl, displayName } = user;
        messagesRef.add({
            text: formValue,
            createdAt: new Date(),
            senderId: uid,
            senderPhotoUrl: photoUrl,
            senderDisplayName: displayName
        }).then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
        setFormValue('');
    }
    console.log(messages);

    return (
        <>
            <Header signOut={signOut} />
            <div className="container py-5 px-4">
                <div className="row rounded-lg overflow-hidden shadow">
                    <div className="col-12 px-0">
                        <div className="px-4 py-5 chat-box bg-white">
                            <div className="col-12">
                                {messages && messages.map(msg => {
                                    if (msg.senderId !== user.uid) {
                                        return <div key={msg.id} className="media w-50 mb-1">
                                            <img
                                                src={msg.senderPhotoUrl}
                                                alt={msg.senderDisplayName}
                                                width="70"
                                                height="70"
                                                className="rounded-circle" />
                                            <div className="media-body ml-3">
                                                <div className="bg-light rounded py-2 px-3 mb-2">
                                                    <h5 style={{ color: "black" }}>{msg.senderDisplayName}</h5>
                                                    <p key={msg.id}
                                                        className="text-small mb-0 text-muted">{msg.text}</p>
                                                </div>
                                                <p className="small text-muted">
                                                    {
                                                        msg.createdAt.toDate().toTurkishFormatDate("dd MM yyyy")
                                                    }
                                                    <span>&nbsp;&nbsp;</span>
                                                    {
                                                        msg.createdAt.toDate().toLocaleTimeString("tr-TR")
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    } else {
                                        return <div key={msg.id} className="col-8">
                                            <div className="media w-500 ml-auto mb-3">
                                                <div className="media-body">
                                                    <div className="bg-primary rounded py-2 px-3 mb-2">
                                                        <h5>{msg.senderDisplayName}</h5>
                                                        <p key={msg.id} className="text-small mb-0 text-white">{msg.text}</p>
                                                    </div>
                                                    <p className="small text-muted">
                                                        {
                                                            msg.createdAt.toDate().toTurkishFormatDate("dd MM yyyy")
                                                        }
                                                        <span>&nbsp;&nbsp;</span>
                                                        {
                                                            msg.createdAt.toDate().toLocaleTimeString("tr-TR")
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>;
                                    }
                                })
                                }
                            </div>
                        </div>
                        <form onSubmit={sendMessage} className="bg-light">
                            <div className="input-group">
                                <input
                                    value={formValue}
                                    onChange={(e) => setFormValue(e.target.value)}
                                    type="text"
                                    placeholder="Type a message"
                                    aria-describedby="button-addon2"
                                    className="form-control rounded-0 border-0 py-4 bg-light" />
                                <div className="input-group-append">
                                    <button id="button-addon2"
                                        type="submit"
                                        className="btn btn-link">
                                        <i className="fa fa-paper-plane">
                                        </i>
                                    </button>
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