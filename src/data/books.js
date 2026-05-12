import bookGreatAdventure from '../assets/images/book_great_adventure.png';
import bookMysteryNight from '../assets/images/book_mystery_night.png';
import bookSpaceOdyssey from '../assets/images/book_space_odyssey.png';
import bookHistoryUnveiled from '../assets/images/book_history_unveiled.png';
import bookLostKingdom from '../assets/images/book_lost_kingdom.png';
import bookDetectiveStories from '../assets/images/book_detective_stories.png';

const books = [
  {
    id: 1,
    title: "The Great Adventure",
    author: "John Smith",
    category: "fiction",
    price: 499,
    rating: 4.5,
    reviews: 128,
    image: bookGreatAdventure,
    description: "An epic journey through uncharted territories that will keep you on the edge of your seat."
  },
  {
    id: 2,
    title: "Mystery of the Night",
    author: "Jane Doe",
    category: "mystery",
    price: 649,
    rating: 4.7,
    reviews: 95,
    image: bookMysteryNight,
    description: "A gripping mystery that unfolds under the cover of darkness in a city full of secrets."
  },
  {
    id: 3,
    title: "Space Odyssey",
    author: "Mike Johnson",
    category: "sci-fi",
    price: 799,
    rating: 4.8,
    reviews: 210,
    image: bookSpaceOdyssey,
    description: "Journey through the cosmos in this mind-bending science fiction masterpiece."
  },
  {
    id: 4,
    title: "History Unveiled",
    author: "Sarah Williams",
    category: "non-fiction",
    price: 549,
    rating: 4.3,
    reviews: 76,
    image: bookHistoryUnveiled,
    description: "Discover the hidden stories behind the world's most pivotal moments in history."
  },
  {
    id: 5,
    title: "The Lost Kingdom",
    author: "David Brown",
    category: "fiction",
    price: 599,
    rating: 4.6,
    reviews: 154,
    image: bookLostKingdom,
    description: "A fantasy epic about a forgotten realm waiting to be rediscovered by a brave hero."
  },
  {
    id: 6,
    title: "Detective Stories",
    author: "Emily Davis",
    category: "mystery",
    price: 449,
    rating: 4.4,
    reviews: 89,
    image: bookDetectiveStories,
    description: "A collection of thrilling detective tales that will test your deductive skills."
  },
  {
    id: 7,
    title: "Future World",
    author: "Chris Wilson",
    category: "sci-fi",
    price: 699,
    rating: 4.9,
    reviews: 187,
    image: null,
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    icon: "🌌",
    description: "A visionary look at what our world could become in the next century."
  },
  {
    id: 8,
    title: "Life Lessons",
    author: "Anna Taylor",
    category: "non-fiction",
    price: 399,
    rating: 4.2,
    reviews: 63,
    image: null,
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    icon: "💡",
    description: "Timeless wisdom and practical advice for living a more fulfilling life."
  }
];

export default books;
