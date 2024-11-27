
import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useFetchBooks from '../../hooks/useFetchBooks';  // Import the custom hook

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
  ModalContainer,
  ModalInnerContainer,
  SubTitle,
  SectionTitle,
  FilterOption,
  FilterText,
} from '../../components/styles';

const Search = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [resultsPerPage] = useState(35); // Set results per page to 35

  const { books, totalResults, hasSearched, fetchBooks } = useFetchBooks(
    query, selectedGenre, selectedLanguage, resultsPerPage, sortOrder
  );

  const nav = useNavigation();

  useEffect(() => {
    const unsubscribe = nav.addListener('tabPress', () => {
      // Reset all state and trigger fetchBooks
      setQuery('');
      setSelectedGenre('');
      setSelectedLanguage('');
      setSortOrder('');
      fetchBooks(); // Fetch books after resetting the state
    });
  
    return unsubscribe; // Cleanup listener
  }, [nav]);
  

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedLanguage('');
    setSortOrder('');
  };

  const handleSearch = () => fetchBooks(); // Trigger fetchBooks when search is submitted

  const renderBookItem = ({ item }) => (
    <ReviewBox onPress={() => navigation.navigate('BookDetails', { book: item, fromReview: false })}>
      <BookText>{item.volumeInfo.title}</BookText>
      <AuthorText>{item.volumeInfo.authors?.join(', ')}</AuthorText>
    </ReviewBox>
  );

  const genres = ['Fiction', 'Non-Fiction', 'Poetry', 'Fantasy'];

  return (
    <StyledContainer>
      <InnerContainer>
        <RightIcon filter={true} onPress={() => setModalVisible(true)}>
          <Ionicons name={'filter'} size={30} />
        </RightIcon>

        <PageTitle>Search</PageTitle>
        <Line />

        <SearchBar
          search={true}
          placeholder="Search for books or authors..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch} // Trigger fetchBooks on "Enter" or "Done"
          returnKeyType="search" // Customize the keyboard action button
        />

        <RightIcon search={true} onPress={handleSearch}>
          <Ionicons name={'search'} size={30} />
        </RightIcon>

        <InnerContainer>
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
        </InnerContainer>
      </InnerContainer>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalContainer>
          <ModalInnerContainer>
            <SubTitle style={styles.modalTitle}>Select Filters</SubTitle>

            {/* Genre Selection */}
            <SectionTitle>Genre</SectionTitle>
            <FlatList
              key={modalVisible ? 'open' : 'closed'}
              data={genres}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item: genre }) => (
                <FilterOption
                  onPress={() => setSelectedGenre(genre)}
                  chosen={selectedGenre === genre}
                >
                  <FilterText chosen={selectedGenre === genre}>{genre}</FilterText>
                </FilterOption>
              )}
              style={styles.genreList}
            />

            {/* Language and Sorting Selection */}
            <SectionTitle>Language</SectionTitle>
            <View style={styles.selectionRow}>
              <FilterOption
                onPress={() => setSelectedLanguage('en')}
                chosen={selectedLanguage === 'en'}
              >
                <FilterText chosen={selectedLanguage === 'en'}>English</FilterText>
              </FilterOption>
              <FilterOption
                onPress={() => setSelectedLanguage('fr')}
                chosen={selectedLanguage === 'fr'}
              >
                <FilterText chosen={selectedLanguage === 'fr'}>French</FilterText>
              </FilterOption>
            </View>

            <SectionTitle>Sort By</SectionTitle>
            <View style={styles.selectionRow}>
              <FilterOption
                onPress={() => setSortOrder('A-Z')}
                chosen={sortOrder === 'A-Z'}
              >
                <FilterText chosen={sortOrder === 'A-Z'}>Alphabetically A-Z</FilterText>
              </FilterOption>
              <FilterOption
                onPress={() => setSortOrder('Z-A')}
                chosen={sortOrder === 'Z-A'}
              >
                <FilterText chosen={sortOrder === 'Z-A'}>Alphabetically Z-A</FilterText>
              </FilterOption>
            </View>

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              <Button
                title="Apply Filters"
                onPress={() => {
                  setModalVisible(false); // Close the modal
                  fetchBooks(); // Fetch books with the applied filters
                }}
              />
              <Button
                title="Clear Filters"
                onPress={() => {
                  clearFilters(); // Clear filters
                  fetchBooks(); // Re-fetch books without filters
                  setModalVisible(false); // Close the modal
                }}
                color="orange"
              />
              <Button
                title="Close"
                onPress={() => setModalVisible(false)} // Just close the modal
                color="grey"
              />
            </View>
          </ModalInnerContainer>
        </ModalContainer>
      </Modal>
    </StyledContainer>
  );
};

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    padding: 20,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  results: {
    width: '100%',
  },
  bookItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
  },
  filterButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  searchButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  results: {
    marginTop: 20,
    width: '90%',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  selectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  optionButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  selectedOption: {
    backgroundColor: '#007bff',
  },
  optionText: {
    textAlign: 'center',
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  genreList: {
    maxHeight: 150,
    paddingBottom: 10,
  },
});
export default Search;

