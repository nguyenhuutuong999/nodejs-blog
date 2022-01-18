const newsRouter = require("./news");
const meRouter = require("./me");
const siteRouter = require("./site");
const coursesRouter = require("./courses");
const paymentRouter = require("./payment");
const emailRouter = require("./email");

function route(app) {
  app.use('/email', emailRouter);
  app.use("/courses", coursesRouter);
  app.use("/me", meRouter);
  app.use("/news", newsRouter);
  app.use('/payment', paymentRouter)
  app.use('/', siteRouter);
}
module.exports = route;
