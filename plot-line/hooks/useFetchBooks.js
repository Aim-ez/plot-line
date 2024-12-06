import { useState } from 'react';

const GOOGLE_BOOKS_API_KEY = 'AIzaSyA4Z1Qm7N2_6AnPLHOtS577y4-nV_NrAb8';
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

const useFetchBooks = (query, selectedGenre, selectedLanguage, resultsPerPage, sortOrder) => {
  const [books, setBooks] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchBooks = async () => {
    try {
      const genreQuery = selectedGenre ? `+subject:${selectedGenre}` : '';
      const languageQuery = selectedLanguage ? `&langRestrict=${selectedLanguage}` : '';
      const url = `${GOOGLE_BOOKS_API}?q=${query}${genreQuery}${languageQuery}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=${resultsPerPage}`;
  
      console.log("Fetching books with URL: ", url); // Log URL to check if it's constructed correctly
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
  
      const data = await response.json();
      let fetchedBooks = data.items || [];
      setBooks(fetchedBooks);
      setTotalResults(data.totalItems || 0);
      setHasSearched(true);
  
      // Apply sorting
      if (sortOrder === 'A-Z') {
        fetchedBooks.sort((a, b) => a.volumeInfo.title.localeCompare(b.volumeInfo.title));
      } else if (sortOrder === 'Z-A') {
        fetchedBooks.sort((a, b) => b.volumeInfo.title.localeCompare(a.volumeInfo.title));
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };
  

  return { books, totalResults, hasSearched, fetchBooks };
};

export default useFetchBooks;

