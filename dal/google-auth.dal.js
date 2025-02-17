const bcrypt = require("bcryptjs");
const User = require("../models/User");

const googleAuthDal = {
  registerWithGoogle: async (oauthUser) => {
    const existingUser = await User.findOne({
      email: oauthUser.emails[0].value,
    });
    if (existingUser) {
      return { failure: { message: "User already Registered." } };
    }

    const dummyPassword = await bcrypt.hash("google-auth-dummy-password", 10);

    const user = new User({
      username: oauthUser.displayName,
      email: oauthUser.emails[0].value,
      password: dummyPassword,
      userType: "Client",
      profile: oauthUser.photos[0].value,
      provider: oauthUser.provider,
      googleId: oauthUser.id,
    });
    await user.save();
    return { success: { message: "User Registered." } };
  },
};

module.exports = googleAuthDal;
