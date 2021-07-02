const express = require('express');

const { PORT = 3000 } = process.env;
const app = express();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server started on PORT=${PORT}`);
});
