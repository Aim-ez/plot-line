import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';


import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon, 
  RightIcon,
  StyledInputLabel,
  StyledTextInput,
  StyledButton,
  ButtonText,
  Colors,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
  BookCoverImage,
  HeaderImage,
} from '../../components/styles';

const BookDetails = ({ route }) => {
  const { book, fromReview } = route.params;
  console.log("In book details: ", book);
  console.log(fromReview)


  const renderGoogleBook = () => {
    return (
      <>
        <Line></Line>
        {book.volumeInfo.imageLinks?.thumbnail ? (
          <BookCoverImage source={{ uri: book.volumeInfo.imageLinks.thumbnail }} style={styles.image} />
        ) : (
          <Text>No Image Available</Text>  // This will show text if image is missing
        )}

        <InnerContainer>
    
        <PageTitle>{book.volumeInfo.title}</PageTitle>
        <SubTitle author={true}>Authors:</SubTitle>
        <SubTitle author={true}>{book.volumeInfo.authors?.join(', ')}</SubTitle>
        <ExtraText bookDesc={true}>{book.volumeInfo.description || "No description available."}</ExtraText>
      
        </InnerContainer>
      </>
    )
  }

  const renderPlotLineBook = () => {
    return (
      <InnerContainer>
        <HeaderImage source={require('../../assets/images/books2.png')}/>
        <PageTitle>{book.title}</PageTitle>
        <SubTitle author={true}>Authors:</SubTitle>
        <SubTitle author={true}>{book.author}</SubTitle>
        <ExtraText>{book.description || "No description available."}</ExtraText>
        
      </InnerContainer>
    )
  }

  return (
    <ScrollView> 
    
        <StyledContainer home={true}>
          {fromReview ? (
            renderPlotLineBook()
          ) : (
            renderGoogleBook()
          )}

       <Line></Line>

        </StyledContainer>

    </ScrollView>
  );
};

export default BookDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EFEBF9',
  },
  image: {
    width: 150,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  authors: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
