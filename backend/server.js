const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

const PORT = process.env.PORT || 5000;
// console.log(process.env.BOT_TOKEN);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
