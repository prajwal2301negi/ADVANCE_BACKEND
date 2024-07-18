import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cloudinary from "cloudinary";
import session from 'express-session';
import { errorMiddleware } from './utils/errorMiddleware.js';
import database from './database/dbConnection.js';
import ErrorHandler from './utils/errorMiddleware.js';
import asyncErrorHandler from './utils/asyncErrorHandler.js';
import adminRouter from './routes/admin.routes.js';
import partnerWithUsRouter from './routes/partnerWithUs.routes.js';
import userRouter from './routes/user.routes.js';
import connectWithUsRouter from './routes/connectWithUs.routes.js'
import zlib from 'zlib';
import MongoStore from 'connect-mongo';
import cluster from 'cluster';
import os from 'os';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import sanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import toobusy from 'toobusy-js';
import ExpressBrute from 'express-brute'
import svgCaptcha from 'svg-captcha';
import csrf from 'csurf';
import compression from 'compression';




const app = express();

app.use(helmet());
app.use(helmet.hsts());
app.use(helmet.xframe());
helmet.xframe('sameorigin');


export let limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'We have received too many requests from this Address. Please try after 1 hour.'
})
limiter.addLimit('/api/v1/user/login', "POST", 5, 500);


app.use(express.json({ limit: '5kb' }));
app.use(sanitize());
app.use(xss());
app.use(hpp({
  whitelist: [
    'category',
    'brand',
    'price',
    'rating',
    'discount',
    'color',
    'weight',
    'stock',
    'rating',
    'review',
    'description',
    'features',
    'warranty',
  ]
}));

app.use(express.urlencoded({ extended: true, limit: '5kb' }));
app.use(compression({
  level: 6,
  threshold: 10 * 1000,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
}));

app.use(function (req, res, next) {
  if (toobusy()) {
    res.send(503, "Server too busy");
  }
  else {
    next();
  }
})

toobusy.maxLag(10);
toobusy.interval(250);

var store = new ExpressBrute.MemoryStore();
export var bruteforce = new ExpressBrute(store);


const totalCPUs = os.cpus().length;

if (cluster.isPrimary) {
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

}
else {

  const PORT = 8000;

  app.get('/', (req, res) => {
    return res.json({
      message: `Hello World from ${process.pid}`
    })
  })

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })

}

dotenv.config();
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: { maxAge: 60000 * 60, httpOnly: true, secure: true, sameSite: true },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO,
  })


}))

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);



const csrfProtection = csrf({ cookie: true });
app.get('/form', csrfProtection, function (req, res) {
  res.render('send', { csrfToken: req.csrfToken() })
})

app.post('/process', parseForm, csrfProtection, function (req, res) {
  res.send('Data is being processed');
})


fs.createReadStream('./sample.txt').pipe(
  zlib.createGzip().pipe(
    fs.createWriteStream('./sample.zip')
  )
)

app.get('/fileRead', (req, res) => {
  const stream = fs.createReadStream('./sample.txt', 'utf-8');
  stream.on('data', (chunk) => res.write(chunk));
  stream.on('end', () => res.end());
})

app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/connect', connectWithUsRouter);
app.use('/api/v1/partner', partnerWithUsRouter);
app.all('*', asyncErrorHandler(async (req, res, next) => {
  return next(new ErrorHandler("Page does not exist", 404));
}));


database();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(errorMiddleware);


// app.listen(PORT,()=>{
//   console.log(`Server running on port ${PORT}`);
// })

// app.patch('/api/user/:id',async(req,res)=>{
//     const{ body, params:{id}} = request;
//     req.session.visited = true;
//     const parsedId = parseInt(id);
//     if(isNaN(parsedId)) return res.status(400);

//     const user = await User.findById(parsedId);
//     if(!user){
//         return next(new ErrorHandler("User not found",400));
//     }

//     const updateUser = await User.findByIdAndUpdate(parsedId,{
//         body
//     })
//     User[findUserIndex] = {... User[findUserIndex], ...body};
//     return res.status(200);
// })


app.get('/captcha', function (req, res) {
  var captcha = svgCaptcha.create();
  req.session.captcha = captcha.text;
  res.type('svg');
  res.status(200).send(captcha.data);
})