import axios from 'axios';
import { HostURL } from '../constants/URL';

const reviewexistsurl = HostURL + "/user/reviewExists";
const bookexistsurl = HostURL + "/user/bookExists";
const bookurl = HostURL + "/user/createBook";

export const checkReviewExists = async (_id, bookId) => {
    try {
      const response = await axios.get(reviewexistsurl, { params: { userId: _id, bookId: bookId } });
      return response.data.status === 'FOUND'; //Returns true if review found, false if not
    } catch (error) {
      console.log(error);
    }
};

export const createPlotlineBook = async (book) => {
    const title = book?.volumeInfo.title || "No Title Available";  // Default title if missing
    const isbn = book.volumeInfo?.industryIdentifiers?.find(identifier => identifier.type === "ISBN_13")?.identifier
      || book.volumeInfo?.industryIdentifiers?.find(identifier => identifier.type === "ISBN_10")?.identifier
      || null;
    const author = book.volumeInfo?.authors?.join(', ') || 'Unknown author';
    const description = book.volumeInfo?.description || 'No description available';
    const published = book.volumeInfo?.publishedDate || 'Unknown publication date';
    const coverLink = book.volumeInfo.imageLinks?.thumbnail || '';

    const bookData = { title: title, isbn, author, description, published, coverLink };
    const exists = await checkPlotBookExists(bookData);

    try {
        if (!exists) {
            const response = await axios.post(bookurl, bookData);
            if (response.data.status === 'SUCCESS') {
                return response.data.data._id;
            } else {
                console.error(response.data.message);
            }
        }
        return exists;
    } catch (error) {
        console.log(error);
    } 
  };

export const checkPlotBookExists = async (bookData) => {
    const { title, author, isbn } = bookData;
    try {
      const response = await axios.get(bookexistsurl, { params: { title: title, author: author, isbn: isbn } });
      if (response.data.status === 'FOUND') {
        return response.data.data.bookId;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  };
