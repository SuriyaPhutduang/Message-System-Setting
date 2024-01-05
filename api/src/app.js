const express = require("express");
const app = express();
const Routes = require("./routes/routes");
const cors = require("cors");



app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(Routes);

const PORT = 14000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
