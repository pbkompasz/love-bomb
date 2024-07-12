/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { appURL } from "../utils";

const createNewLoveBomb = async () => {
  const rawResponse = await fetch(`${appURL()}/api/add-love-bomb`);
  const result = await rawResponse.json();
  return result.id;
};

const frameHandler = frames(async (ctx) => {
  const id = await createNewLoveBomb();
  ctx.state.id = id;
  console.log(ctx.state);

  return {
    image: `${appURL()}/love-bomb.avif`,
    textInput: "LoveBomb recipient(username,fid)",
    buttons: [
      <Button action="post" target="/setup">
        Create Love Bomb
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
