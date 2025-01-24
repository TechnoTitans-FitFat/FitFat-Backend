const Address = require("../models/Address");
const User = require("../models/User");

module.exports = {
  createAddress: async (req, res) => {
    const address = new Address({
      userId: req.user.id,
      addressLine1: req.body.addressLine1,
      city: req.body.city,
      state: req.body.state,
      district: req.body.district,
      postalCode: req.body.postalCode,
      country: req.body.country,
      deliveryInstructions: req.body.deliveryInstructions,
      default: req.body.default,
    });

    try {
      if (req.body.default) {
        await Address.updateMany({ userId: req.user.id }, { default: false });
      }

      await address.save();

      await User.findByIdAndUpdate(req.user.id, {
        $push: { address: address._id },
      });

      res.status(201).json({
        status: true,
        message: "Address added successfully",
        address,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  deleteAddress: async (req, res) => {
    const addressId = req.params.id;

    try {
      const address = await Address.findById(addressId);

      if (!address) {
        return res
          .status(404)
          .json({ status: false, message: "Address not found" });
      }

      await Address.findByIdAndDelete(addressId);

      await User.findByIdAndUpdate(req.user.id, {
        $pull: { address: addressId },
      });

      res.status(200).json({
        status: true,
        message: "Address deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getDefaultAddress: async (req, res) => {
    const userId = req.user.id;

    try {
      const defaultAddress = await Address.findOne({ userId, default: true });

      res.status(200).json(defaultAddress);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getUserAddress: async (req, res) => {
    const userId = req.user.id;

    try {
      const address = await Address.find({ userId });

      res.status(200).json(address);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  updateAddress: async (req, res) => {
    const addressId = req.params.id;
    const addressData = {
      userId: req.user.id,
      addressLine1: req.body.addressLine1,
      city: req.body.city,
      state: req.body.state,
      district: req.body.district,
      postalCode: req.body.postalCode,
      country: req.body.country,
      deliveryInstructions: req.body.deliveryInstructions,
      default: req.body.default,
    };

    try {
      if (req.body.default) {
        await Address.updateMany({ userId: req.user.id }, { default: false });
      }

      const updatedAddress = await Address.findByIdAndUpdate(
        addressId,
        addressData,
        {
          new: true,
        }
      );

      if (!updatedAddress) {
        return res
          .status(404)
          .json({ status: false, message: "Address not found" });
      }

      res.status(200).json({
        status: true,
        message: "Address updated successfully",
        address: updatedAddress,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  setDefaultAddress: async (req, res) => {
    const addressId = req.body.addressId;
    const userId = req.user.id;

    try {
      await Address.updateMany({ userId }, { default: false });

      const updatedAddress = await Address.findByIdAndUpdate(
        addressId,
        { default: true },
        { new: true }
      );

      if (updatedAddress) {
        res.status(200).json({
          status: true,
          message: "Default address updated successfully",
        });
      } else {
        res.status(404).json({ status: false, message: "Address not found" });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
};
