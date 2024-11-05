// import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
// import React, { useState, useContext } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { CredentialsContext } from '../../components/CredentialsContext.jsx';
// import { PageLogo, SearchBar } from '../../components/styles';
// import { useNavigation } from '@react-navigation/native';

// const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

// const Search = () => {
//   const [query, setQuery] = useState('');
//   const [books, setBooks] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedGenre, setSelectedGenre] = useState('');
//   const navigation = useNavigation();

//   // Context
//   const { storedCredentials } = useContext(CredentialsContext);
//   const { name, username, email } = storedCredentials;

//   const fetchBooks = async () => {
//     try {
//       const genreQuery = selectedGenre ? `+subject:${selectedGenre}` : '';
//       const response = await fetch(`${GOOGLE_BOOKS_API}?q=${query}${genreQuery}&key=AIzaSyA4Z1Qm7N2_6AnPLHOtS577y4-nV_NrAb8`);
//       const data = await response.json();
//       if (data.items) {
//         setBooks(data.items);
//       } else {
//         setBooks([]); // Clear results if no items found
//       }
//     } catch (error) {
//       console.error('Error fetching books:', error);
//     }
//   };

//   const renderBookItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.bookItem} 
//       onPress={() => navigation.navigate('BookDetails', { book: item })} // Navigate to BookDetails
//     >
//       <Text style={styles.bookTitle}>{item.volumeInfo.title}</Text>
//       <Text style={styles.bookAuthor}>{item.volumeInfo.authors?.join(', ')}</Text>
//     </TouchableOpacity>
//   );

//   const genres = [
//     'ANTIQUES & COLLECTIBLES', 'LITERARY COLLECTIONS', 'ARCHITECTURE', 'LITERARY CRITICISM', 'ART', 
//     'MATHEMATICS', 'BIBLES', 'MEDICAL', 'BIOGRAPHY & AUTOBIOGRAPHY', 'MUSIC', 'BODY, MIND & SPIRIT', 
//     'NATURE', 'BUSINESS & ECONOMICS', 'PERFORMING ARTS', 'COMICS & GRAPHIC NOVELS', 'PETS', 'COMPUTERS', 
//     'PHILOSOPHY', 'COOKING', 'PHOTOGRAPHY', 'CRAFTS & HOBBIES', 'POETRY', 'DESIGN', 'POLITICAL SCIENCE', 
//     'DRAMA', 'PSYCHOLOGY', 'EDUCATION', 'REFERENCE', 'FAMILY & RELATIONSHIPS', 'RELIGION', 'FICTION', 
//     'SCIENCE', 'FOREIGN LANGUAGE STUDY', 'SELF-HELP', 'GAMES & ACTIVITIES', 'SOCIAL SCIENCE', 'GARDENING', 
//     'SPORTS & RECREATION', 'HEALTH & FITNESS', 'STUDY AIDS', 'HISTORY', 'TECHNOLOGY & ENGINEERING', 'HOUSE & HOME', 
//     'TRANSPORTATION', 'HUMOR', 'TRAVEL', 'JUVENILE FICTION', 'TRUE CRIME', 'JUVENILE NONFICTION', 'YOUNG ADULT FICTION', 
//     'LANGUAGE ARTS & DISCIPLINES', 'YOUNG ADULT NONFICTION', 'CHILDREN\'S BOOKS' // Added Children's Books
//   ];

//   return (
//     <View style={styles.container}>
//       <PageLogo source={require('../../assets/images/PlotLogo.png')} />
//       <SearchBar
//         placeholder="Search for books or authors..."
//         value={query}
//         onChangeText={setQuery}
//       />
//       <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterButton}>
//         <Text style={styles.buttonText}>Filter: {selectedGenre || 'None'}</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={fetchBooks} style={styles.searchButton}>
//         <Text style={styles.buttonText}>Search</Text>
//       </TouchableOpacity>
//       <FlatList
//         data={books}
//         keyExtractor={(item) => item.id}
//         renderItem={renderBookItem}
//         style={styles.results}
//       />
      
