//클럽이 완료한 책 목록에서 사용되는 완료한 책 목록 리스트 컴포넌트
//완료한 시점의 날짜를 기준으로 특정 월에 해당하는 리스트만을 출력하며, 결과값으로는 책 제목/저자/완료일자/책 소개글이 있다.
//완료한 멤버 아이콘을 클릭할 경우 해당 책을 완료한 멤버의 닉네임과 프로필 이미지가 보여진다.

import React, {useState} from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, Dimensions, Text, Image, StyleSheet, FlatList } from 'react-native';
import { theme } from '../theme';
import CompleteUserForm from './CompleteUserForm';



const Container = styled.View`
  width: ${({ width }) => width}px;
  flex-direction: column;
  background-color: ${({ theme }) => theme.inputBackground};
`;

const ContainerRow=styled.View`
width: ${({ width }) => width}px;
  flex-direction: row;
  background-color: ${({ theme }) => theme.inputBackground};
`;

const Date = styled.View`
  width: ${({ width }) => (width)*0.2}px;
  flex-direction: column;
  justify-content: space-between;
  paddingTop: 10px;
  paddingBottom: 10px;
  align-items: center;
  borderRight-Color: ${({ theme }) => theme.separator};
  borderRight-Width: 1px;

`;

const RowFix=styled.View`
    width: ${({ width }) => (width)*0.2}px;
    flex-direction: row;
    paddingLeft: 10px;
    justify-content: flex-start;
`;

const ColumnFix=styled.View`
    width: ${({ width }) => (width)*0.6}px;
    flex-direction: column;
`;

const Info = styled.View`
    width: ${({ width }) => (width)*0.8}px;
    min-height: 70px;
    marginTop: 10px;
    marginBottom: 10px;
    marginLeft: 3px;

`;

const CompleteBookList = ({completebookInfo}) => {
    const width = Dimensions.get('window').width;
    const user = completebookInfo.complete;
    const [search, setSearch] = useState('');

    const _clearSearch = () => {
        setSearch('');
      };


    const renderItem = ({ item }) => {
        return (
            <ContainerRow width={width}>
            <Date width={width}>
                <Text style={styles.date}>{item.completedate}일</Text>
            </Date>
            <Info width={width}>
                <RowFix width={width}>
                    <Image
                        style={styles.img}
                        source={{uri:item.cover}} />
                    <ColumnFix width={width}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.author}>{item.author}</Text>
                    </ColumnFix>
                </RowFix>
                <Text style={styles.description}>{item.description}</Text>
                <CompleteUserForm
                    onPress={()=>{}}
                    clearSearch={_clearSearch}
                    members={item.members}
                />
            </Info>
            </ContainerRow>
        );

    };
    return (
        <Container width={width}>
        <FlatList
            keyExtractor={(item) => item.itemId.toString()}
            data={user}
            renderItem={renderItem}
            ItemSeparatorComponent={() => {
            return (
                <View style={styles.separator} />
            );
            }}
        />
        </Container>
    );
};

const styles = StyleSheet.create({
    date: {
        fontSize: 16,
        color: theme.text,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop:2,
        paddingBottom:2,
      },
    title: {
        fontSize: 16,
        color: theme.text,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop:2,
        paddingBottom:2,
        fontWeight: "bold",
      },
      author:{
        fontSize: 12,
        color: theme.text,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop:2,
        paddingBottom:6,
      },
      description:{
        fontSize: 14,
        color: theme.text,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop:10,
        paddingBottom:2,
      },
      member:{
        fontSize: 14,
        color: theme.text,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop:10,
        paddingBottom:10,
      },
      img:{
        width: 60,
        height: 90,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop:0,
        paddingBottom:0,
        marginTop: 2,
      },
      separator: {
        height: 1,
        backgroundColor: theme.separator,
      }
});

CompleteBookList.propTypes = {
  completebookInfo: PropTypes.object.isRequired,
};

export default CompleteBookList;
