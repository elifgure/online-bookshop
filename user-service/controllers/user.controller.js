const User = require("../models/User");
const jwt = require("jsonwebtoken")

// jwt oluşturma fonksiyonu
const createToken = (id)=> {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRES_IN || '30d'
    })
}
// yeni kullanıcı kaydı
exports.register = async (req, res)=>{
    try {
        const {name, email, password} = req.body
        const existingUser = await User.findOne({ $or: [{ email }, { name }] })
        if(existingUser){
            return res.status(400).json({message: "Kullanıcı zaten kayıtlı"})
        }
        const user = await User.create({
            name, 
            email,
            password
        })
        const token = createToken(user._id)
        res.status(200).json({
            status: "success",
            token,
            user:{
                id: user._id,
                name:user.name,
                email: user.email
            }
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}
// giriş işlemi
exports.login = async (req, res)=>{
    try {
        const {email, password} = req.body
         if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = await User.findOne({email})
      if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // token oluşturma
    const token = createToken(user._id)
    res.status(200).json({
          status: 'success',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
    } catch (error) {
        res.status(500).json({
      status: 'error',
      message: error.message
    });
    }
}
// protect middleware
exports.protect = async (req, res, next)=>{
    try {
        let token
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1]
        }
        if(!token){
            return res.status(401).json({message: "Yetkisiz erişim"})
        }
        // token doğrulama
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const currentUser = await User.findById(decoded.id)
        if(!currentUser){
            return res.status(401).json({message: "Kullanıcı bulunamadı"})
        }
        req.user = currentUser
        next()
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}
// kullanıcı bilgisi
exports.getUser = async (req, res)=>{
    res.status(200).json({
        status: "success",
        user:{
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
    })
}