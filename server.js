const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const app = express();
require('dotenv').config()

app.use(bodyParser.json());


app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.get('/',(req,res)=>{
    res.send('hii from server')
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 3000;
const server=app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports=app