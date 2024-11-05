import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';

const BookDetails = ({ route }) => {
  const { book } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {book.volumeInfo.imageLinks?.thumbnail && (
        <Image source={{ uri: book.volumeInfo.imageLinks.thumbnail }} style={styles.image} />
      )}
      <Text style={styles.title}>{book.volumeInfo.title}</Text>
      <Text style={styles.authors}>Authors: {book.volumeInfo.authors?.join(', ')}</Text>
      <Text style={styles.description}>{book.volumeInfo.description || "No description available."}</Text>
    </ScrollView>
  );
};

export default BookDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EFEBF9',
  },
  image: {
    width: 150,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  authors: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
