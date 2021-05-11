import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { useWindowDimensions, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

const Container = styled.View`
  width: ${({ width }) => width - 40}px;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.inputBackground};
  margin: 20px;
  padding: 15px 15px;
  border-radius: 10px;
`;
const PostInfo = styled.View`
  width: ${({ width }) => (width - 40) * 0.92}px;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 0.9px;
  border-color: ${({ theme }) => theme.separator};
  padding-top: 6px;
  padding-bottom: 2px;
  margin: 0px;
`;
const PostInfo2 = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  padding-left: 0px;
`;
const OCRText = styled.View`
  margin-top: 20px;
  background-color: ${({ theme }) => theme.inputBackground};
  border-width: 0.9px;
  border-color: ${({ theme }) => theme.separator};
  border-radius: 10px;
`;

const EssayViewPost = ({ postInfo }) => {
  const width = useWindowDimensions().width;
  /*console.log(postInfo.photos);*/
  return (
    <Container width={width}>
      <PostInfo width={width}>
        <Text style={styles.titleText}>{postInfo.title}</Text>
      </PostInfo>
      <PostInfo width={width}>
        <Text style={styles.infoText}>작성자: {postInfo.writer_name}</Text>
        <PostInfo2>
          <Text style={styles.infoText}>{postInfo.upload_date}</Text>
          <Text style={styles.infoText}>   좋아요 {postInfo.like_cnt}</Text>
          <Text style={styles.infoText}>   댓글 {postInfo.comment_cnt}</Text>
        </PostInfo2>
      </PostInfo>
      <OCRText>
        <Text style={styles.ocrText} selectable>{postInfo.ocr_text}</Text>
      </OCRText>
      <Text style={styles.contentText}>{postInfo.content}</Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 19,
    fontWeight: "bold",
    color: theme.text,
    paddingBottom: 5,
  },
  infoText: {
    fontSize: 13,
    color: theme.infoText,
    paddingBottom: 5,
  },
  ocrText: {
    fontSize: 14.5,
    padding: 13,
    lineHeight: 22,
  },
  contentText: {
    fontSize: 15,
    paddingTop: 30,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 10,
    lineHeight: 25,
  },
  separator: {
    borderBottomColor: theme.separator,
  }
});

EssayViewPost.propTypes = {
  postInfo: PropTypes.object.isRequired,
};

export default EssayViewPost;