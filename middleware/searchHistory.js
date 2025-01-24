const searchHistory = [];

const trackSearchHistory = (req, res, next) => {
  const { name } = req.query;

  if (name && !searchHistory.includes(name)) {
    if (searchHistory.length >= 4) {
      searchHistory.shift();
    }
    searchHistory.push(name);
  }

  res.locals.searchHistory = searchHistory;
  next();
};

module.exports = { trackSearchHistory, searchHistory };
