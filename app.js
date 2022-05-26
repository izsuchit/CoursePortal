const express=require('express');
const app=express();
const path=require('path');
const body=require('body-parser');
const port=process.env.PORT||5000;
const client = require("./db.js");
const session=require("express-session")
const passport=require('passport');
const req = require('express/lib/request');
const FacebookStrategy=require("passport-facebook").Strategy


app.use(body.json());
app.use(body.urlencoded({ extended: true }));

/* VIEW ENGINE SETUP */
app.set('views',path.join(__dirname,'public'))
app.engine('html',require('ejs').renderFile)
app.set('view engine','ejs')                     
app.use(express.static('public'))

app.get('/',(req,res)=>{
   
  res.render('home.html')
})


/*Authentication  function */
let x=2;
const authentication=(req,res,next)=>{
    if(x==1){
        next()
    }else{
        res.write(
            '<script>window.alert("Not Authenticated");window.location="/login";</script>'
          );
        
    }
}




app.get('/login/static',authentication,(req,res)=>{
  res.render('courses.html')

})

/* SIGN UP */
app.get('/signup',(req,res)=>{
    res.render('signup')
})
client.connect();


app.post('/signup',async(req,res)=>{
    const user=req.body;
    
    let insertQuery=`insert into costumers(name,email,dob,address,mobile,Password)
    values('${user.name}','${user.email}','${user.dob}','${user.address}','${user.mobile}','${user.Password}')`

    await client.query(insertQuery,(err,result)=>{
        try{
            res.write(
                '<script>window.alert("Succefully SignUp");window.location="/login";</script>'
              );
           
        }
        catch(err){ 
            res.write(
                '<script>window.alert("Email already used");window.location="/signup";</script>'
                );
            }
    })
    client.end;
})

/* LOGIN */

app.get('/login',(req,res)=>{
    res.render('login');
})

app.post('/login',async(req,res)=>{
    const user=req.body;
    
let searchQuery=`Select * from costumers where email=('${user.email}') AND Password=('${user.Password}')`


await client.query(searchQuery,(err,result)=>{
  
    try{
        let size=Object.keys(result.rows).length;
        if(size==0){
            res.write(
                '<script>window.alert("Invalid Credentials");window.location="/signup";</script>'
              );
           
           
            
        }
        else{
             x=1;
            res.redirect('/login/static')
            

    }
      
    }catch{
        res.send('Invalid Credentials');
        console.log(err.message);
    }
})
client.end;
})

app.get('/logout',(req,res)=>{
    x=0;
    res.redirect('/login')
})

/* FACEBOOK AUTH */
app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user,cb)=>{
    cb(null,user);
 });
 
 passport.deserializeUser((obj,cb)=>{
   cb(null,obj);
 });

passport.use(new FacebookStrategy({
    clientID: '569455867865680',
    clientSecret: 'e4fbd7b18ba7fb943c0c087f37cbe6b6',
    callbackURL: "http://localhost:5000/auth/facebook/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    let id=profile.id;
    let name=profile.displayName;
    let insertQuery=`insert into fb (facebookId,Name)
    values('${id}','${name}') on conflict(facebookid)
    do update set facebookid=('${id}')`
     client.query(insertQuery,(err,result)=>{
      try{
       console.log('done')
       return cb(err,result);
    }
    catch(err){ 
        console.log(err)
    }
  })
    client.end;
    console.log(profile)
  }
));



app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.render('secrets');
    
  });




/* GOOGLE AUTH*/
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '394811893043-5b63cv1ot9u6or5isi2b40vc8bdll3ur.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    let id=profile.id;
    let name=profile.displayName;
    let insertQuery=`insert into fb (facebookId,Name)
    values('${id}','${name}') on conflict(facebookid)
    do update set facebookid=('${id}')`
     client.query(insertQuery,(err,result)=>{
      try{
       console.log('done')
      
    }
    catch(err){ 
        console.log(err)
    }
  })
    client.end;

    userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
   
    res.render('secrets');
  });




/* QUERY SUBMIT  */
app.post('/querysubmit',async(req,res)=>{
    const user=req.body;
    const name=user.fname+' '+user.lname;
   
    let insertQuery=`insert into query(name,email,mobile,info)
    values('${name}','${user.email}','${user.number}','${user.query}')`

    await client.query(insertQuery,(err,result)=>{
        try{
            res.write(
                '<script>window.alert("Form Submitted");window.location="/";</script>'
              );
           
        }
        catch(err){ 
            res.write(
                '<script>window.alert("Email already used");window.location="/submit";</script>'
                );
            }
    })
    client.end;



})

app.get('/login/computer',authentication,(req,res)=>{
  res.render('computer.html')
})
app.get('/login/electrical',authentication,(req,res)=>{
  res.render('electrical.html')
})
app.get('/login/mechanical',authentication,(req,res)=>{
  res.render('mechanical.html')
})
app.get('/login/chemical',authentication,(req,res)=>{
  res.render('chemical.html')
})
app.get('/login/mse',authentication,(req,res)=>{
  res.render('mse.html')
})
app.get('/login/civil',authentication,(req,res)=>{
  res.render('civil.html')
})
app.get('/login/aerospace',authentication,(req,res)=>{
  res.render('aerospace.html')
})
app.get('/login/mth',authentication,(req,res)=>{
  res.render('mth.html')
})

app.listen(port,()=>{
    console.log(`Server Listening on port no : ${port}`);
})
