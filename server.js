const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;


app.use(cors({
  origin: "http://localhost:3000", 
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());

app.use('/api/v1/products', require('./routers/productRoute'));
app.use('/api/v1/users', require('./routers/userRoute'));
app.use('/api/v1/cart', require('./routers/cartRoute'));
app.use('/api/v1/orders', require('./routers/orderRoute'));

app.listen(port, () => {
  console.log(`Server is Running at port ${port}`);
});
