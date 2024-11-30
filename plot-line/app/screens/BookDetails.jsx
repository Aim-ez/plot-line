import React, { useContext, useState, useEffect } from 'react';
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
  RightIcon,
} from '../../components/styles';
import { Ionicons } from '@expo/vector-icons';

const BookDetails = ({ route, navigation }) => {
  const { book, fromReview } = route.params;
  const { storedCredentials } = useContext(CredentialsContext);
  const {_id} = storedCredentials;
  const addListURL = HostURL + "/user/addToReadingList";
  const getBookURL = HostURL + "/user/getBook";
  const addFavURL = HostURL + "/user/setFavourite";
  const getFavURL = HostURL + "/user/getFavourite";

  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        const response = await axios.get(getFavURL, {params: { userId: _id }});

        if (response.data.status === "SUCCESS" && response.data.data) {
          const favoriteBookId = response.data.data;
          setIsFavorite(book._id === favoriteBookId);
        }
      } catch (error) {
        console.error("Error fetching favorite book:", error);
      }
    };
  
    fetchFavorite();
  }, [book._id, _id]);
  

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

  const addFavourite = async () => {
        let bookId = null
        if (!fromReview) {
          // get plotline bookId
          bookId = await createPlotlineBook(book)
        } else {
          bookId = book._id;
        }

        const dataToSend = {
          userId: _id,
          bookId: bookId,
        }

        // set favourite
        const res = await axios.post(addFavURL, dataToSend)
        const status = res.data.status;

        if (status === "SUCCESS") {
          handleMessage(res.data.message, status)
          setIsFavorite(true)
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
        <RightIcon onPress={() => addFavourite()}>
          <Ionicons name="star" size={24} color={isFavorite ? "gold" : "gray"}/>
        </RightIcon>
        {fromReview ? renderPlotLineBook() : renderGoogleBook()}
        <Line />
        <MsgBox type={messageType}>{message}</MsgBox>
      </StyledContainer>
    </ScrollView>
  );
};

export default BookDetails;
