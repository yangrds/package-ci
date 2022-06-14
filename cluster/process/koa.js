const Koa = require("koa");
const static = require("koa-static");
const app = new Koa();

const { port, name, dist, project } = process.env;

app.use(static(dist));

app.use(async (ctx) => {
  if (ctx.request.url === "/status") {
    ctx.body = { port, env: name, status: "ok", project };
  }
});

app.on("close", () => {
  process.send({ type: "close", msg: "服务关闭" });
});


app.listen(port, "0.0.0.0", (err) => {
   process.send({ type: "listen", msg: "启动成功" });
});

