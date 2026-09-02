import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message:{
        error: true,
        message: "Too Many requests, Please try again Later"
    },
    standardHeaders: true,
    legacyHeaders: false
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message:{
        error:true,
        message:"Too many auth attempt requests, Please Try Again Later"
    },
    standardHeaders: true,
    legacyHeaders: false
})