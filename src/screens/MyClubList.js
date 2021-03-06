//내가 가입한 클럽의 목록 화면

import React, { useContext, useState, useEffect } from 'react';
import { DB, getCurrentUser } from '../utils/firebase';
import { FlatList, Alert, Dimensions } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import {Picker} from '@react-native-picker/picker';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;
const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.listBorder};
  padding: 15px 20px;
`;
const ItemTextContainer = styled.View`
  flex: 1;
  flex-direction: column;
`;
const ItemTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
`;
const ItemDescription = styled.Text`
  font-size: 16px;
  margin-top: 5px;
  color: ${({ theme }) => theme.listTime};
`;
const ItemTime = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.listTime};
`;

const Line=styled.View`
  width: ${({width})=>width}px;
  height:1px;
  background-color: ${({ theme }) => theme.separator};
`;


const getDateOrTime = ts => {
  const now = moment().startOf('day');
  const target = moment(ts).startOf('day');
  return moment(ts).format(now.diff(target, 'days') > 0 ? 'MM/DD' : 'HH:mm');
};

const Item = React.memo(
  ({ item: { id, title, description, createAt }, onPress }) => {
    const theme = useContext(ThemeContext);

    return (
      <ItemContainer onPress={() => onPress({ id, title })}>
        <ItemTextContainer>
          <ItemTitle>{title}</ItemTitle>
          <ItemDescription>{description}</ItemDescription>
        </ItemTextContainer>
        <ItemTime>{getDateOrTime(createAt)}</ItemTime>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={24}
          color={theme.listIcon}
        />
      </ItemContainer>
    );
  }
);

const MyClubList = ({ navigation }) => {

  const width= Dimensions.get('window').width;

  const [clubIds, setClubIds] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [doc, setDoc] = useState({});
  const [refreshing, setRefreshing] = useState(false); //새로고침 상태를 확인하기 위한 상태
  const [region, setRegion] = useState('');

  const user = getCurrentUser();

  const getMyClubId = async () => { //먼저 유저 정보에서 가입된 클럽 id들을 불러온다
    try {
      setRefreshing(true);
      const userRef = DB.collection('users').doc(user.uid);
      const userDoc = await userRef.get();
      const userData = userDoc.data();
      setDoc(userData);
    }
    catch(e) {
      Alert.alert('유저 데이터 수신 오류', e.message);
      setRefreshing(false);
    }
  };

  const getMyClubList = async () => { //이후 불러온 클럽 정보를 바탕으로 리스트에 표시해준다. 지역 필터링도 이 함수에서 이루어진다.
    try {
      const clubRef = DB.collection('clubs');
      const list = [];
      for(const clubId in clubIds){
        if (clubIds[clubId] != false) {
          const tempDoc = await clubRef.doc(clubId).get();
          const tempData = tempDoc.data();
          if(region === "") {
              list.push(tempData);
          }
          else {
            if(tempData.region === region) {
              list.push(tempData);
            }
          }
        }
      }
      setClubs(list);
      setRefreshing(false);
    }
    catch (e) {
      Alert.alert('클럽 리스트 수신 오류', e.message);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getMyClubId();
  }, []);

  useEffect(() => {
    setClubIds(doc.club);
  }, [doc]);

  useEffect(() => {
    getMyClubList();
  }, [clubIds, region]);

  useEffect(() => { //화면 밖으로 벗어날 시 새로고침 할 수 있도록 리스너 설정
    const unsubscribe = navigation.addListener('focus', () => {
      getMyClubId();
    });
    return unsubscribe;
  }, [navigation]);

  const _handleItemPress = params => {
    const id = params.id;
    const title = params.title;

    navigation.navigate('MyClub',
    {
      screen : 'MyClubTab',
      params: {id: id, title: title},
    }
    );
  };

  return (
    <Container>
    <Picker
        selectedValue={region}
        style={{ height: 50, width: 220, margin: 10 }}
        onValueChange={(itemValue, itemIndex) => setRegion(itemValue)}>
        <Picker.Item label="지역을 선택해주세요" value="" />
        <Picker.Item label="강서" value="강서" />
        <Picker.Item label="강북" value="강북" />
        <Picker.Item label="강남" value="강남" />
        <Picker.Item label="강동" value="강동" />
        <Picker.Item label="경기북부" value="경기북부" />
        <Picker.Item label="경기남부" value="경기남부" />
        <Picker.Item label="강원" value="강원" />
        <Picker.Item label="충청" value="충청" />
        <Picker.Item label="전라" value="전라" />
        <Picker.Item label="경북" value="경북" />
        <Picker.Item label="경남" value="경남" />
        <Picker.Item label="제주" value="제주" />
    </Picker>
    <Line width={width} />
      <FlatList
        keyExtractor={item => item['id']}
        data={clubs}
        renderItem={({ item }) => (
          <Item item={item} onPress={_handleItemPress} />
        )}
        refreshing={refreshing}
        onRefresh={getMyClubId}
        windowSize={3}
      />
    </Container>
  );
};

export default MyClubList;
