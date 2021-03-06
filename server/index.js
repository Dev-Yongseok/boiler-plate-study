const express = require('express')
const app = express()
const port = 5000
const bodyParser =require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true , useUnifiedTopology:true , useCreateIndex : true , useFindAndModify : false
}).then(()=> console.log('MongoDB Connected...'))
.catch(err => console.log(err))


app.post('/api/users/register', (req, res) => { 
    
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

app.post('/api/users/login', (req, res) => {
    // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({email : req.body.email}, (err, user) => {
        console.log("find email...")
        if(!user){
            return res.json({
                loginSuccess : false,
                message : " 제공된 이메일에 해당하는 유저가 없습니다. "
            })
        } console.log("find email pass")
        
        user.comparePassword(req.body.password , (err, isMatch) => {
            console.log("compare password...")
            if(!isMatch)
            return res.json({
                loginSuccess : false,
                message : "비밀번호가 틀립니다."
            })
            console.log("same password")

            //비밀번호까지 맞으면 토큰 생성하기.
            user.generateToken((err, user) => {
                console.log("generate Token...")
                if(err) return res.status(400).send(err);

                // 토큰을 저장한다. 어디에 ? 쿠키 or 로컬 스토리지 
                console.log("save token...")
                
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess : true, userId : user._id})

                console.log("cookie?", res.cookie)
            })
        })
    })
})

app.get('/api/users/auth', auth , (req, res) => {

    console.log(auth)
    console.log("auth진입")
    // 여기 까지 미들웨어를 통과해 왔다는 얘기는 authentication이 true 라는 뜻.
    res.status(200).json({
        _id : req.user._id,
        isAdmin : req.user.role === 0 ? false : true,
        isAuth : true,
        email : req.user.email,
        name : req.user.name,
        lastname :req.user.lastname,
        role :req.user.role,
        image : req.user.image
    })
    console.log("auth탈출")
})

app.get('/api/users/logout', auth, (req, res) => {
    console.log("logout...")
    User.findOneAndUpdate({_id : req.user._id}, 
        { token : "" } 
        , (err, user) => {
            if(err) return res.json({success : false, error});

            console.log("logout Success")

            return res.status(200).send({
                success : true
            })
        })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))