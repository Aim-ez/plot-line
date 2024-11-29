import React, { useContext, useState } from 'react';
import { ScrollView } from 'react-native';
import axios from 'axios';

import { createPlotlineBook } from '../../hooks/userReviewLogic.js';
import { CredentialsContext } from '../../components/CredentialsContext';
import { HostURL } from '../../constants/URL.js';

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
  MsgBox,
} from '../../components/styles';

const BookDetails = ({ route, navigation }) => {
  const { book, fromReview } = route.params;
  const { storedCredentials } = useContext(CredentialsContext);
  const {_id} = storedCredentials;
  const getListURL = HostURL + "/user/getReadingList";
  const addListURL = HostURL + "/user/addToReadingList";
  const getBookURL = HostURL + "/user/getBook";

  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();


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

  const renderButtons = (onReadPress, onReviewsPress, onListPress) => (
    <>
      <StyledButton onPress={onReadPress}>
        <ButtonText>I've Read This</ButtonText>
      </StyledButton>
      <StyledButton onPress={onReviewsPress}>
        <ButtonText>See Reviews</ButtonText>
      </StyledButton>
      <StyledButton onPress={onListPress}>
        <ButtonText>Add to My Reading List</ButtonText>
      </StyledButton>
    </>
  );

  const addGoogleBookToReadingList = async (book) => {
    // get plotline bookId
    const bookId = await createPlotlineBook(book)
    addBookToReadingList(bookId)
  }

  const getBook = async(bookId) => {
    const res = await axios.get(getBookURL, { params: { bookId: bookId}})
    return (res.data.data);
  }

  const addBookToReadingList = async (bookId) => {
    //Reset message box
    handleMessage(null);

    //Get actual book object
    const b = await getBook(bookId);

    const dataToSend = {
      userId: _id,
      book: b,
    }

    //Add the book object to the list
    const res = await axios.post(addListURL, dataToSend)
    const status = res.data.status;

    if (status === "SUCCESS") {
      handleMessage(res.data.message, status)
    } else {
      handleMessage(res.data.message)
    }
  }

  // Show a message
  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  };

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
            () => navigateToReview('GoogleBookReviews', book),
            () => addGoogleBookToReadingList(book) //Will need to create Plotline book
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
          () => navigateToReview('PlotlineBookReviews', book),
          () => addBookToReadingList(book._id)
        )}
      </InnerContainer>
    );
  };

  return (
    <ScrollView>
      <StyledContainer home={true}>
        {fromReview ? renderPlotLineBook() : renderGoogleBook()}
        <Line />
        <MsgBox type={messageType}>{message}</MsgBox>
      </StyledContainer>
    </ScrollView>
  );
};

export default BookDetails;
