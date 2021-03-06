import firebase from 'firebase';
import config from '../../firebase.json';
import 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from "react-native-crypto-js";
import { Alert } from 'react-native';

const app = firebase.initializeApp(config);
export const Storage = app.storage();

const Auth = app.auth();

const key = "AIzaSyBnpWFz0fnASDFvasdvAGWdgvbasdnvbax5PFDLYmFrWMntujb9aazGdY";

const uploadImage = async uri => { //프로필 이미지를 파이어 베이스 스토리지에 업로드 하는 함수
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new TypeError('네트워크 요청 실패'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const user = Auth.currentUser;
  const ref = app.storage().ref(`/profile/${user.uid}/photo.png`);
  const snapshot = await ref.put(blob, { contentType: 'image/png' });

  blob.close();
  return await snapshot.ref.getDownloadURL();
};

export const login = async ({ email, password }) => { //파이어베이스로 로그인하는 함수
  const {user} = await Auth.signInWithEmailAndPassword(email, password);

  let encrypted_user = CryptoJS.AES.encrypt(JSON.stringify(user), key).toString();
  AsyncStorage.setItem('userData', encrypted_user);
  const userData = await AsyncStorage.getItem('userData');

  return user;
};

export const DB = firebase.firestore();

export const signup = async ({ email, password, name, photoUrl }) => { //파이어베이스로 회원가입을 진행하는 함수
  const { user } = await Auth.createUserWithEmailAndPassword(email, password);
  const storageUrl = photoUrl.startsWith('https')
    ? photoUrl
    : await uploadImage(photoUrl);
  await user.updateProfile({
    displayName: name,
    photoURL: storageUrl,
  });

  newUserRef = DB.collection('users').doc(user.uid);
  newUser = {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photoUrl: user.photoURL,
    club: {}
  }

  await newUserRef.set(newUser);

  return user;
};

export const logout = async () => { //로그아웃 함수
  AsyncStorage.removeItem('userData');
  return await Auth.signOut();
}

export const getCurrentUser = () => { //현재 로그인된 유저의 정보를 반환하는 함수
  const { uid, displayName, email, photoURL } = Auth.currentUser;
  return { uid, name: displayName, email, photoUrl: photoURL };
};

export const updateUserPhoto = async photoUrl => { //사용자의 프로필 사진을 수정하는 함수
  const user = Auth.currentUser;
  const storageUrl = photoUrl.startsWith('https')
    ? photoUrl
    : await uploadImage(photoUrl);
  await user.updateProfile({ photoURL: storageUrl });

  try{
    const userRef = DB.collection('users').doc(user.uid);
    await DB.runTransaction(async (t) => {
      const doc = await t.get(userRef);
      const data = doc.data();

      const clubList = data.club;
      for (let club in clubList) {
        if(clubList[club] === true) {
          const clubRef = DB.collection('clubs').doc(club);
          await DB.runTransaction(async (t) => {
            const doc = await t.get(userRef);
            const data = doc.data();

            for (let member in data.members) {
              if (member.uid === user.uid) {
                member.photoUrl = user.photoURL;
              }
            }

            t.update(clubRef, {members: data.members})
          });

        }
      }
      t.update(userRef, {photoUrl: user.photoURL});
    });
    }
  catch(e) {
    Alert.alert("프로필 사진 업데이트 에러", e.message);
  }

  return { name: user.displayName, email: user.email, photoUrl: user.photoURL };
};

export const createClub = async ({ title, description, leader, region, maxNumber }) => { //클럽 생성 함수
  const user = Auth.currentUser;
  const newClubRef = DB.collection('clubs').doc();
  const id = newClubRef.id;
  const members = [];
  const member = {
    ...leader,
    now_page: 0,
  }
  const book_now = {
    title: "",
    goal: 0,
    cover: "",
  }
  const book_completed = [];

  members.push(member);

  const newClub = {
    id,
    title,
    description,
    leader,
    region,
    maxNumber,
    members,
    book_now,
    book_completed,
    createAt: Date.now(),
    waiting: [],
  };
  await newClubRef.set(newClub);

  await newClubRef
        .collection('bookCompleted');

  await newClubRef
        .collection('bookOngoing');

  const userRef = DB.collection('users').doc(user.uid);
  const userDoc = await userRef.get();
  const userData = userDoc.data();
  const club = userData.club;
  club[id] = true;

  userRef.update({club: club});

  return id;
}

export const getClubInfo = async (id) => {
  const clubRef = await DB.collection('clubs').doc(id).get();
  const data = clubRef.data();
  return { title: data.title, leader: data.leader, members: data.members,region: data.region, maxNumber: data.maxNumber, description: data.description }
}
