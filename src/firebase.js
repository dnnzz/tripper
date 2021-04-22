import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyB7yV5HAxaf8oYiu5XR8_KpjI3WzeJ-Ei0",
  authDomain: "tripper-d14cc.firebaseapp.com",
  projectId: "tripper-d14cc",
  storageBucket: "tripper-d14cc.appspot.com",
  messagingSenderId: "834411846220",
  appId: "1:834411846220:web:c072d9de9826eeab8a72e9",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage();

export const firestore = firebase.firestore();
export const createUserProfileDocument = async (user, additionalData) => {
  if (!user) return;
  // get reference ..
  const userRef = firestore.doc(`users/${user.uid}`);

  // fetch userRef
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { displayName, email } = user;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.error(error);
    }
  }
  return getUserDocument(user.uid);
};

export const getUserDocument = async (uid) => {
  if (!uid) return null;
  try {
    return firestore.collection("users").doc(uid);
  } catch (error) {
    console.error(error);
  }
};
export const createMatch = async (
  user,
  user1,
  currUserPhotoUrl,
  likedUserPhotoUrl,
  likedUserName,
  currUserName
) => {
  const matchArr = [];
  const matchRef = firestore.collection("matches");
  const snapshot = await matchRef.get();
  const userRef = firestore.doc(`users/${user}`);
  const likeRef = userRef.collection("userLiked");
  snapshot.forEach((doc) => {
    matchArr.push({ id: doc.id, ...doc.data() });
  });
  const filtered = matchArr
    .filter((m) => m.user1 === user && m.user === user1)
    .map((m) => m.id);
  try {
    if (filtered.length > 0) {
      const exactMatch = matchArr
        .filter((m) => m.user1 === user && m.user === user1)
        .map((m) => m.id);
      const exactMatchRef = firestore.doc(`matches/${exactMatch[0]}`);
      try {
        exactMatchRef.update({
          matchStatus: true,
        });
        await likeRef.add({
          user1,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      await matchRef.add({
        user: user,
        currUserName : currUserName,
        userPhotoUrl: currUserPhotoUrl,
        user1: user1,
        likedUserName: likedUserName,
        likedUserPhotoUrl: likedUserPhotoUrl,
        matchStatus: false,
      });
      await likeRef.add({
        user1,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
export const getMatchDoc = async (user) => {
  const matchArr = [];
  const matchesRef = firestore
    .collection("matches")
    .where("user", "==", user)
    .where("matchStatus", "==", true);
  var snapshot = await matchesRef.get();
  if (snapshot.empty) {
    const matchesRef1 = firestore
      .collection("matches")
      .where("user1", "==", user)
      .where("matchStatus", "==", true);
    snapshot = await matchesRef1.get();
    snapshot.forEach((doc) => {
      matchArr.push({ id: doc.id, data: doc.data() });
    });
    return matchArr;
  }
  snapshot.forEach((doc) => {
    matchArr.push({ id: doc.id, data: doc.data() });
  });
  return matchArr;
};

export const getOneMatchDoc = async (id) =>{
  const matchRef = firestore.collection("matches").doc(id);
  var snapshot = await matchRef.get();
  return snapshot.data();
}
export const firebaseTimeStamp = () => firebase.firestore.FieldValue.serverTimestamp();

export const getLikedCurrUserDoc = async (user) => {
  const matchArr = [];
  const matchesRef = firestore
    .collection("matches")
    .where("user1", "==", user)
    .where("matchStatus", "==", false);
  var snapshot = await matchesRef.get();
  if (snapshot.empty) {
    return [];
  }
  snapshot.forEach((doc) => {
    matchArr.push({ id: doc.id, data: doc.data() });
  });
  return matchArr;
};

export const signInWithEmail = async (email, password) => {
  try {
    return auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.error(error);
  }
};

export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const signOut = () => auth.signOut();
export default firebase;
