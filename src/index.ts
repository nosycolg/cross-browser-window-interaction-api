import App from "./app";

const app = new App();

app.server.listen(9999, () => {
  console.log("Connected!");
});
