/**
 * Database Seeder
 * Populates the database with sample movies and an admin user
 * Run with: npm run seed
 */

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Movie = require('../models/Movie.js');
const User = require('../models/User.js');

dotenv.config();

const sampleMovies = [
  {
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
    releaseDate: new Date("2010-07-16"),
    genre: ["Action", "Sci-Fi", "Thriller"],
    rating: 8.8,
    voteCount: 2300000,
    poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page", "Tom Hardy"],
    runtime: 148,
    language: "English",
    featured: true,
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    releaseDate: new Date("2008-07-18"),
    genre: ["Action", "Crime", "Drama"],
    rating: 9.0,
    voteCount: 2700000,
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"],
    runtime: 152,
    language: "English",
    featured: true,
  },
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth becomes uninhabitable.",
    releaseDate: new Date("2014-11-07"),
    genre: ["Adventure", "Drama", "Sci-Fi"],
    rating: 8.6,
    voteCount: 1900000,
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    runtime: 169,
    language: "English",
    featured: true,
  },
  {
    title: "Pulp Fiction",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits interweave in four tales of violence and redemption.",
    releaseDate: new Date("1994-10-14"),
    genre: ["Crime", "Drama"],
    rating: 8.9,
    voteCount: 2100000,
    poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
    director: "Quentin Tarantino",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson", "Bruce Willis"],
    runtime: 154,
    language: "English",
    featured: false,
  },
  {
    title: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    releaseDate: new Date("1994-09-23"),
    genre: ["Drama"],
    rating: 9.3,
    voteCount: 2800000,
    poster: "https://image.tmdb.org/t/p/w500/lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=PLl99DlL6b4",
    director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman"],
    runtime: 142,
    language: "English",
    featured: false,
  },
  {
    title: "The Godfather",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    releaseDate: new Date("1972-03-24"),
    genre: ["Crime", "Drama"],
    rating: 9.2,
    voteCount: 1900000,
    poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLFmd9XlFkSz.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/tmU7GeKVybMWFbq1LPaADhv5qfD.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=sY1S34973zA",
    director: "Francis Ford Coppola",
    cast: ["Marlon Brando", "Al Pacino", "James Caan"],
    runtime: 175,
    language: "English",
    featured: false,
  },
  {
    title: "Avatar",
    description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
    releaseDate: new Date("2009-12-18"),
    genre: ["Action", "Adventure", "Sci-Fi"],
    rating: 7.9,
    voteCount: 1300000,
    poster: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/o0s4XsEDfDlvit5pDRKjzXR4pp2.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=5PSNL1qE6VY",
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
    runtime: 162,
    language: "English",
    featured: false,
  },
  {
    title: "Parasite",
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    releaseDate: new Date("2019-11-08"),
    genre: ["Comedy", "Drama", "Thriller"],
    rating: 8.5,
    voteCount: 850000,
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloROVKwWhR8Es6gODerml.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/ApiBzeaa95TNYLSKkEWbW4KCGk5.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=5xH0HfJHsaY",
    director: "Bong Joon Ho",
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
    runtime: 132,
    language: "Korean",
    featured: true,
  },
  {
    title: "Dune",
    description: "Feature adaptation of Frank Herbert's science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset in the galaxy.",
    releaseDate: new Date("2021-10-22"),
    genre: ["Action", "Adventure", "Drama", "Sci-Fi"],
    rating: 8.0,
    voteCount: 750000,
    poster: "https://image.tmdb.org/t/p/w500/d5NXSklpcKoFRgCF6MDeJhyJ7Xe.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/iopYFB1b6Bh7FWZh3onQhph1sih.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=8g18jFHCLXk",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Rebecca Ferguson", "Oscar Isaac", "Zendaya"],
    runtime: 155,
    language: "English",
    featured: true,
  },
  {
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    releaseDate: new Date("2023-07-21"),
    genre: ["Biography", "Drama", "History"],
    rating: 8.5,
    voteCount: 650000,
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
    runtime: 180,
    language: "English",
    featured: true,
  },
  {
    title: "The Matrix",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    releaseDate: new Date("1999-03-31"),
    genre: ["Action", "Sci-Fi"],
    rating: 8.7,
    voteCount: 1900000,
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
    director: "The Wachowskis",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    runtime: 136,
    language: "English",
    featured: false,
  },
  {
    title: "Everything Everywhere All at Once",
    description: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what's important to her by connecting with the lives she could have led in other universes.",
    releaseDate: new Date("2022-03-25"),
    genre: ["Action", "Adventure", "Comedy", "Sci-Fi"],
    rating: 7.8,
    voteCount: 480000,
    poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/ss0Os3uWJfQAENILHZUdX8Tt1OC.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=wxN1T1uxQ2g",
    director: "Daniel Kwan, Daniel Scheinert",
    cast: ["Michelle Yeoh", "Stephanie Hsu", "Ke Huy Quan", "Jamie Lee Curtis"],
    runtime: 139,
    language: "English",
    featured: false,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Movie.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert movies
    await Movie.insertMany(sampleMovies);
    console.log(`🎬 Inserted ${sampleMovies.length} movies`);

    // Create admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@movieapp.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create regular user
    await User.create({
      name: 'John Doe',
      email: 'user@movieapp.com',
      password: 'user123',
      role: 'user',
    });

    console.log('👤 Created users:');
    console.log('   Admin: admin@movieapp.com / admin123');
    console.log('   User:  user@movieapp.com  / user123');
    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();