import React, { useContext, useEffect, useState } from 'react';
import { signOut } from '../firebase';
import TinderCard from 'react-tinder-card';
import Header from '../components/Header';
import '../Main.css';
import { UserContext } from '../providers/UserProvider';
import firebase from 'firebase';
import { firestore, createMatch } from '../firebase';


function MainScreen(props) {
    const [lastDirection, setLastDirection] = useState();
    const [showModal, setModal] = useState(false);
    const [possibleMatches, setPossibleMatches] = useState([]);
    const user = useContext(UserContext);
    const [userPref, setUserPref] = useState({
        gender: "",
        petFriendly: ""
    });
    const calculateAge = (user) => {
        const birthDay = user.age.toDate();
        var today = new Date();
        var difference = (today - birthDay) / (1000 * 60 * 60 * 24 * 365);
        return difference.toFixed(0);
    }
    const getUserList = async () => {
        if (!user) return;
        const users = await firebase.firestore().collection('users');
        const userLiked = users.doc(user.uid).collection("userLiked");
        const likeDoc = [];
        userLiked.get().then((snapshot) => {
            snapshot.forEach((doc) => {
                likeDoc.push({ ...doc.data() });
            })
        });
        users.get().then((querySnapshot) => {
            const tempDoc = [];
            querySnapshot.forEach((doc) => {
                tempDoc.push({ id: doc.id, ...doc.data() })
            })
            const likedUsersIds = new Set(likeDoc.map(m => m.user1));
            const filtered = tempDoc.filter(m => !likedUsersIds.has(m.id));
            setPossibleMatches(filtered || []);
        })
    }
    useEffect(() => {
        getUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
    const updateUserPref = async (event) => {
        event.preventDefault();
        if(userPref.gender !== "empty" && userPref.petFriendly !== "empty"){
            const userRef = firestore.doc(`users/${user.uid}`);
            userRef.update({
                userPref: {
                    gender: userPref.gender,
                    petFriendly: userPref.petFriendly
                }
            });
            setUserPref({ gender: "", petFriendly: "" });
        }else{
            alert("Lütfen bir tercih yapınız.");
        }
    }
    const swiped = (direction, matchedUser, likedUserPhotoUrl , userName) => {
        if (direction === "right") {
            createMatch(user.uid, 
                matchedUser, 
                user.photoUrl, 
                likedUserPhotoUrl , 
                userName , 
                user.displayName);
        }
        setLastDirection(direction);
    }
    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }
    return (
        <>
            <Header signOut={signOut} />
            {!possibleMatches.length ? <h1>LOADING</h1> : showModal ?
                (
                    <div>
                        <h1>Eşleşme tercihinizi ayarlayın.</h1>
                        <div className="form-group">
                            <form onSubmit={e => updateUserPref(e)}>
                                <label>Cinsiyet tercihi :</label>
                                <select
                                    className="form-select"
                                    onChange={(e) => setUserPref({ ...userPref, gender: e.currentTarget.value })}>
                                    <option value="empty"> </option>           
                                    <option value="male">Erkek</option>
                                    <option value="female">Kadın</option> 
                                </select>
                                <label>Evcil Hayvan Dostu :</label>
                                <select
                                    className="form-select"
                                    onChange={(e) => setUserPref({ ...userPref, petFriendly: e.currentTarget.value })}>
                                    <option value="empty"> </option>    
                                    <option value="yes">Evet</option>
                                    <option value="no">Hayır</option>
                                </select>

                                <button type="submit">Ayarla</button>
                            </form>
                        </div>
                    </div>
                ) :
                <div className="cardContainer justify-content-center" >
                    {
                    // eslint-disable-next-line array-callback-return    
                    possibleMatches.filter(u => {
                        if (user.city === u.city &&
                            user.userType !== u.userType &&
                            user.userPref.gender === u.gender &&
                            user.userPref.petFriendly === u.userPref.petFriendly) {
                            return u;
                        }
                    }).map((user) =>
                        <TinderCard style={{ position: "absolute" }} className='swipe'
                            key={user.id}
                            onSwipe={(dir) => swiped(dir, user.id, user.photoUrl , user.displayName)}
                            onCardLeftScreen={() => outOfFrame(user.displayName)}>
                            <div className='card' style={{ backgroundImage: 'url(' + user.photoUrl + ')' }}>
                                <div className="card-block-1">
                                    {user.gender === "male" ? <i className="fas fa-mars fa-2x"></i> : <i className="fas fa-venus fa-2x"></i>}
                                    <h3>{user.displayName},{calculateAge(user)}</h3>
                                </div>
                                <div className="card-block-2">
                                    <i className="fas fa-map-marker-alt fa-2x"></i>
                                    <h3>{user.city}</h3>
                                </div>
                            </div>
                        </TinderCard>
                    )}
                </div>
            }
            <button onClick={() => setModal(!showModal)} className="btn btn-danger btn-sm">Eşleşme Seçenekleri</button>
        </>
    );
}

export default MainScreen;