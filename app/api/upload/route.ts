import { NextResponse } from "next/server";
import randomWords from "random-words";

async function hash(string: string) {
  const utf8 = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

const someSecret = "bla";

export async function POST(request: Request) {
  const json = await request.json();

  const seed = await hash(`${someSecret}${json.imageSrc}`);

  const words = randomWords({ min: 5, max: 5, seed }).join("-");

  return NextResponse.json({ data: words });
}
