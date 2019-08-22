const mongoose = require("mongoose"),
  Book = require("./models/book"),
  Review = require("./models/review");

const data = [
  {
    title: "Mindset: The New Psychology of Success",
    image:
      "https://libgen.is/covers/227000/9087c0c017eeaaf43b3d44199d4738c6-d.jpg",
    description:
      "After decades of research, world-renowned Stanford University psychologist Carol S. Dweck, Ph.D., discovered a simple but groundbreaking idea: the power of mindset. In this brilliant book, she shows how success in school, work, sports, the arts, and almost every area of human endeavor can be dramatically influenced by how we think about our talents and abilities. People with a fixed mindset — those who believe that abilities are fixed — are less likely to flourish than those with a growth mindset — those who believe that abilities can be developed. Mindset reveals how great parents, teachers, managers, and athletes can put this idea to use to foster outstanding accomplishment."
  },
  {
    title: "Boneshaker",
    image:
      "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1433161048l/1137215._SY475_.jpg",
    description:
      "In the early days of the Civil War, rumors of gold in the frozen Klondike brought hordes of newcomers to the Pacific Northwest. Anxious to compete, Russian prospectors commissioned inventor Leviticus Blue to create a great machine that could mine through Alaska’s ice. Thus was Dr. Blue’s Incredible Bone-Shaking Drill Engine born."
  },
  {
    title: "The Anubis Gates",
    image:
      "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1344409006l/142296.jpg",
    description:
      "Brendan Doyle, a specialist in the work of the early-nineteenth century poet William Ashbless, reluctantly accepts an invitation from a millionaire to act as a guide to time-travelling tourists. But while attending a lecture given by Samuel Taylor Coleridge in 1810, he becomes marooned in Regency London, where dark and dangerous forces know about the gates in time. Caught up in the intrigue between rival bands of beggars, pursued by Egyptian sorcerers, befriended by Coleridge, Doyle somehow survives. And learns more about the mysterious Ashbless than he could ever have imagined possible."
  }
];

const reviewData = [
  {
    review: "This book is life changing!!",
    author: "Emilda Zhang",
    rating: 5
  }
];

const seedDB = () => {
  Review.deleteMany({});
  Book.deleteMany({}, err => {
    if (err) {
      console.log(err);
    }
    data.forEach(seed =>
      Book.create(seed, (err, book) => {
        if (err) {
          console.log(err);
        }
        Review.create(reviewData[0], (err, review) => {
          if (err) {
            console.log(err);
          } else {
            book.reviews.push(review);
            book.save();
          }
        });
      })
    );
  });
};

module.exports = seedDB;
