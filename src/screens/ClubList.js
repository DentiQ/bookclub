//모든 클럽을 표시해주는 화면

import React, { useContext, useState, useEffect } from 'react';
import { DB } from '../utils/firebase';
import { FlatList, Alert,  Dimensions} from 'react-native';
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

const ClubList = ({ navigation }) => {

  const width= Dimensions.get('window').width;


  const [clubs, setClubs] = useState([]);
  const [region, setRegion] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const getClubList = async () => {
    try {
      setRefreshing(true);
      const clubRef = DB.collection('clubs');
      const clubDoc = await clubRef.get();

      let list = [];

      clubDoc.forEach(doc => {
        const data = doc.data();
        if (region === '') {
          list.push(data);
        }
        else {
          if (data.region === region) {
            list.push(data);
          }
        }
      });
      setClubs(list);
      setRefreshing(false);
    }

    catch(e) {
      Alert.alert('클럽 리스트 수신 오류', e.message);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    getClubList();
  }, []);

  useEffect(() => {
    getClubList();
  }, [region]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getClubList();
    });
    return unsubscribe;
  }, [navigation]);

  const _handleItemPress = params => {
    navigation.navigate('Club', params);
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
      <Line width={width}/>
      <FlatList
        keyExtractor={item => item['id']}
        data={clubs}
        renderItem={({ item }) => (
          <Item item={item} onPress={_handleItemPress} />
        )}
        refreshing={refreshing}
        onRefresh={getClubList}
        windowSize={3}
      />
    </Container>
  );
};

export default ClubList;
