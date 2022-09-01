const mongoose = require("mongoose");
const axios = require("axios");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => console.log("Database Connected"));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

async function seedImg() {
  try {
    const resp = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: "YOUR_API_ID_HERE",
        collections: 1114848,
      },
    });
    return resp.data.urls.small;
  } catch (err) {
    console.error(err);
  }
}

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 1000) + 1;
    const camp = new Campground({
      imageUrl: [
        {
          url: "https://res.cloudinary.com/ameennoushad/image/upload/v1655564194/yelpCamp/ws4aq2ljbqymyo1s8iyp.jpg",
          filename: "yelpCamp/ws4aq2ljbqymyo1s8iyp",
        },
        {
          url: "https://res.cloudinary.com/ameennoushad/image/upload/v1655564194/yelpCamp/qu3lrwrqjk02kg8fu3db.jpg",
          filename: "yelpCamp/qu3lrwrqjk02kg8fu3db",
        },
      ],
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      price,
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi, voluptatem beatae expedita temporibus reiciendis consectetur obcaecati quam aspernatur! Dicta magnam, qui minus mollitia reiciendis nihil facere labore sit nesciunt adipisci.Distinctio, at praesentium cumque quae et vel deleniti doloribus accusantium minima delectus quo molestias, saepe iste. Autem possimus a rerum odio, dicta consequuntur corporis, veritatis ipsa molestiae vel nostrum saepe.",
      author: "62a9a00129ae3f09fcdbe12b",
    });
    await camp.save();
  }
};

seedDb().then(() => {
  db.close();
});
