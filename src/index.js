const express = require('express');

const app = express();
const rateLimitMiddleware = require("./middlewares/rate-limit-middleware");
const { START_SERVER_PORT : PORT } = require('./config/server-config') || 3001;
const apiRoutes = require('./routes/index');

function setupAndStartServer() {

    app.use(express.json());
    app.use(rateLimitMiddleware);
    app.use("/api", apiRoutes);

    function errorHandler(err, req, res, next) {
        if (err instanceof TokenExpiredError) {
            res.json({
                error: err,
                message: "JWT Token Expired",
                data: null,
                success: false
            })
        }
        console.error("global catch says", err.stack);
        return res.json({
            error : err,
            message : err.message || "Something went wrong",
            data : null,
            success : false
        })
    }

    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log("Application started at port", PORT);
    })
}

setupAndStartServer();