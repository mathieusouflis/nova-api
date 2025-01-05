export default function path(req, res, next) {
  console.log("New req : ", req.originalUrl);
  next();
}
