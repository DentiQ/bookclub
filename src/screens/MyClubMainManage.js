//클럽을 총괄 관리하는 화면
//모임 탈퇴 함수가 필요합니다.

import React, {useLayoutEffect, useState, useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, Text, Button, Image} from 'react-native';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { theme } from '../theme';



const Container=styled.View`
    flex: 1;
    flex-direction: column;
    background-color: ${({theme})=>theme.background};
    align-items: center;
`;

const Header=styled.View` 
    width: ${({width})=>width}px;
    height: 120px;
    background-color: ${({theme})=>theme.background};    
    flex-direction: row;
    align-items: center;
    justify-content: center;
    borderTop-color: ${({theme})=>theme.appBackground};
    borderTop-width: 3px;
    borderBottom-color: ${({theme})=>theme.appBackground};
    borderBottom-width: 3px;
    padding: 0;
`;


const MainHeader= ({clubname})=>{
    const width = Dimensions.get('window').width;

    return (
        <Header width={width}>
         
        <Text style={styles.clubname}>{clubname}</Text>
        
        </Header>
    )
};


const AllCon=styled.View`
  background-color: ${({ theme }) => theme.background};
  borderBottom-Width: 2.5px;
  borderBottom-Color: ${({ theme }) => theme.appBackground};
  width: ${({ width }) => (width)}px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  paddingRight: 10px;
  paddingBottom: 7px;
  marginBottom: 30px;
`;

const ContainerRow=styled.View`
  width: ${({ width }) => width}px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.background};
`;

const Fix1=styled.View`
  width: ${({ width }) => (width)*0.22}px;
  height: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  borderRight-Width: 1px;
  borderRight-Color: ${({ theme }) => theme.separator};

`;

const Fix2=styled.View`
  width: ${({ width }) => (width)*0.78}px;
`;

const ButtonFix1=styled.View`
  marginTop: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ButtonFix2=styled.View`
  width: ${({ width }) => (width)}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  marginTop: 60px;
  marginBottom: 50px;
`;

const List=styled.ScrollView`
    flex: 1;
    width: ${({width})=>width}px;
`;

const Line=styled.View`
  background-color: ${({ theme }) => theme.appBackground};
  height: 0.8px;
  width: ${({ width }) => (width)}px;
`;

const styles = StyleSheet.create({
  First: {
    fontSize: 16,
    color: theme.text,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  Second:{
    fontSize: 16,
    color: theme.text,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
  },
  Img: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  clubname: {
    fontSize: 25,
    color: theme.text,
  },
});



const tempData = {
    "clubname": "SEORAP",
    "booktitle": "보노보노, 오늘 하루는 어땠어?",
    "goal": 226,

}

const MyClubMainManage=({ navigation })=>{

    const width= Dimensions.get('window').width;


    useLayoutEffect(()=>{
        navigation.setOptions({
            headerBackTitleVisible: false,
            headerTintColor: '#000000',
            headerLeft: ({onPress, tintColor})=>{
                return(
                    
                    <MaterialCommunityIcons
                        name="keyboard-backspace"
                        size={30}
                        style={{marginLeft:13}}
                        color={tintColor}
                        onPress={onPress}   //추후수정-뒤로가기
                    />
                );
            },
        });
      console.log(navigation);
    }, []);

    
    return(
        <KeyboardAwareScrollView
            contentContainerStyle={{flex: 1}}
            extraScrollHeight={20}
        >
        <Container>
            <MainHeader clubname={tempData.clubname}></MainHeader>

        <List width={width}>
            <AllCon width={width}>
              <Text style={styles.Second}>소개글은 해당 위치에 들어갑니다. 길어질 경우 화면에 스크롤이 적용됩니다.</Text>
              <Line width={width}></Line>

                <ContainerRow width={width}>
                    <Fix1 width={width}>
                      <Text style={styles.First}>관리자</Text>
                    </Fix1>
                    <Fix2 width={width}>
                      <Text style={styles.Second}>관리자의 이름</Text>
                    </Fix2>
                </ContainerRow> 
                <Line width={width}></Line>

                <ContainerRow width={width}>
                    <Fix1 width={width}>
                      <Text style={styles.First}>지역구</Text>
                    </Fix1>
                    <Fix2 width={width}>
                      <Text style={styles.Second}>지역구의 이름</Text>
                    </Fix2>
                </ContainerRow> 
                <Line width={width}></Line>

                <ContainerRow width={width}>
                    <Fix1 width={width}>
                      <Text style={styles.First}>모임형태</Text>
                    </Fix1>
                    <Fix2 width={width}>
                      <Text style={styles.Second}>모임형태의 이름</Text>
                    </Fix2>
                </ContainerRow> 
                <Line width={width}></Line>

                <ContainerRow width={width}>
                    <Fix1 width={width}>
                      <Text style={styles.First}>최대인원</Text>
                    </Fix1>
                    <Fix2 width={width}>
                      <Text style={styles.Second}>최대인원의 수</Text>
                    </Fix2>
                </ContainerRow> 

            </AllCon>
            
            <ButtonFix1 width={width}>
              <Button
                color= '#fac8af'
                title="회원 목록          "  
                onPress={()=>navigation.navigate("MyClubUserAdmin")}
              />
            
              <Button
                color= '#fac8af'
                title="          승인 대기"
                onPress={()=>navigation.navigate("MyClubWaitAdmin")}
              />
            </ButtonFix1>

            <ButtonFix2 width={width}>
              <Button
                  color= '#fac8af'
                  title="모임 탈퇴"
                  onPress={()=>alert('탈퇴 함수 필요. 모임을 탈퇴하시겠습니까?')}    //모임 탈퇴 함수가 필요합니다.
              />
              <Button
                color= '#fac8af'
                title="정보 수정"
                onPress={()=>navigation.navigate('MyClubMainM')}    //모임 정보 수정 화면으로 이동할 예정
              />
            </ButtonFix2>
        </List>
        </Container>
        </KeyboardAwareScrollView>

    );
};

export default MyClubMainManage;