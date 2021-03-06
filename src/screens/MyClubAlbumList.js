// 앨범 탭에서 게시글 목록을 보여주는 화면
// - 각 게시글 별로 첨부된 이미지 중 첫 번째 이미지의 썸네일 뷰를 지원함
// - 검색창인 SearchForm 컴포넌트를 포함함

import React, { useContext, useState, useEffect, useLayoutEffect } from 'react';
import { Alert, FlatList, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { DB } from '../utils/firebase';
import styled, { ThemeContext } from 'styled-components/native';
import moment from 'moment';
import { theme } from '../theme';
import SearchForm from '../components/SearchForm';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
`;
const ItemContainer = styled.TouchableOpacity`
  flex-direction: column;
  width: ${({ width }) => (width - 40) / 2}px;
  align-items: flex-start;
  padding: 10px 10px;
  margin: 10px 5px;
`;
const ItemTextContainer = styled.View`
  width: ${({ width }) => (width - 40) / 2 - 20}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
`;
const ItemTitle = styled.View`
  justify-content: center;
  margin-top: 10px;
`;
const ItemTime = styled.View`
  align-items: flex-end;
  width: 45px;
`;
const ItemAuthor = styled.View`
  align-items: flex-start;
  width: ${({ width }) => (width - 40) / 2 - 65}px;
`;

const getDateOrTime = ts => {
  const now = moment().startOf('day');
  const target = moment(ts).startOf('day');
  return moment(ts).format(now.diff(target, 'days') > 0 ? 'MM/DD' : 'HH:mm');
};

const Item = React.memo(
  ({ item: { clubId, id, author, title, createAt, photoUrls }, onPress, width }) => {
    const theme = useContext(ThemeContext);
    const name = author.name;

    return (
      <ItemContainer width={width} onPress={() => onPress({ clubId, id, title, author })}>
        <Image
          style={{ height: (width-40)/2-20, width: (width-40)/2-20, borderRadius: 10 }}
          source={{ uri: photoUrls[0] }}
          key={id}
          resizeMethod="resize"
        />
        <ItemTitle><Text numberOfLines={1} style={styles.itemTitle}>{title}</Text></ItemTitle>
        <ItemTextContainer width={width}>
          <ItemAuthor width={width}><Text numberOfLines={1} style={styles.ItemAuthor}>{name}</Text></ItemAuthor>
          <ItemTime><Text style={styles.itemTime}>{getDateOrTime(createAt)}</Text></ItemTime>
        </ItemTextContainer>
      </ItemContainer>
    );
  }
);

const MyClubAlbumList = ({navigation, route}) => {
  const width = useWindowDimensions().width;
  const [albums, setAlbums] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [searchOption, setSearchOption] = useState('title');
  const id = route.params?.id;
  const title = route.params?.title;

  const getMyClubAlbumList = async() => {
    try{
      setRefreshing(true);
      const albumRef = DB.collection('clubs').doc(id).collection('album');
      const albumDoc = await albumRef.orderBy('createAt', 'desc').get();
      const list = [];
      albumDoc.forEach(doc => {
        const data = doc.data();
        data['clubId'] = id;
        list.push(data);
      })
      setAlbums(list);
      setRefreshing(false);
    }
    catch(e){
      Alert.alert('앨범 리스트 수신 오류', e.message);
      setRefreshing(false);
    }
  }

  const getAlbumSearchData = async() => {
    try{
      setRefreshing(true);
      const albumRef = DB.collection('clubs').doc(id).collection('album');
      const albumDoc = await albumRef.orderBy('createAt', 'desc').get();
      const list = [];
      if(searchOption === 'title') {
        albumDoc.forEach(doc => {
          const data = doc.data();
          if(data.title.includes(search.trim())){
            data['clubId'] = id;
            list.push(data);
          }
        })
      }
      else if(searchOption === 'author') {
        albumDoc.forEach(doc => {
          const data = doc.data();
          if(data.author.name.includes(search.trim())){
            data['clubId'] = id;
            list.push(data);
          }
        })
      }
      setAlbums(list);
      setRefreshing(false);
    }
    catch(e){
      Alert.alert('앨범 list set error', e.message);
      setRefreshing(false);
    }
  }

  useLayoutEffect(() => {
    getMyClubAlbumList();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMyClubAlbumList();
    });
    return unsubscribe;
  }, [navigation]);

  const _handleItemPress = params => {
    navigation.navigate('MyClubAlbumNav', {screen: 'MyClubAlbumView', params});
  };

  const _handleSearchChange = text => {
    setSearch(text);
  };

  const _searchPost = () => {
    if (!search) {
      Alert.alert('오류', "검색어를 입력해주세요.");
    }
    else {
      Alert.alert('알림', ((searchOption==='title') ? '제목으로 ' : '글쓴이로 ') + `검색합니다 : ${search}`);
      getAlbumSearchData();
    }
  };

  const _clearSearch = () => {
    setSearch('');
  };

  return (
    <Container>
      <FlatList
        keyExtractor={item => item['id'].toString()}
        data={albums}
        renderItem={({ item }) => (
          <Item item={item} onPress={_handleItemPress} width={width} />
        )}
        refreshing={refreshing}
        onRefresh={getMyClubAlbumList}
        windowSize={3}
        numColumns={2}
      />
      <SearchForm
        placeholder="검색어를 입력하세요."
        value={search}
        onChangeText={_handleSearchChange}
        onSubmitEditing={_searchPost}
        onPress={_searchPost}
        clearSearch={_clearSearch}
        onChangeSearchOption={(value) => {setSearchOption(value)}}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemTime: {
    fontSize: 13,
    marginTop: 3,
    color: theme.listTime,
  },
  ItemAuthor: {
    fontSize: 13,
    marginTop: 3,
    color: theme.listTime,
  },
});

export default MyClubAlbumList;
