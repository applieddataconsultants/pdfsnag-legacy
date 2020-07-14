type Options = Record<string, string>;

const parse = (key: string, value: string): [string, string] => {
  switch (key) {
    case "copies":
    case "image-dpi":
    case "image-quality":
    case "javascript-delay":
    case "minimum-font-size":
    case "outline-depth":
    case "page-offset":
    case "zoom":
      return [key, String(Number(value))];

    case "encoding":
    case "load-error-handling":
    case "margin-bottom":
    case "margin-left":
    case "margin-right":
    case "margin-top":
    case "orientation":
    case "output-format":
    case "page-height":
    case "page-size":
    case "page-width":
    case "password":
    case "proxy":
    case "title":
    case "user-style-sheet":
    case "username":
      return [
        key,
        value.replace("$", "\\$").replace("&", "\\&").replace(";", "\\;"),
      ];

    case "background":
    case "collate":
    case "default-header":
    case "disable-external-links":
    case "disable-forms":
    case "disable-internal-links":
    case "disable-javascript":
    case "disable-smart-shrinking":
    case "disable-toc-back-links":
    case "enable-external-links":
    case "enable-forms":
    case "enable-internal-links":
    case "enable-javascript":
    case "enable-smart-shrinking":
    case "enable-toc-back-links":
    case "exclude-from-outline":
    case "grayscale":
    case "images":
    case "include-in-outline":
    case "lowquality":
    case "no-background":
    case "no-collate":
    case "no-images":
    case "no-outline":
    case "no-pdf-compression":
    case "no-print-media-type":
    case "no-stop-slow-scripts":
    case "outline":
    case "print-media-type":
    case "stop-slow-scripts":
      return [key, ""];
    default:
      return ["", ""];
  }
};

function parseOptions(opts: Options) {
  let args = [];
  for (let key in opts) {
    let [k, v] = parse(key, opts[key]);
    if (k) {
      args.push("--" + key);
      if (v) args.push(v);
    }
  }
  return args;
}

const cleanURL = (v: string) =>
  encodeURI(decodeURI(v))
    .replace("$", "\\$")
    .replace("&", "\\&")
    .replace(";", "\\;");

export default async function ({ url, html, ...opts }: Options) {
  let args = parseOptions(opts);
  let p;

  if (url) {
    p = Deno.run({
      cmd: ["wkhtmltopdf", ...args, cleanURL(url), "-"],
      stdout: "piped",
      stderr: "piped",
    });
  } else {
    p = Deno.run({
      cmd: ["wkhtmltopdf", ...args, "-", "-"],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    });
    await Deno.writeAll(p.stdin, new TextEncoder().encode(html));
    p.stdin.close();
  }

  let { code } = await p.status();

  let stdout = await p.output();
  let stderr = await p.stderrOutput();
  p.close();

  if (code !== 0) {
    throw new Error(new TextDecoder().decode(stderr));
  }

  return stdout;
}
