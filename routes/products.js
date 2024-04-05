// Import express
const express = require("express");
const router = express.Router();

const Product = require("../models/product");

const authorization = require("../extensions/authorization");

router.get("/", async (req, res, next) => {
    let products = await Product.find().sort([["dueDate", "descending"]]);
    // relative to the views folder
    res.render("products/index", {
        title: "Products",
        dataset: products,
        user: req.user,
    });
});

router.get("/add", authorization, async (req, res, next) => {
    res.render("products/add", {
        title: "Add New Product",
        user: req.user,
    });
});

router.post("/add", authorization, async (req, res, next) => {
    let newProduct = new Product({
        name: req.body.name
    });
    await newProduct.save();
    res.redirect("/products");
});

router.get("/delete/:_id", authorization, async (req, res, next) => {
    let productId = req.params._id;
    await Product.findOneAndDelete({ _id: productId });
    res.redirect("/products");
});

router.get("/edit/:_id", authorization, async (req, res, next) => {
    let productId = req.params._id;
    let productData = await Product.findOne({ _id: productId });
    res.render("products/edit", {
        title: "Edit Product",
        product: productData,
        user: req.user,
    });
});

router.post("/edit/:_id", authorization, async (req, res, next) => {
    let productId = req.params._id;
    await Product.findOneAndUpdate(
        { _id: productId },
        {
            name: req.body.name
        }
    );
    res.redirect("/products");
});

// Export router module
module.exports = router;
