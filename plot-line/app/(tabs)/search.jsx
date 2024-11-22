import React, { useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  Line,
  SearchBar,
  StyledButton,
  ButtonText,
  ReviewBox,
  BookText,
  AuthorText,
  RightIcon,
} from '../../components/styles';

const GOOGLE_BOOKS_API_KEY = 'AIzaSyA4Z1Qm7N2_6AnPLHOtS577y4-nV_NrAb8';
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

const Search = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const nav = useNavigation();

  React.useEffect(() => {
    const unsubscribe = nav.addListener('tabPress', () => {
      setBooks([]); // Clear the search results when the tab is pressed
      setHasSearched(false); // Reset the search state
    });

    return unsubscribe; // Cleanup listener
  }, [nav]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${GOOGLE_BOOKS_API}?q=${query}&key=${GOOGLE_BOOKS_API_KEY}`);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setBooks(data.items || []); // Set fetched books or an empty array
      setHasSearched(true); // Mark that a search has been conducted
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const renderBookItem = ({ item }) => (
    <ReviewBox onPress={() => navigation.navigate('BookDetails', { book: item, fromReview: false })}>
      <BookText>{item.volumeInfo.title}</BookText>
      <AuthorText>{item.volumeInfo.authors?.join(', ')}</AuthorText>
    </ReviewBox>
  );

  return (
    <StyledContainer>
      <InnerContainer>
        <RightIcon search={true} onPress={fetchBooks}>
          <Ionicons name={'search'} size={30} />
        </RightIcon>

        <PageTitle>Search</PageTitle>
        <Line />

        <SearchBar
          search={true}
          placeholder="Search for books or authors..."
          value={query}
          onChangeText={setQuery}
        />

        <InnerContainer>
          <>
            <FlatList
              data={books}
              keyExtractor={(item) => item.id}
              renderItem={renderBookItem}
              style={styles.results}
            />
            {hasSearched && (
              <StyledButton onPress={() => navigation.navigate('addManualBook')}>
                <ButtonText>Can't Find What You're Looking For?</ButtonText>
              </StyledButton>
            )}
          </>
        </InnerContainer>
      </InnerContainer>
    </StyledContainer>
  );
};

const styles = StyleSheet.create({
  results: {
    marginTop: 20,
    width: '100%',
  },
});

export default Search;
