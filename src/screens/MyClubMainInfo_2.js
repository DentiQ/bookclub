//클럽 내 멤버가 자신의 진행 페이지를 수정하는 화면


import React, {useLayoutEffect, useState,useContext} from 'react';
import {StyleSheet, Dimensions, Text, Image, Button, TextInput, Alert} from 'react-native';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { theme } from '../theme';
import { DB, getCurrentUser} from '../utils/firebase';
import { ProgressContext } from '../contexts';

const Container=styled.View`
    flex: 1;
    flex-direction: column;
    background-color: ${({theme})=>theme.background};
    align-items: center;
`;

const Header=styled.View`
    width: ${({width})=>width}px;
    height: 80px;
    background-color: ${({theme})=>theme.background};
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    borderTop-color: ${({theme})=>theme.appBackground};
    borderTop-width: 3px;
    padding: 0;
`;


const Process=styled.View`
    min-height: 120px;
    flex-direction: row;
`;

const ProcessBook=styled.View`
    flex: 30%;
    background-color: ${({theme})=>theme.appBackground};
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 0 10px 0;
    borderRight-color: ${({theme})=>theme.background};
    borderRight-width: 3px;
`;

const ProcessText=styled.View`
    flex: 70%;
    background-color: ${({theme})=>theme.appBackground};
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 10px 0px 10px 0;
`;

const ProcessCon=styled.View`
    background-color: ${({theme})=>theme.background};
    width: ${({width})=>(width)*0.65}px;
    margin: 5px 0 5px 10px;
    border-radius: 5px;
`;

const List=styled.ScrollView`
    flex: 1;
    width: ${({width})=>width}px;
`;

const styles = StyleSheet.create({
    clubname: {
      fontSize: 25,
      color: theme.text,
    },
    processText: {
      fontSize: 14,
      color: theme.text,
      padding: 0,
      marginLeft: 10,
      marginVertical: 7,
      backgroundColor: theme.background,
    },
    bookimg: {
        width: 90,
        height: 120,
    },
    input: {
        height: 40,
        margin: 5,
        padding: 5,
        borderWidth: 1,
        borderColor: theme.appBackground,
        borderRadius: 10,
      },
  });


const MainHeader= ({clubname, onPress})=>{
    const width = Dimensions.get('window').width;

    return (
        <Header width={width}>
        <MaterialCommunityIcons
            name="keyboard-backspace"
            size={30}
            style={{marginLeft:13}}
            color='#ffffff'
        />
        <Text style={styles.clubname}>{clubname}</Text>
        <Button
            title="완료"
            onPress={onPress}
            color= '#fac8af'
        />
        </Header>
    )
};

const MainProcess=({booktitle, goalpage, cover, page, _handlepageChange})=>{
    const width = Dimensions.get('window').width;

    return(
        <Process>
        <ProcessBook>
            <Image
                style={styles.bookimg}
                source={{
                uri: cover,
                }}
            />
        </ProcessBook>
        <ProcessText>
            <ProcessCon width={width}>
            <Text style={styles.processText}>제목: {booktitle}</Text>
            </ProcessCon>
            <ProcessCon width={width}>
            <Text style={styles.processText}>목표 페이지: {goalpage}P</Text>
            </ProcessCon>

            <ProcessCon width={width}>
            <TextInput
                style={styles.input}
                placeholder="페이지를 입력하세요"
                onChangeText={_handlepageChange}
                value={page}
            />
            </ProcessCon>
        </ProcessText>
    </Process>
    )
}


const MyClubMainInfo_2=({ navigation, route })=>{
    const { spinner } = useContext(ProgressContext);
    const id = route.params?.id;
    const width= Dimensions.get('window').width;
    const user = getCurrentUser();

    const [userPage, setUserPage] = useState('');
    const [mainData, setMainData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const _handlepageChange = text => {
      const regex = /^[0-9]/; //페이지는 정수만 입력되도록 필터링
      if (regex.test(text)) {
        setUserPage(parseInt(text));
        setErrorMessage('');
        console.log(text);
      }
      else {
        setErrorMessage('숫자를 입력해주세요');
      }
    }

    const _alertfinish = async () => {
      if (errorMessage == '' || (!userPage)) {
        try {
          spinner.start();
          const clubRef = DB.collection('clubs').doc(id);
          await DB.runTransaction(async (t) => {
            const doc = await t.get(clubRef);
            const data = doc.data();

            const oldMembers = data.members;

            for(let i = 0; i < oldMembers.length; i++) {
              if (oldMembers[i].uid == user.uid) {
                oldMembers[i].now_page = userPage;
              }
            }

            t.update(clubRef, {members: oldMembers});
          });
        }
        catch(e) {
          Alert.alert('페이지 갱신 오류', e.message);
        }
        finally{
          spinner.stop();
        }
        alert('수정이 완료되었습니다.');
        navigation.navigate('MyClubTab', {screen: 'MyClubMainInfo', params: {id: id}});
      }
      else {
        Alert.alert('페이지 값 오류', errorMessage);
      }
    }

    const getMainData= async() => {
      try{
        spinner.start();
        const clubRef = DB.collection('clubs').doc(id);
        const clubDoc = await clubRef.get();
        const clubData = clubDoc.data();
        const tempData = {
          clubname: "",
          booktitle: "",
          bookcover: "",
          goal: 0,
          userlist: []
        }

        tempData.clubname = clubData.title;
        tempData.booktitle = clubData.book_now.title;
        tempData.goal = clubData.book_now.goal;
        tempData.bookcover = clubData.book_now.cover;
        let index = 1;
        for (let member of clubData.members) {
          let user_rate = 0;
          if (tempData.goal !== 0) {
            user_rate = member.now_page / tempData.goal;
            user_rate = user_rate.toFixed(1);
          }
          if (member.uid === user.uid) {
            setUserPage(member.now_page);
          }
          if (user_rate > 1.0) {
            user_rate = 1.0;
          }

          const tempuser = {
            id: index,
            user_name: member.name,
            img_url: member.photoUrl,
            user_rate: user_rate,
          }

          tempData.userlist.push(tempuser);
        }

        setMainData(tempData);

      }
      catch(e) {
        Alert.alert('메인 페이지 데이터 수신 오류', e.message);
      }
      finally {
        spinner.stop();
      }
    };

    useLayoutEffect(()=>{
      getMainData();
    }, []);

    return(
        <KeyboardAwareScrollView
            contentContainerStyle={{flex: 1}}
            extraScrollHeight={20}
        >
        <Container>
            <MainHeader
                clubname={mainData.clubname}
                onPress={_alertfinish}
            ></MainHeader>

            <MainProcess
                booktitle={mainData.booktitle}
                goalpage={mainData.goal}
                page={userPage}
                cover={mainData.bookcover}
                _handlepageChange={_handlepageChange}
            ></MainProcess>

        </Container>
        </KeyboardAwareScrollView>

    );
};

export default MyClubMainInfo_2;
