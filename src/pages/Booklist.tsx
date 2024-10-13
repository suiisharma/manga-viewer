import "../styles/pages/BookList.css";

import { useEffect, useState } from "react";
import axios from "axios";
import ChapterView from "./ChapterView";
import { BookButton } from "../components/buttons";
import Loading from "../components/loading";
import { toast } from "react-hot-toast";

interface Book {
    id: number;
    title: string;
    chapter_ids: number[];
}

const BookList = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<number | null>(null);

    // Fetch books on component mount
    const fetchBooks = async () => {
        try {
            const { data } = await axios.get<Book[]>("http://52.195.171.228:8080/books/");
            setBooks(data);
            toast.success("Books loaded successfully");
            setSelectedBook(data[0]?.id || null); // Automatically select the first book
        } catch (error) {
            console.error("Error fetching books:", error);
            toast.error("Failed to load books");
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);
    if(books.length === 0){
        return <div className="center">
            <Loading />
        </div>;
    }
    return (
        <div className="booklist-container">
            <div className="book-list">
                {books.map((book) => (
                    <BookButton
                        key={book.id}
                        title={book.title}
                        isSelected={book.id === selectedBook}
                        onClick={() => setSelectedBook(book.id)}
                    />
                ))}
            </div>

            {/* Pass the selected book's chapter_ids to ChapterView */}
            {selectedBook && (
                <ChapterView chapterIds={books.find((book) => book.id === selectedBook)?.chapter_ids || []} />
            )}
        </div>
    );
};



export default BookList;
