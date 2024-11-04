import { StyleSheet, Text, TextInput, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../../components/CredentialsContext.jsx';

import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledButton,
  ButtonText,
  Line,
  WelcomeContainer,
  Avatar,
  SearchBar,
} from '../../components/styles';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

const searchBookByTitle = async (title) => {
  try {
    const apiUrl = `${GOOGLE_BOOKS_API}?q=${title}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching books by title:', error);
    return null;
  }
};

const searchBookByISBN13 = async (isbn13) => {
  try {
    const apiUrl = `${GOOGLE_BOOKS_API}?q=isbn:${isbn13}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching books by ISBN:', error);
    return null;
  }
};

const Search = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const navigation = useNavigation();

  const { storedCredentials } = useContext(CredentialsContext);
  const { name, username, email } = storedCredentials;

  const fetchBooks = async () => {
    const results = await searchBookByTitle(query);
    if (results) setBooks(results);
  };

  const handleBookPress = (book) => {
    navigation.navigate('BookDetails', { book });
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigation.navigate('BookDetails', { book: item })} // Pass the book data
    >
      <Text style={styles.bookTitle}>{item.volumeInfo.title}</Text>
      <Text style={styles.bookAuthor}>{item.volumeInfo.authors?.join(', ')}</Text>
    </TouchableOpacity>
  );
  

  return (
    <View style={styles.container}>
      <PageLogo source={require('../../assets/images/PlotLogo.png')} />
      <SearchBar
        placeholder="Search for books..."
        value={query}
        onChangeText={setQuery}
      />
      <TouchableOpacity onPress={fetchBooks} style={styles.searchButton}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={renderBookItem}
        style={styles.results}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFEBF9',
    padding: 20,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#798CE7',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#A574D5',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#798CE7',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  results: {
    width: '100%',
  },
  bookItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
  },
});
