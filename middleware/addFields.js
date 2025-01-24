const addFields = async (req, res, next) => {
  res.locals.addFields = async (data) => {
    if (Array.isArray(data)) {
      for (let item of data) {
        if (!item.rating || !item.cookingTime) {
          item.rating = item.rating || Math.floor(Math.random() * 5) + 1;
          item.cookingTime =
            item.cookingTime || `${Math.floor(Math.random() * 46) + 15} min`;

          await item.save();
        }
      }
      return data.map((item) => item.toObject());
    } else {
      if (!data.rating || !data.cookingTime) {
        data.rating = data.rating || Math.floor(Math.random() * 5) + 1;
        data.cookingTime =
          data.cookingTime || `${Math.floor(Math.random() * 46) + 15} min`;

        await data.save();
      }
      return data.toObject();
    }
  };

  next();
};

module.exports = addFields;
