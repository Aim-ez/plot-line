// import { StyleSheet, Text, TextInput, View, FlatList, TouchableOpacity } from 'react-native';
// import React, { useState, useContext } from 'react';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { CredentialsContext } from '../../components/CredentialsContext.jsx';

// import {
//   StyledContainer,
//   InnerContainer,
//   PageLogo,
//   PageTitle,
//   SubTitle,
//   StyledFormArea,
//   StyledButton,
//   ButtonText,
//   Line,
//   WelcomeContainer,
//   Avatar,
//   SearchBar,
// } from '../../components/styles';

// const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

// const searchBookByTitle = async (title) => {
//   try {
//     const apiUrl = `${GOOGLE_BOOKS_API}?q=${title}`;
//     const response = await fetch(apiUrl);
//     const data = await response.json();
//     return data.items;
//   } catch (error) {
//     console.error('Error fetching books by title:', error);
//     return null;
//   }
// };

// const searchBookByISBN13 = async (isbn13) => {
//   try {
//     const apiUrl = `${GOOGLE_BOOKS_API}?q=isbn:${isbn13}`;
//     const response = await fetch(apiUrl);
//     const data = await response.json();
//     return data.items;
//   } catch (error) {
//     console.error('Error fetching books by ISBN:', error);
//     return null;
//   }
// };

// const Search = () => {
//   const [query, setQuery] = useState('');
//   const [books, setBooks] = useState([]);
//   const navigation = useNavigation();

//   const { storedCredentials } = useContext(CredentialsContext);
//   const { name, username, email } = storedCredentials;

//   const fetchBooks = async () => {
//     const results = await searchBookByTitle(query);
//     if (results) setBooks(results);
//   };

//   const handleBookPress = (book) => {
//     navigation.navigate('BookDetails', { book });
//   };

//   const renderBookItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.bookItem}
//       onPress={() => navigation.navigate('BookDetails', { book: item })} // Pass the book data
//     >
//       <Text style={styles.bookTitle}>{item.volumeInfo.title}</Text>
//       <Text style={styles.bookAuthor}>{item.volumeInfo.authors?.join(', ')}</Text>
//     </TouchableOpacity>
//   );
  

//   return (
//     <View style={styles.container}>
//       <PageLogo source={require('../../assets/images/PlotLogo.png')} />
//       <SearchBar
//         placeholder="Search for books..."
//         value={query}
//         onChangeText={setQuery}
//       />
//       <TouchableOpacity onPress={fetchBooks} style={styles.searchButton}>
//         <Text style={styles.buttonText}>Search</Text>
//       </TouchableOpacity>
//       <FlatList
//         data={books}
//         keyExtractor={(item) => item.id}
//         renderItem={renderBookItem}
//         style={styles.results}
//       />
//     </View>
//   );
// };

// export default Search;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#EFEBF9',
//     padding: 20,
//   },
//   logo: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     color: '#798CE7',
//     marginBottom: 20,
//   },
//   input: {
//     height: 40,
//     borderColor: '#A574D5',
//     borderWidth: 1,
//     width: '100%',
//     paddingHorizontal: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//     backgroundColor: '#fff',
//   },
//   searchButton: {
//     backgroundColor: '#798CE7',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   results: {
//     width: '100%',
//   },
//   bookItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   bookTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   bookAuthor: {
//     fontSize: 14,
//     color: '#666',
//   },
// });

import { StyleSheet, Text, TextInput, View, FlatList, TouchableOpacity, Modal, Button, Image, Picker } from 'react-native';
import React, { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../../components/CredentialsContext.jsx';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

// Initial filter values to reset to
const initialFilters = {
  genre: '',
  rating: '',
  language: '',
  sortBy: '',
};

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

const Search = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const navigation = useNavigation();

  const { storedCredentials } = useContext(CredentialsContext);
  const { name, username, email } = storedCredentials;

  const fetchBooks = async () => {
    const results = await searchBookByTitle(query);
    if (results) {
      // Apply filters here
      const filteredBooks = results.filter(book => {
        const genreMatch = filters.genre ? book.volumeInfo.categories?.includes(filters.genre) : true;
        const ratingMatch = filters.rating ? book.volumeInfo.averageRating >= parseFloat(filters.rating) : true;
        const languageMatch = filters.language ? book.volumeInfo.language === filters.language : true;
        return genreMatch && ratingMatch && languageMatch;
      });

      // Sort books based on the selected sortBy criteria
      if (filters.sortBy) {
        filteredBooks.sort((a, b) => {
          if (filters.sortBy === 'ratings-high-to-low') {
            return (b.volumeInfo.averageRating || 0) - (a.volumeInfo.averageRating || 0);
          } else if (filters.sortBy === 'alphabetically') {
            return a.volumeInfo.title.localeCompare(b.volumeInfo.title);
          }
          return 0;
        });
      }

      setBooks(filteredBooks);
    }
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

  const clearFilters = () => {
    setFilters(initialFilters);
    fetchBooks(); // Refresh book list without filters
    setModalVisible(false); // Close modal
  };

  return (
    <View style={styles.container}>
      {/* Logo Image */}
      <Image 
        source={require('../../assets/images/PlotLogo.png')} 
        style={styles.logo} 
      />
      <TextInput
        placeholder="Search for books..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <TouchableOpacity onPress={fetchBooks} style={styles.searchButton}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {/* Filter Button */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterButton}>
        <Text style={styles.buttonText}>Filter</Text>
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Select Filters</Text>

            {/* Genre Dropdown */}
            <Text>Genre:</Text>
            <Picker
              selectedValue={filters.genre}
              onValueChange={(itemValue) => setFilters({ ...filters, genre: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="All" value="" />
              <Picker.Item label="Fiction" value="Fiction" />
              <Picker.Item label="Non-Fiction" value="Non-Fiction" />
              <Picker.Item label="Science Fiction" value="Science Fiction" />
              <Picker.Item label="Fantasy" value="Fantasy" />
              <Picker.Item label="Biography" value="Biography" />
            </Picker>

            {/* Rating Dropdown */}
            <Text>Minimum Rating:</Text>
            <Picker
              selectedValue={filters.rating}
              onValueChange={(itemValue) => setFilters({ ...filters, rating: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="All" value="" />
              <Picker.Item label="1 Star" value="1" />
              <Picker.Item label="2 Stars" value="2" />
              <Picker.Item label="3 Stars" value="3" />
              <Picker.Item label="4 Stars" value="4" />
              <Picker.Item label="5 Stars" value="5" />
            </Picker>

            {/* Language Dropdown */}
            <Text>Language:</Text>
            <Picker
              selectedValue={filters.language}
              onValueChange={(itemValue) => setFilters({ ...filters, language: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="All" value="" />
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Spanish" value="es" />
              <Picker.Item label="French" value="fr" />
              <Picker.Item label="German" value="de" />
              <Picker.Item label="Italian" value="it" />
            </Picker>

            {/* Sort By Dropdown */}
            <Text>Sort By:</Text>
            <Picker
              selectedValue={filters.sortBy}
              onValueChange={(itemValue) => setFilters({ ...filters, sortBy: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="None" value="" />
              <Picker.Item label="Alphabetically" value="alphabetically" />
              <Picker.Item label="Ratings: High to Low" value="ratings-high-to-low" />
            </Picker>

            <Button title="Apply Filters" onPress={() => { fetchBooks(); setModalVisible(false); }} />
            <Button title="Clear Filters" onPress={clearFilters} />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

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
    width: 100,
    height: 100,
    resizeMode: 'contain',
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
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#A574D5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  picker: {
    height: 40,
    width: '100%',
    marginVertical: 10,
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
