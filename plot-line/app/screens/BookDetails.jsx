import React from 'react';
import { ScrollView } from 'react-native';

import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledButton,
  ButtonText,
  Line,
  ExtraText,
  BookCoverImage,
  HeaderImage,
} from '../../components/styles';

const BookDetails = ({ route, navigation }) => {
  const { book, fromReview } = route.params;

  const navigateToReview = (screen, book) => {
    navigation.navigate(screen, { book });
  };

  const renderBookCover = (imageUri) => {
    return imageUri ? (
      <BookCoverImage source={{ uri: imageUri }} />
    ) : (
      <HeaderImage source={require('../../assets/images/books2.png')} />
    );
  };

  const renderBookInfo = (title, authors, description) => (
    <>
      <PageTitle>{title}</PageTitle>
      <SubTitle author={true}>Authors:</SubTitle>
      <SubTitle author={true}>{authors}</SubTitle>
      <ExtraText>{description || "No description available."}</ExtraText>
    </>
  );

  const renderButtons = (onReadPress, onReviewsPress) => (
    <>
      <StyledButton onPress={onReadPress}>
        <ButtonText>I've Read This</ButtonText>
      </StyledButton>
      <StyledButton onPress={onReviewsPress}>
        <ButtonText>See Reviews</ButtonText>
      </StyledButton>
    </>
  );

  const renderGoogleBook = () => {
    const { title, authors, description, imageLinks } = book.volumeInfo;
    return (
      <InnerContainer>
        <Line />
        {renderBookCover(imageLinks?.thumbnail)}
        <InnerContainer>
          {renderBookInfo(title, authors?.join(', '), description)}
          {renderButtons(
            () => navigateToReview('ReviewGoogleBook', book),
            () => navigateToReview('GoogleBookReviews', book)
          )}
        </InnerContainer>
      </InnerContainer>
    );
  };

  const renderPlotLineBook = () => {
    const { title, author, description, coverLink } = book;
    return (
      <InnerContainer>
        <Line />
        {renderBookCover(coverLink)}
        {renderBookInfo(title, author, description)}
        {renderButtons(
          () => navigateToReview('ReviewPlotlineBook', book),
          () => navigateToReview('PlotlineBookReviews', book)
        )}
      </InnerContainer>
    );
  };

  return (
    <ScrollView>
      <StyledContainer home={true}>
        {fromReview ? renderPlotLineBook() : renderGoogleBook()}
        <Line />
      </StyledContainer>
    </ScrollView>
  );
};

export default BookDetails;
