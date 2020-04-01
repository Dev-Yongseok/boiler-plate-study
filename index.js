const express = require('express')
const app = express()
const port = 5000
const bodyParser =require('body-parser');
const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));

// application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://AdminBeginner:AdminBeginner@mongodb-beginner-sqfia.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true , useUnifiedTopology:true , useCreateIndex : true , useFindAndModify : false
}).then(()=> console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res) => {
    
    // 회원 가입 할 때 필요한 정보들을 client에서 가져오면 
    // 그 정보를 데이터베이스에 넣어줌

    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({ success : false , err})
        return res.status(200).json({
            success : true
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))