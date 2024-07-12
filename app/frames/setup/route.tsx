/* eslint-disable react/jsx-key */
import { appURL } from "../../utils";
import { getUsernameAndFid } from "../final/route";
import { State, frames } from "../frames";
import { Button } from "frames.js/next";

export const isNumeric = (str: string) => {
  if (str && typeof str != "string") return false;
  return !isNaN(parseFloat(str));
};

const updateLoveBomb = async (
  id: string | number,
  creator: number,
  state: State
) => {
  await fetch(
    `${appURL()}/api/update-love-bomb?id=${state.id}&recipient=${
      state.recipient
    }&deploymentDate=${state.deploymentDate}&numberOfContributors=${
      state.numberOfContributors
    }&creator=${creator}`
  );
};

const frameHandler = frames(async (ctx) => {
  const state = ctx.state;
  state.error = undefined;
  let setupPos = state.setupPos++;
  console.log(state);

  let textImage = "";
  let textInput = "";
  switch (setupPos) {
    case 0:
      try {
        await getUsernameAndFid(ctx.message?.inputText as string);
        textImage = "Tell me how many people you want to join the Love Bomb.";
        textInput = "Minimum number of contributors";
        if (ctx.message?.inputText) {
          const { fid } = await getUsernameAndFid(ctx.message.inputText);
          console.log(fid);
          state.recipient = fid;
        }
      } catch (error) {
        ctx.state.error =
          "Doesn't exist. Enter a valid recipient fid or username";
        textInput = "Fid or username";
        ctx.state.setupPos = 0;
      }

      break;

    case 1:
      textImage =
        "Tell me in how many days do you want to deploy the Love Bomb.";
      textInput = "Enter a number 1 - 30";
      if (ctx.message?.inputText && isNumeric(ctx.message.inputText)) {
        state.numberOfContributors = +ctx.message.inputText;
      } else {
        state.error =
          "Input error! Try again.\nTell me how many people you want to join the Love Bomb.";
        state.setupPos = state.setupPos--;
      }
      break;

    case 2:
      const today = new Date();
      if (
        ctx.message?.inputText &&
        isNumeric(ctx.message.inputText) &&
        +ctx.message.inputText >= 1 &&
        +ctx.message.inputText <= 30
      ) {
        state.deploymentDate = +today.setDate(
          today.getDate() + +ctx.message.inputText
        );
        await updateLoveBomb(state.id, ctx.message.requesterFid, state);
        textImage = "Create a message";
      } else {
        state.error =
          "Input error! Try again.\nTell me in how many days do you want to deploy the Love Bomb.";
        state.setupPos = state.setupPos--;
      }
  }

  return {
    image: (
      <div tw="flex">
        <div>{state.error ?? textImage}</div>
      </div>
    ),
    textInput,
    buttons: [
      <Button
        action="post"
        target={setupPos <= 1 ? "/setup" : `/message?ref=${state.id}`}
      >
        ⇨
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
