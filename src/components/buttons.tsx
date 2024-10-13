import "../styles/components/buttons.css";


export const ChapterButton = ({ title, isSelected, onClick }: { title: string; isSelected: boolean; onClick: () => void }) => {
    return (
        <button className={`book-button ${isSelected ? "selected" : ""}`} onClick={onClick}>
            {title}
        </button>
    );
};


export const BookButton= ({ title, isSelected, onClick }: { title: string; isSelected: boolean; onClick: () => void }) => {
    return (
        <button className={`book-button ${isSelected ? "selected" : ""}`} onClick={onClick}>
            {title}
        </button>
    );
};
