const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const mongoose = require('mongoose')
const { Schema } = mongoose;
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("❌ MONGO_URI is not defined in .env file");
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));


const UserSchema = new Schema({
  username: String,
});

const User = mongoose.model("User", UserSchema);

const ExerciceSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  description: String,
  duration: Number,
  date: Date,
});

const Exercice = mongoose.model("Exercice", ExerciceSchema);

app.use(cors());
app.use(express.json());
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get("/api/users", async (req, res) => {
  const users = await User.find({}).select("_id username");
  if (!users) {
    res.send("No users");
  } else {
    res.json(users);
  }
})

app.post("/api/users", async (req, res) => {
console.log(req.body)
if (!req.body.username) {
  return res.status(400).json({ error: "Username is required" });
}
const userObj = new User({
  username: req.body.username
})

try {
  const user = await userObj.save()
  console.log(user);
  res.json(user)
} catch(err){
  console.log(err)
}

})

app.post("/api/users/:_id/exercices", async (req, res) => {
  const id = req.params._id;
  const { description, duration, date } = req.body
  try {
    const user = await User.findById(id);
    if (!user){
      return res.status(404).json({ error: "User not found" });
    } 
      const exerciceObj = new Exercice({
        user_id: user._id,
        description,
        duration: parseInt(duration),
        date: date ? new Date(date) : new Date()
      });

      const exercice = await exerciceObj.save();

      res.json({
        _id: user._id,
        username: user.username,
        description: exercice.description,
        duration: exercice.duration,
        date: exercise.date.toDateString(),
      });
    
  } catch(err) {
console.log(err);
res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/users/:_id/logs", async (req, res)  => {
  const { from, to, limit } = req.query;
  const id = req.params._id;
  try {
  const user = await User.findById(id);
  if (!user){
    return res.status(404).json({ error: "User not found" });
  }

  let filter = { user_id: id };
  let dateObj = {};

  if(from) {
    dateObj["$gte"] = new Date(from)
  } 
  if(to) {
    dateObj["$lte"] = new Date(to)
  }
  
  if(from || to){
    filter.date = dateObj;
  }}

  const exercices = await Exercice.find(filter).limit(limit ? parseint(limit) : 500);
  
  const log = exercices.map(e => ({
    description: e.description,
    duration: e.duration,
    date: e.date.toDateString()
  }));

  res.json({
    username: user.username,
    count: log.length,
    _id: user._id,
    log
  });
 } catch (err) {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
}
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
