import Favorite from "../models/favouriteList.js";

export const addToFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const favorite = await Favorite.create({
      user: userId,
      product: productId,
    });

    res
      .status(201)
      .json({ status: "success", message: "Added to favorites", favorite });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          status: "fail",
          message: " Product already exists in your favorites ",
        });
    }
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const removeFromFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const result = await Favorite.findOneAndDelete({
      user: userId,
      product: productId,
    });

    if (!result) {
      return res
        .status(404)
        .json({
          status: "fail",
          message: " Product not found in your favorites ",
        });
    }

    res
      .status(200)
      .json({
        status: "success",
        message: "Removed from favorites successfully",
      });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getMyFavorites = async (req, res) => {
  try {
    const userId = req.user._id;

    const favorites = await Favorite.find({ user: userId }).populate("product");

    res.status(200).json({
      status: "success",
      results: favorites.length,
      data: favorites,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
