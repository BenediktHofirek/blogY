module.exports = function extractQueryResult(query, isList = false) {
  return (...args) => new Promise((resolve, reject) => {
    query(...args)
      .then((queryResult) => {
        let temp = queryResult;
        while (Array.isArray(temp[0])) {
          temp = temp[0];
        }
        
        const result = temp.length === 1 && !isList ?
          temp[0] :
          temp;
        
        resolve(result);
      })
      .catch((err) => reject(err));
  });
}