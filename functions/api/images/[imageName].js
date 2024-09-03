export async function onRequestGet(context) {
  const { imageName } = context.params;

  const object = await context.env.IMAGES_BUCKET.get(imageName);

  if (object === null) {
    return new Response("Object Not Found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);

  return new Response(object.body, {
    headers,
  });
}