const app = require("./config/app");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`The server is running at port ${PORT}`);
});
