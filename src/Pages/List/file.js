// BookList.js
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig"; // Ensure the path is correct
import { collection, getDocs } from "firebase/firestore";

const BookList = () => {
  const [books, setBooks] = useState([]);

  // Fetch books from Firestore on component mount
  useEffect(() => {
    const fetchBooks = async () => {
        const booksCollection = collection(db, "books");
        const bookSnapshot = await getDocs(booksCollection);
        const bookList = bookSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      
        console.log("Fetched books:", bookList); // Log the fetched books
      
        // Sort books by publishedDate (assuming it exists and is in a comparable format)
        bookList.sort((a, b) => {
          const dateA = new Date(a.publishedDate);
          const dateB = new Date(b.publishedDate);
          console.log("Comparing:", dateA, dateB); // Log the dates being compared
          return dateB - dateA; // Newest first
        });
      
        console.log("Sorted books:", bookList); // Log the sorted books
        setBooks(bookList); // Set books to the sorted list
      };

    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Список книг</h1> {/* "Book List" in Russian */}
      <ul>
        {books.map((book, index) => (
          <li key={book.id}>
            {index + 1}{" "}
            {/* This will display 1 for the first item, 2 for the second, and so on */}
            <h2>{book.title}</h2>
            <p>Автор: {book.author}</p>
            {book.coverUrl && (
              <img
                src={book.coverUrl}
                alt={`${book.title} cover`}
                width="100"
              />
            )}
            <a href={book.fileUrl} target="_blank" rel="noopener noreferrer">
              Скачать книгу
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
