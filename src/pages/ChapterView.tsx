import "../styles/pages/ChapterView.css";

import { useState, useEffect } from "react";
import axios from "axios";
import { ChapterButton } from "../components/buttons";
import Loading from "../components/loading";
import { toast } from "react-hot-toast";

// Interfaces for Page and Chapter
interface Page {
    id: number;
    page_index: number;
    image: {
        file: string;
    };
}

interface Chapter {
    id: number;
    title: string;
    chapter_index: number;
    pages: Page[];
}

// Component to display a single chapter
const ChapterView = ({ chapterIds, currentChapterIndex, setCurrentChapterIndex }: { chapterIds: number[], currentChapterIndex: number, setCurrentChapterIndex: (index: number) => void }) => {
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    

    // Fetch chapter data when the current chapter index changes
    useEffect(() => {
        // Fetch chapter data from the API
        const fetchChapter = async (chapterId: number) => {
            try {
                const { data } = await axios.get<Chapter>(`http://52.195.171.228:8080/chapters/${chapterId}/`);
                setChapter(data);
                setCurrentPageIndex(0); // Reset page index to 0 when chapter changes
            } catch (error) {
                console.error("Error fetching chapter:", error);
                toast.error("Failed to load chapter");
            }
        };
        if (chapterIds.length > 0) {
            fetchChapter(chapterIds[currentChapterIndex]);
        }
    }, [currentChapterIndex, chapterIds]);


    // Handle page navigation
    const handlePageClick = (direction: 'next' | 'prev') => {
        if (!chapter) return;

        if (direction === 'next') {
            if (currentPageIndex < chapter.pages.length - 1) {
                setCurrentPageIndex(currentPageIndex + 1);
            } else if (currentChapterIndex < chapterIds.length - 1) {
                setCurrentChapterIndex(currentChapterIndex + 1);
            }
        } else if (direction === 'prev') {
            if (currentPageIndex > 0) {
                setCurrentPageIndex(currentPageIndex - 1);
            } else if (currentChapterIndex > 0) {
                setCurrentChapterIndex(currentChapterIndex - 1);
                setCurrentPageIndex(chapter.pages.length - 1); // Set to last page of previous chapter
            }
        }
    };

    // Render loading indicator if chapter data is not available
    if (!chapter) {
        return <Loading></Loading>;
    }

    return (
        <>
            <BookList
                chapterIds={chapterIds}
                currentChapterIndex={currentChapterIndex}
                setCurrentChapterIndex={setCurrentChapterIndex}
            />
            <ChapterViewContainer
                currentPage={chapter.pages[currentPageIndex]}
                currentPageIndex={currentPageIndex}
                totalPages={chapter.pages.length}
                handlePageClick={handlePageClick}
            />
        </>
    );
};

// Component to display the list of chapters
const BookList = ({ chapterIds, currentChapterIndex, setCurrentChapterIndex }: { chapterIds: number[], currentChapterIndex: number, setCurrentChapterIndex: (index: number) => void }) => {
    return (
        <div className="book-list">
            {chapterIds.map((id, index) => (
                <ChapterButton
                    key={id}
                    title={(id - chapterIds[0] + 1).toString()}
                    isSelected={currentChapterIndex === index}
                    onClick={() => setCurrentChapterIndex(index)}
                />
            ))}
        </div>
    );
};

// Component to display the chapter view container
const ChapterViewContainer = ({ currentPage, currentPageIndex, totalPages, handlePageClick }: { currentPage: Page, currentPageIndex: number, totalPages: number, handlePageClick: (direction: 'next' | 'prev') => void }) => {
    return (
        <div className="chapter-view-container">
            <img
                src={currentPage.image.file}
                alt={`Page ${currentPage.page_index + 1}`}
                className="chapter-image"
                onClick={(e) => {
                    const { left, right } = e.currentTarget.getBoundingClientRect();
                    if (e.clientX < (left + right) / 2) {
                        handlePageClick('prev');
                    } else {
                        handlePageClick('next');
                    }
                }}
            />
            <div className="page-indicator">
                {currentPageIndex + 1}/{totalPages}
            </div>
        </div>
    );
};

export default ChapterView;
