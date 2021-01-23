

const constantMap = {
  wrong_password: 'WRONG_PASSWORD',
  user_not_found: 'USER_NOT_FOUND',
  unauthorized: 'UNAUTHORIZED',
};

const errorMap = Object.values(constantMap).reduce((acc, value) => {
  acc[value] = value;
  return acc;
}, {});

const errorResponseMap = {
  [constantMap.wrong_password]: {
    message: "You provided wrong password",
    status: 403
  },
  [constantMap.user_not_found]: {
    message: "No user with given username or email was found",
    status: 403
  },
  [constantMap.unauthorized]: {
    message: "You must be logged in",
    status: 401
  },
}

module.exports = {
  errorMap,
  errorResponseMap,
}