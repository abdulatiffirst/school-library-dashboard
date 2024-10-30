// UploadBook.js
import React, { useState, useEffect, useRef } from "react";
import { db, storage } from "../../firebase/firebaseConfig"; // Ensure the path is correct
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UploadBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState(""); // You can store tags as a comma-separated string or as an array  const [file, setFile] = useState(null);
  const [cover, setCover] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // State to track loading status

  // Refs for file inputs
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Load data from local storage on component mount
  useEffect(() => {
    const savedTitle = localStorage.getItem("bookTitle");
    const savedAuthor = localStorage.getItem("bookAuthor");
    const savedFile = localStorage.getItem("bookFile");
    const savedCover = localStorage.getItem("bookCover");

    if (savedTitle) setTitle(savedTitle);
    if (savedAuthor) setAuthor(savedAuthor);
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !cover) return; // Ensure both file and cover are selected
  
    setLoading(true); // Set loading to true when upload starts
  
    // Save data to local storage
    localStorage.setItem("bookTitle", title);
    localStorage.setItem("bookAuthor", author);
    localStorage.setItem("bookFile", file.name);
    localStorage.setItem("bookCover", cover.name);
    localStorage.setItem("bookPublishedDate", publishedDate); // Save published date
    localStorage.setItem("bookDescription", description); // Save description
    localStorage.setItem("bookTags", tags); // Save tags
  
    try {
      // Uploading the book file
      const fileRef = ref(storage, `books/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef); // Get the download URL for the file
  
      // Uploading the cover image
      const coverRef = ref(storage, `covers/${cover.name}`);
      await uploadBytes(coverRef, cover);
      const coverUrl = await getDownloadURL(coverRef); // Get the download URL for the cover
  
      // Prepare book data to be saved in Firestore
      const bookData = {
        title,
        author,
        publishedDate,
        description,
        tags: tags.split(",").map(tag => tag.trim()), // Convert tags to an array
        fileUrl, // URL of the uploaded book file
        coverUrl, // URL of the uploaded cover
      };
  
      // Add the book data to Firestore
      await addDoc(collection(db, "books"), bookData);
  
      // Clear local storage on successful upload
      localStorage.removeItem("bookTitle");
      localStorage.removeItem("bookAuthor");
      localStorage.removeItem("bookFile");
      localStorage.removeItem("bookCover");
      localStorage.removeItem("bookPublishedDate");
      localStorage.removeItem(" bookDescription");
      localStorage.removeItem("bookTags");
  
      // Reset state
      setTitle("");
      setAuthor("");
      setPublishedDate("");
      setDescription("");
      setTags("");
      setFile(null);
      setCover(null);
  
      setLoading(false); // Set loading to false when upload is complete
    } catch (error) {
      console.error("Error uploading book:", error);
      setLoading(false); // Set loading to false on error
    }
  };

  return (
    <form onSubmit={handleUpload}>
    <input
      type="text"
      placeholder="Название книги" // "Book Title" in Russian
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
    />
    <input
      type="text"
      placeholder="Автор" // "Author" in Russian
      value={author}
      onChange={(e) => setAuthor(e.target.value)}
      required
    />
    <input
      type="date" // Use date input for published date
      value={publishedDate}
      onChange={(e) => setPublishedDate(e.target.value)}
      required
    />
    <textarea
      placeholder="Описание" // "Description" in Russian
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      required
    />
    <input
      type="text"
      placeholder="Теги (разделенные запятыми)" // "Tags (comma separated)" in Russian
      value={tags}
      onChange={(e) => setTags(e.target.value)}
    />
    <input
      type="file"
      ref={fileInputRef} // Attach ref to the file input
      onChange={(e) => setFile(e.target.files[0])}
      required
    />
    <input
      type="file"
      ref={coverInputRef} // Attach ref to the cover input
      onChange={(e) => setCover(e.target.files[0])}
      required
    />
    <button type="submit" disabled={loading}>Загрузить книгу</button> {/* "Upload Book" in Russian */}
    {loading && <p>Загрузка... Пожалуйста, подождите.</p>} {/* "Loading... Please wait." in Russian */}
  </form>
  );
};

export default UploadBook;