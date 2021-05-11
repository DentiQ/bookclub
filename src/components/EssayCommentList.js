import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, useWindowDimensions, Text, StyleSheet, FlatList } from 'react-native';
import { theme } from '../theme';

const Container = styled.View`
  width: ${({ width }) => width - 40}px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.inputBackground};
  margin: 5px;
  padding: 0px 5px;
  border-radius: 10px;
`;
const CommentInfo = styled.View`
  width: ${({ width }) => width - 75}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
`;
const CommentArea = styled.View`
  flex-direction: column;
  justify-content: flex-start;
  margin: 7px;
  padding: 5px 5px;
`;

const EssayCommentList = ({ postInfo }) => {
  const width = useWindowDimensions().width;
  const comments = postInfo.comment;
  /*console.log(comments)*/

  const renderItem = ({ item }) => {
    return (
      <CommentArea>
        <CommentInfo width={width} >
          <Text style={styles.writerText}>{item.writer_name}</Text>
          <Text style={styles.infoText}>{item.upload_date}</Text>
        </CommentInfo>
        <View style={{ width: width-75 }}>
          <Text style={styles.contentText}>{item.content}</Text>
        </View>
      </CommentArea>
    );
  };

  return (
    <Container width={width}>
      <FlatList
        nestedScrollEnabled={true}
        keyExtractor={(item) => item.id.toString()}
        data={comments}
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
  writerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.text,
    paddingTop: 6,
  },
  infoText: {
    fontSize: 13,
    color: theme.infoTextComment,
    paddingBottom: 5,
  },
  contentText: {
    fontSize: 15,
    paddingTop: 7,
    paddingBottom: 7,
    color: theme.text,
    lineHeight: 22,
  },
  separator: {
    height: 0.8,
    backgroundColor: theme.separator,
  }
});

EssayCommentList.propTypes = {
  postInfo: PropTypes.object.isRequired,
};

export default EssayCommentList;