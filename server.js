const { createServer } = require("http");
const { parse } = require("url");

const next = require("next");

const dev = process.env.NODE_ENV !== "production";

const hostname = "localhost";

const port = 3000;

// when using middleware `hostname` and `port` must be provided below

const app = next({ dev, hostname, port });

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Add cache control headers
      res.setHeader(
        "Cache-Control",
        "public, max-age=3600, stale-while-revalidate=86400"
      );

      // Handle image files with stronger caching
      if (req.url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) {
        res.setHeader(
          "Cache-Control",
          "public, max-age=86400, stale-while-revalidate=604800"
        );
      }

      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname === "/a") {
        await app.render(req, res, "/a", query);
      } else if (pathname === "/b") {
        await app.render(req, res, "/b", query);
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);

      process.exit(1);
    })

    .listen(port, () => {});
});
