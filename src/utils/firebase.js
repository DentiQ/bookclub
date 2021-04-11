import firebase from 'firebase';
import config from '../../firebase.json';
import 'firebase/firestore';


const app = firebase.initializeApp(config);

const Auth = app.auth();

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
  return user;
};

export const signup = async ({ email, password, name, photoUrl }) => { //파이어베이스로 회원가입을 진행하는 함수
  const { user } = await Auth.createUserWithEmailAndPassword(email, password);
  const storageUrl = photoUrl.startsWith('https')
    ? photoUrl
    : await uploadImage(photoUrl);
  await user.updateProfile({
    displayName: name,
    photoURL: storageUrl,
  });
  return user;
};

export const logout = async () => {
  return await Auth.signOut();
}

export const getCurrentUser = () => {
  const { uid, displayName, email, photoURL } = Auth.currentUser;
  console.log(app.auth().currentUser);
  return { uid, name: displayName, email, photoUrl: photoURL };
};

export const updateUserPhoto = async photoUrl => {
  const user = Auth.currentUser;
  const storageUrl = photoUrl.startsWith('https')
    ? photoUrl
    : await uploadImage(photoUrl);
  await user.updateProfile({ photoURL: storageUrl });
  return { name: user.displayName, email: user.email, photoUrl: user.photoURL };
};

export const DB = firebase.firestore();

export const createClub = async ({ title, description }) => {
  const newClubRef = DB.collection('clubs').doc();
  const id = newClubRef.id;
  const newClub = {
    id,
    title,
    description,
    createAt: Date.now(),
  };
  await newClubRef.set(newClub);
  return id;
}
