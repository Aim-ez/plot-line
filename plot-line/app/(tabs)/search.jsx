import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import React, { useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../../components/CredentialsContext.jsx';
import { PageLogo, SearchBar } from '../../components/styles';
import { useNavigation } from '@react-navigation/native';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

const Search = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const navigation = useNavigation();

  // Context
  const { storedCredentials } = useContext(CredentialsContext);
  const { name, username, email } = storedCredentials;

  const fetchBooks = async () => {
    try {
      const genreQuery = selectedGenre ? `+subject:${selectedGenre}` : '';
      const response = await fetch(`${GOOGLE_BOOKS_API}?q=${query}${genreQuery}&key=AIzaSyA4Z1Qm7N2_6AnPLHOtS577y4-nV_NrAb8`);
      const data = await response.json();
      if (data.items) {
        setBooks(data.items);
      } else {
        setBooks([]); // Clear results if no items found
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookItem} 
      onPress={() => navigation.navigate('BookDetails', { book: item })} // Navigate to BookDetails
    >
      <Text style={styles.bookTitle}>{item.volumeInfo.title}</Text>
      <Text style={styles.bookAuthor}>{item.volumeInfo.authors?.join(', ')}</Text>
    </TouchableOpacity>
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
    'LANGUAGE ARTS & DISCIPLINES', 'YOUNG ADULT NONFICTION', 'CHILDREN\'S BOOKS' // Added Children's Books
  ];

  return (
    <View style={styles.container}>
      <PageLogo source={require('../../assets/images/PlotLogo.png')} />
      <SearchBar
        placeholder="Search for books or authors..."
        value={query}
        onChangeText={setQuery}
      />
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterButton}>
        <Text style={styles.buttonText}>Filter: {selectedGenre || 'None'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={fetchBooks} style={styles.searchButton}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={renderBookItem}
        style={styles.results}
      />
      
      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Genre</Text>
            <FlatList
              data={genres}
              keyExtractor={(genre) => genre}
              renderItem={({ item: genre }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedGenre(genre);
                    setModalVisible(false);
                  }}
                  style={styles.genreOption}
                >
                  <Text style={styles.genreText}>{genre}</Text>
                </TouchableOpacity>
              )}
              style={styles.genreList} // Add a style for the FlatList
            />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
  filterButton: {
    backgroundColor: '#798CE7',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
  },
  searchButton: {
    backgroundColor: '#798CE7',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    marginBottom: 10,
  },
  genreOption: {
    padding: 10,
  },
  genreText: {
    fontSize: 16,
  },
  genreList: {
    maxHeight: 300, // Set a maximum height for the FlatList
    marginBottom: 10,
  },
});
