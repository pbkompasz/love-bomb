/* eslint-disable react/jsx-key */
import { appURL } from "../../utils";
import { frames } from "../frames";
import { Button } from "frames.js/next";

const isValidRefId = (refId: number) => {
  return true;
};

const getLoveBomb = async (id: number | string) => {
  const rawResponse = await fetch(`${appURL()}/api/love-bomb?id=${id}`);
  const result = await rawResponse.json();
  return result.loveBomb;
}

const frameHandler = frames(async (ctx) => {
  console.log(ctx);
  const state = ctx.state;
  state.error = undefined;
  const refId = ctx.url.searchParams.get("ref");
  if (refId) {
    console.log("We have a ref");
    if (!isValidRefId(+refId)) {
      state.error = "Invalid frame reference id.";
    } else {
      state.id = +refId;
    }
  }

  // TODO Verify date and if it's active
  const loveBomb = await getLoveBomb(state.id);
  const textImage = `${loveBomb.creator} is creating a Love Bomb for ${loveBomb.recipient}. They have invited you to contribute. Would you like to participate?`;

  return {
    image: (
      <div tw="flex">
        <div>{state.error ?? textImage}</div>
      </div>
    ),
    buttons: [
      <Button action="post" target={`/message?ref=${refId}`}>
        👍
      </Button>,
      <Button
        action="post"
        target={{ query: { rejected: true }, pathname: "/final" }}
      >
        👎
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
