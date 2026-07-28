const { default: worker } = await import("../dist/server/index.js");

const response = await worker.fetch(new Request("https://fitcenter.test/"), {
  ASSETS: {
    fetch: async (request) => new Response(new URL(request.url).pathname, { status: 200 }),
  },
});

const body = await response.text();
if (body !== "/index.html") {
  throw new Error(`Unexpected route output: ${body}`);
}

console.log(`Worker route OK: ${body}`);
