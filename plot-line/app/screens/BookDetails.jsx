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

const BookDetails = ({ route, navigation }) => {
  const { book, fromReview } = route.params;

  goToPlotReview = ({book}) => {
    navigation.navigate('ReviewPlotlineBook', { book: book })
  }

  goToGoogleReview = ({book}) => {
    navigation.navigate('ReviewGoogleBook', { book: book })
  }


  const renderGoogleBook = () => {
    return (
      <InnerContainer>
        <Line></Line>
        {book.volumeInfo.imageLinks?.thumbnail ? (
          <BookCoverImage source={{ uri: book.volumeInfo.imageLinks.thumbnail }}/>
        ) : (
          <Text>No Image Available</Text>  // This will show text if image is missing
        )}

        <InnerContainer>
    
        <PageTitle>{book.volumeInfo.title}</PageTitle>
        <SubTitle author={true}>Authors:</SubTitle>
        <SubTitle author={true}>{book.volumeInfo.authors?.join(', ')}</SubTitle>
        <ExtraText bookDesc={true}>{book.volumeInfo.description || "No description available."}</ExtraText>
        <StyledButton onPress={() => goToGoogleReview({book: book})}>
          <ButtonText>I've Read This</ButtonText>
        </StyledButton>
        <StyledButton onPress={() => navigation.navigate('GoogleBookReviews', {book: book})}>
            <ButtonText>See Reviews</ButtonText>
          </StyledButton>

        </InnerContainer>
      </InnerContainer>
  
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
       <StyledButton onPress={() => goToPlotReview({book:book})}>
          <ButtonText>I've Read This</ButtonText>
        </StyledButton>
        <StyledButton onPress={() => navigation.navigate('PlotlineBookReviews', {book: book})}>
          <ButtonText>See Reviews</ButtonText>
        </StyledButton>

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

