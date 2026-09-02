import {body} from "express-validator";

const validate = [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({min: 6}).trim().escape()
]

export default validate;