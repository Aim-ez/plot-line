// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const Search = () => {
//   return (
//     <View>
//       <Text>Search</Text>
//     </View>
//   )
// }

// export default Search

// const styles = StyleSheet.create({})

//figuring out commits
import { StyleSheet, Button, Text, Modal, View, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useContext } from 'react'

// async storage
import AsyncStorage  from '@react-native-async-storage/async-storage'

// credntials context
import { CredentialsContext } from '../../components/CredentialsContext.jsx'

import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledButton,
  ButtonText,
  BookText,
  Line,
  WelcomeContainer,
  Avatar,
  SearchBar,
  ReviewBox,
  ExtraText,
  AuthorText,
  ModalContainer,
  SectionTitle,
  ModalInnerContainer,
  FilterOption,
  FilterText
} from '../../components/styles';

const Book = ({ 
  id: '',
  volumeInfo: {
    title: '',
    authors: [],
  },
});

GOOGLE_BOOKS_API_KEY = 'AIzaSyA4Z1Qm7N2_6AnPLHOtS577y4-nV_NrAb8'

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

const Search = ({navigation}) => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const fetchBooks = async () => {
    try {
      const genreQuery = selectedGenre ? `+subject:${selectedGenre}` : '';
      const languageQuery = selectedLanguage ? `&langRestrict=${selectedLanguage}` : '';
      
      // No orderBy in fetch call
      const response = await fetch(`${GOOGLE_BOOKS_API}?q=${query}${genreQuery}${languageQuery}&key=${GOOGLE_BOOKS_API_KEY}`);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      let fetchedBooks = data.items || [];
  
      // Sort books based on the sortOrder
      if (sortOrder === 'A-Z') {
        fetchedBooks.sort((a, b) => a.volumeInfo.title.localeCompare(b.volumeInfo.title));
      } else if (sortOrder === 'Z-A') {
        fetchedBooks.sort((a, b) => b.volumeInfo.title.localeCompare(a.volumeInfo.title));
      }
  
      setBooks(fetchedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };  
  

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedLanguage('');
    setSortOrder('');
  };
    

  const renderBookItem = ({ item }) => (
    <ReviewBox 
      onPress={() => navigation.navigate('BookDetails', { book: item, fromReview: false })}
    >
      <BookText>{item.volumeInfo.title}</BookText>
      <AuthorText>{item.volumeInfo.authors?.join(', ')}</AuthorText>
    </ReviewBox>
  );

  const genres = [
    'ANTIQUES & COLLECTIBLES', 'LITERARY COLLECTIONS', 'ARCHITECTURE', 'LITERARY CRITICISM', 'ART', 
    'MATHEMATICS', 'BIBLES', 'MEDICAL', 'BIOGRAPHY & AUTOBIOGRAPHY', 'MUSIC', 'BODY, MIND & SPIRIT', 
    'NATURE', 'BUSINESS & ECONOMICS', 'PERFORMING ARTS', 'COMICS & GRAPHIC NOVELS', 'PETS', 'COMPUTERS', 
    'PHILOSOPHY', 'COOKING', 'PHOTOGRAPHY', 'CRAFTS & HOBBIES', 'POETRY', 'DESIGN', 'POLITICAL SCIENCE', 
    'DRAMA', 'PSYCHOLOGY', 'EDUCATION', 'REFERENCE', 'FAMILY & RELATIONSHIPS', 'RELIGION', 'FICTION', 
    'SCIENCE', 'FOREIGN LANGUAGE STUDY', 'SELF-HELP', 'GAMES & ACTIVITIES', 'SOCIAL SCIENCE', 'GARDENING', 
    'SPORTS & RECREATION', 'HEALTH & FITNESS', 'STUDY AIDS', 'HISTORY', 'TECHNOLOGY & ENGINEERING', 'HOUSE & HOME', 
    'TRANSPORTATION', 'HUMOR', 'TRAVEL', 'JUVENILE FICTION', 'TRUE CRIME', 'JUVENILE NONFICTION', 'YOUNG ADULT FICTION', 
    'LANGUAGE ARTS & DISCIPLINES', 'YOUNG ADULT NONFICTION', 'CHILDREN\'S BOOKS'
  ];

  return (
    <StyledContainer>
      <InnerContainer>
        <TouchableOpacity 
          style={styles.plusButton} 
          onPress={() => navigation.navigate('addManualBook')}
        >
          <Text style={styles.plusButtonText}>+</Text>
        </TouchableOpacity>

        <PageLogo source={require('../../assets/images/PlotLogo.png')} />
        <SearchBar
          search={true}
          placeholder="Search for books or authors..."
          value={query}
          onChangeText={setQuery}
        />
        
        <StyledButton wide={true} onPress={() => setModalVisible(true)}>
          <ButtonText>Filter: {selectedGenre || 'None'}</ButtonText>
        </StyledButton>
        <StyledButton wide={true} onPress={fetchBooks}>
          <ButtonText>Search</ButtonText>
        </StyledButton>
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={renderBookItem}
        />
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
              data={genres}
              keyExtractor={(genre) => genre}
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

            {/* Language Selection */}
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

            {/* Sorting Selection */}
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
                  setModalVisible(false);  // Close the modal
                  fetchBooks();            // Fetch books with the applied filters
                }} 
              />
              <Button 
                title="Clear Filters" 
                onPress={() => {
                  clearFilters();          // Clear filters
                  fetchBooks();            // Re-fetch books without filters
                  setModalVisible(false);  // Close the modal
                }} 
                color="orange" 
              />
              <Button 
                title="Close" 
                onPress={() => setModalVisible(false)} // Just close the modal without applying filters
                color="grey" 
              />
            </View>

          </ModalInnerContainer>
        </ModalContainer>
      </Modal>
    </StyledContainer>
  );
};

// Add your styles here
const styles = StyleSheet.create({
  plusButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#007bff',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  plusButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },

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
  },
});

export default Search;

