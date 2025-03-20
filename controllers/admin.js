const Product = require("../models/product");

exports.getAddProduct = async (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  try {
    await Product.create({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    });
    console.log("Product created");
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;

  try {
    const product = await Product.findByPk(prodId);

    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const product = await Product.findByPk(prodId);

    if (!product) {
      console.log("Product not found");
      return res.redirect("/admin/products");
    }

    await product.update({
      title: req.body.title,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
    });

    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
    res.redirect("/admin/products");
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const product = await Product.findByPk(prodId);

    if (!product) {
      return res.redirect("/admin/products");
    }

    await product.destroy();

    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
    res.redirect("/admin/products");
  }
};
