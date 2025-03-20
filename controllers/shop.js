const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = async (_, res) => {
  try {
    const products = await Product.findAll();

    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const prodId = req.params.productId;
    const product = await Product.findByPk(prodId);

    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (error) {
    console.log(error);
  }
};

// exports.getIndex = (req, res, next) => {
//   Product.fetchAll(products => {
//     res.render('shop/index', {
//       prods: products,
//       pageTitle: 'Shop',
//       path: '/'
//     });
//   });
// };

exports.getIndex = async (_, res) => {
  try {
    const products = await Product.findAll();

    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();

    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: products,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCart = async (req, res) => {
  try {
    const prodId = req.body.productId;
    const cart = await req.user.getCart();
    const [existingProduct] = await cart.getProducts({ where: { id: prodId } });

    if (existingProduct) {
      await existingProduct.cartItem.increment("quantity");
    } else {
      const product = await Product.findByPk(prodId);
      await cart.addProduct(product, { through: { quantity: 1 } });
    }

    res.redirect("/cart");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add product to cart" });
  }
};

exports.postCartDeleteProduct = async (req, res) => {
  try {
    const prodId = req.body.productId;
    const cart = await req.user.getCart();
    const [product] = await cart.getProducts({ where: { id: prodId } });

    if (product) {
      await product.cartItem.destroy();
    }

    res.redirect("/cart");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete product from cart" });
  }
};

exports.postOrder = async (req, res) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    const order = await req.user.createOrder();

    await order.addProducts(
      products.map((product) => {
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      })
    );

    await cart.setProducts(null);

    res.redirect("/orders");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await req.user.getOrders({ include: ["products"] });
    console.log("ORDERS", orders);
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