//       {/* Filter Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Select Genre</Text>
//             <FlatList
//               data={genres}
//               keyExtractor={(genre) => genre}
//               renderItem={({ item: genre }) => (
//                 <TouchableOpacity
//                   onPress={() => {
//                     setSelectedGenre(genre);
//                     setModalVisible(false);
//                   }}
//                   style={styles.genreOption}
//                 >
//                   <Text style={styles.genreText}>{genre}</Text>
//                 </TouchableOpacity>
//               )}
//               style={styles.genreList} // Add a style for the FlatList
//             />
//             <Button title="Close" onPress={() => setModalVisible(false)} />
//           </View>
//         </View>
//       </Modal>
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
//   filterButton: {
//     backgroundColor: '#798CE7',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 20,
//     width: '100%',
//   },
//   searchButton: {
//     backgroundColor: '#798CE7',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 20,
//     width: '100%',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     textAlign: 'center',
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
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     width: '80%',
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   genreOption: {
//     padding: 10,
//   },
//   genreText: {
//     fontSize: 16,
//   },
//   genreList: {
//     maxHeight: 300, // Set a maximum height for the FlatList
//     marginBottom: 10,
//   },
// });
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import React, { useState } from 'react';
import { PageLogo, SearchBar } from '../../components/styles';
import { useNavigation } from '@react-navigation/native';

GOOGLE_BOOKS_API_KEY = 'AIzaSyA4Z1Qm7N2_6AnPLHOtS577y4-nV_NrAb8'

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

const Search = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const navigation = useNavigation();

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
    <TouchableOpacity 
      style={styles.bookItem} 
      onPress={() => navigation.navigate('BookDetails', { book: item })}
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
    'LANGUAGE ARTS & DISCIPLINES', 'YOUNG ADULT NONFICTION', 'CHILDREN\'S BOOKS'
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
            <Text style={styles.modalTitle}>Select Filters</Text>

            {/* Genre Selection */}
            <Text style={styles.sectionTitle}>Genre</Text>
            <FlatList
              data={genres}
              keyExtractor={(genre) => genre}
              renderItem={({ item: genre }) => (
                <TouchableOpacity
                  onPress={() => setSelectedGenre(genre)}
                  style={[styles.optionButton, selectedGenre === genre && styles.selectedOption]}
                >
                  <Text style={styles.optionText}>{genre}</Text>
                </TouchableOpacity>
              )}
              style={styles.genreList}
            />

            {/* Language Selection */}
            <Text style={styles.sectionTitle}>Language</Text>
            <View style={styles.selectionRow}>
              <TouchableOpacity
                onPress={() => setSelectedLanguage('en')}
                style={[styles.optionButton, selectedLanguage === 'en' && styles.selectedOption]}
              >
                <Text style={styles.optionText}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedLanguage('fr')}
                style={[styles.optionButton, selectedLanguage === 'fr' && styles.selectedOption]}
              >
                <Text style={styles.optionText}>French</Text>
              </TouchableOpacity>
            </View>

            {/* Sorting Selection */}
            <Text style={styles.sectionTitle}>Sort By</Text>
            <View style={styles.selectionRow}>
              <TouchableOpacity
                onPress={() => setSortOrder('A-Z')}
                style={[styles.optionButton, sortOrder === 'A-Z' && styles.selectedOption]}
              >
                <Text style={styles.optionText}>Alphabetically A-Z</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSortOrder('Z-A')}
                style={[styles.optionButton, sortOrder === 'Z-A' && styles.selectedOption]}
              >
                <Text style={styles.optionText}>Alphabetically Z-A</Text>
              </TouchableOpacity>
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

          </View>
        </View>
      </Modal>
    </View>
  );
};

// Add your styles here
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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

