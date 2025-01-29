const searchHistory = {
  name: [],
  title: [],
};

const trackSearchHistory = (req, res, next) => {
  const { name, title } = req.query;

  if (name && !searchHistory.name.includes(name)) {
    if (searchHistory.name.length >= 4) {
      searchHistory.name.shift();
    }
    searchHistory.name.push(name);
  }

  if (title && !searchHistory.title.includes(title)) {
    if (searchHistory.title.length >= 4) {
      searchHistory.title.shift();
    }
    searchHistory.title.push(title);
  }

  res.locals.searchHistory = searchHistory;
  next();
};

module.exports = { trackSearchHistory, searchHistory };
