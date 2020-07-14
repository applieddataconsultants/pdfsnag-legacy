import generate from "./generate.ts";
import { assertNotEquals } from "./deps.ts";

Deno.test("generate", async () => {
  let buf = await generate({ url: "https://google.com", grayscale: "" });
  assertNotEquals(buf.length, 0);
  await Deno.writeFile("url.pdf", buf);

  buf = await generate({ html: "<h1>Hi mom</h1>", grayscale: "" });
  assertNotEquals(buf.length, 0);
  await Deno.writeFile("html.pdf", buf);
});
