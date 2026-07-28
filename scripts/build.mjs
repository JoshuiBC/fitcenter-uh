import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const client = resolve(dist, "client");
const server = resolve(dist, "server");

if (dirname(dist) !== root || basename(dist) !== "dist") {
  throw new Error("Refusing to clean an unexpected build directory.");
}

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

const rootFiles = await readdir(root, { withFileTypes: true });
for (const entry of rootFiles) {
  if (entry.isFile() && extname(entry.name) === ".html") {
    await cp(resolve(root, entry.name), resolve(client, entry.name));
  }
}

for (const directory of ["css", "js", "img", "rutinas", "nutricionistas"]) {
  await cp(resolve(root, directory), resolve(client, directory), { recursive: true });
}

const worker = `const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/") url.pathname = "/index.html";
    if (url.pathname.endsWith("/")) url.pathname += "index.html";

    let response = await env.ASSETS.fetch(new Request(url, request));
    if (response.status !== 404 || url.pathname.includes(".")) return response;

    url.pathname += ".html";
    response = await env.ASSETS.fetch(new Request(url, request));
    return response;
  },
};

export default worker;
`;

await writeFile(resolve(server, "index.js"), worker, "utf8");

const required = [
  resolve(client, "index.html"),
  resolve(client, "css", "estilos.css"),
  resolve(client, "js", "script.js"),
  resolve(client, "img", "logo-fitcenter-uh.png"),
  resolve(server, "index.js"),
];

for (const file of required) {
  await readFile(file);
}

console.log(`FitCenter UH build created at ${dist}`);
