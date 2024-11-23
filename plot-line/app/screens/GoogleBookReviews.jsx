import React, {useEffect, useState} from 'react';

// Host URL
import { HostURL } from '../../constants/URL.ts'

// API client
import axios from 'axios';

import {
    StyledContainer,
    InnerContainer,
    ExtraText,
    
} from '../../components/styles';

/*
Basically, we have to take in the Google book, and determine if it
has an equivalent plotline book. 
If it does:
    -> Get the Plotline book information, pass to PlotlineBookReviews
If it doesn't:
    -> Display 'No reviews yet!'
*/

const GoogleBookReviews = ({route, navigation}) => {
    const { book } = route.params;

    const existsurl = HostURL + "/user/bookExists";
    const getbookurl = HostURL + "/user/getBookData";

    const [ bookToSend, setBookToSend ] = useState();
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);
    const [reviews, setReviews ] = useState(null);

    const checkPlotBookExists= async () => {
        const title = book.volumeInfo.title;
        const author = book.volumeInfo.authors?.join(', ')
        const isbn = book.volumeInfo?.industryIdentifiers?.find(identifier => identifier.type === "ISBN_13")?.identifier 
        || book.volumeInfo?.industryIdentifiers?.find(identifier => identifier.type === "ISBN_10")?.identifier
        || null;    


        try {
            const response = await axios.get(existsurl, {params:
                {
                    title: title,
                    author: author,
                    isbn: isbn
                }
            })

            if (response.data.status == 'NOT FOUND') {
                setReviews(
                    <StyledContainer>
                    <InnerContainer>
                    <ExtraText>This book doesn't have any reviews yet!</ExtraText>
                    </InnerContainer>
                    </StyledContainer>
                );
            } else if (response.data.status == 'FOUND') {
                const bookId = response.data.data.bookId
                const res = await axios.get(getbookurl, {params: {bookId: bookId}})
                //res.data.data contains book data
                const plotBookInfo = res.data.data;
                console.log("PlotBookInfo: ", plotBookInfo)
                navigation.replace('PlotlineBookReviews', {book: plotBookInfo})
            } else {
                console.error('Error checking if plot book exists', response.data);
                setError("An error occured. Check your network and try again.");
            }
        } catch (error) {
            console.log(error);
            setError("An error occurred. Check your network and try again.")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkPlotBookExists();
    }, []);

    if (loading) {
        return (
            <StyledContainer>
                <InnerContainer>
                    <ExtraText>Loading...</ExtraText>
                </InnerContainer>
            </StyledContainer>
        );
    }

    if (error) {
        return (
            <StyledContainer>
                <InnerContainer>
                    <ExtraText>{error}</ExtraText>
                </InnerContainer>
            </StyledContainer>
        );
    }

    return reviews;
}

export default GoogleBookReviews;

