import { serve } from "./deps.ts";
import generate from "./generate.ts";
const index = await Deno.readFile("./index.html");

const server = serve({ port: 8000 });

for await (let req of server) {
  let search = req.url.replace(/^.*\?/, "");
  if (req.method === "POST") {
    let buf = await Deno.readAll(req.body);
    search = new TextDecoder().decode(buf);
  }

  // TODO: URLSearchParams in browser converts + to space but not in Deno.
  search = search.replace(/\+/g, ' ')

  let q = new URLSearchParams(search.replace(/\+/g, ' '));
  let qv = Object.create(null);
  for (let [k, v] of q) qv[k] = v;

  if (!qv.url && !qv.html) {
    req.respond({ body: index });
    continue;
  }

  try {
    let body = await generate(qv);

    let headers = new Headers();
    headers.set("content-type", "application/pdf");
    headers.set(
      "content-disposition",
      `attachment; filename=${qv.name || "output"}.pdf`,
    );

    req.respond({
      headers,
      body,
    });
  } catch (err) {
    req.respond({ body: err.message });
  }
}
