import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View, Image, ScrollView, useWindowDimensions, Text, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { theme } from '../theme';
import ImageViewer from 'react-native-image-zoom-viewer';

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
  border-color: ${({ theme }) => theme.seperator};
  padding-top: 6px;
  padding-bottom: 2px;
  margin: 0px;
`;
const PostInfo2 = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  padding-left: 0px;
`;

const AlbumViewPost = ({ postInfo }) => {
  const width = useWindowDimensions().width;
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const openModal = (index) => {
    setIsModalOpened(true);
    setCurrentImageIndex(index);
  };
  useEffect(() => {
    return () => setIsModalOpened(false);
  }, []);
  /*console.log(postInfo.photos);*/
  const renderImage = (item, i) => {
    return (
      <TouchableWithoutFeedback onPress={() => openModal(i)}>
        <Image
          style={{ height: 140, width: 140, margin: 5, borderRadius: 10 }}
          source={{ uri: item.url }}
          key={i}
        />
      </TouchableWithoutFeedback>
    );
  };

  return (
    <Container width={width}>
      <PostInfo width={width}>
        <Text style={styles.titleText}>{postInfo.title}</Text>
      </PostInfo>

      <PostInfo width={width}>
        <Text style={styles.infoText}>작성자: {postInfo.writer_name}</Text>
        <PostInfo2>
          <Text style={styles.infoText}>{postInfo.upload_date}</Text>
          <Text style={styles.infoText}>   댓글 {postInfo.comment_cnt}</Text>
        </PostInfo2>

      </PostInfo>
      <View style={{ height: 170 }}>
        <ScrollView
          horizontal={true}
          style={{ flexDirection: 'row', marginTop: 15 }}
        >
          {/*console.log(postInfo.photos)*/}
          {postInfo.photos.map((item, i) => renderImage(item, i))}
        </ScrollView>
      </View>
      <Text style={styles.contentText}>{postInfo.content}</Text>
      <Modal visible={isModalOpened} transparent={true}>
        <ImageViewer
          imageUrls={postInfo.photos}
          index={currentImageIndex}
          enableSwipeDown={true}
          onSwipeDown={() => setIsModalOpened(false)}
          menuContext={{ saveToLocal: '이미지 저장', cancel: '취소' }}
        />
      </Modal>
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
  contentText: {
    fontSize: 15,
    paddingTop: 30,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 10,
  },
  separator: {
    borderBottomColor: theme.seperator,
  }
});

AlbumViewPost.propTypes = {
  postInfo: PropTypes.object.isRequired,
};

export default AlbumViewPost;