const ERROR_CODE = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
}

const ACCESS_TOKEN_EXPIRED = new Error('Access token has expired.');
ACCESS_TOKEN_EXPIRED.code = ERROR_CODE.BAD_REQUEST;

const DATA_NOT_FOUND = new Error('Data not found.');
DATA_NOT_FOUND.code = ERROR_CODE.NOT_FOUND;

const REQUIRED_FIELD_IS_MISSING = new Error('Required field is missing');
REQUIRED_FIELD_IS_MISSING.code = ERROR_CODE.BAD_REQUEST;

const EMAIL_OR_URL_ALREADY_EXISTS = new Error('Email or url already exists!');
EMAIL_OR_URL_ALREADY_EXISTS.code = ERROR_CODE.BAD_REQUEST;

const INVALID_EMAIL = new Error('Invalid email.');
INVALID_EMAIL.code = ERROR_CODE.BAD_REQUEST;

const INVALID_PASSWORD = new Error('Invalid password.');
INVALID_PASSWORD.code = ERROR_CODE.BAD_REQUEST;

const INVALID_EMAIL_OR_PASSWORD = new Error('Invalid email or password');
INVALID_EMAIL_OR_PASSWORD.code = ERROR_CODE.BAD_REQUEST;

const PERMISSION_DENIED = new Error('Access token not found.');
PERMISSION_DENIED.code = ERROR_CODE.UNAUTHORIZED;

const INVALID_ACCESS_TOKEN = new Error('Expired Token.');
INVALID_ACCESS_TOKEN.code = ERROR_CODE.INTERNAL_SERVER_ERROR;

module.exports = {
    ACCESS_TOKEN_EXPIRED,
    DATA_NOT_FOUND,
    REQUIRED_FIELD_IS_MISSING,
    EMAIL_OR_URL_ALREADY_EXISTS,
    INVALID_EMAIL,
    INVALID_PASSWORD,
    INVALID_EMAIL_OR_PASSWORD,
    INVALID_ACCESS_TOKEN,
    PERMISSION_DENIED,
}