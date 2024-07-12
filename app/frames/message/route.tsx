/* eslint-disable react/jsx-key */
import { appURL } from "../../utils";
import { State, frames } from "../frames";
import { Button } from "frames.js/next";

export const isNumeric = (str: string) => {
  if (str && typeof str != "string") return false;
  return !isNaN(parseFloat(str));
};

const createMessage = async (sender: number, state: State) => {
  await fetch(
    `${appURL()}/api/add-message?loveBombRefId=${state.id}&messageText=${
      state.messageText
    }&imageUrl=${state.imageUrl}&senderFid=${sender}`
  );
};

const isValidUrl = (str: string) => {
  let url;

  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};

const validateRefId = (refId: number) => {
  return true;
};

const frameHandler = frames(async (ctx) => {
  console.log(ctx);
  const state = ctx.state;
  state.error = undefined;
  let createPos = state.createPos++;
  const refId = ctx.url.searchParams.get("ref");

  // TODO Only continue if it is the invited user
  if (createPos === 0)
    if ((refId && !validateRefId(+refId)) || !refId) {
      console.log(refId, "missing");
      state.error = "Invalid or missing reference.";
    } else {
      state.id = +refId;
    }

  let textImage = "";
  let textInput = "";
  switch (createPos) {
    case 0:
      textImage = `Enter text for your message.`;
      textInput = 'message (320 character limit)"';

      break;

    case 1:
      textImage =
        "Paste the image URL in the box below. Leave blank if there's no image";
      textInput = "Enter image URL";
      if (ctx.message?.inputText && ctx.message.inputText.length <= 320) {
        state.messageText = ctx.message.inputText;
      } else {
        state.error = "Input error! Try again.\nEnter text for your message.";
        state.setupPos = state.setupPos--;
      }
      break;

    case 2:
      // TODO If mx number is reached display message
      textImage =
        "Invite one other person to join the minimum contributors for this Love Bomb.";
      textInput = "Enter username or fid";
      if (
        !ctx.message?.inputText ||
        (ctx.message?.inputText && isValidUrl(ctx.message.inputText))
      ) {
        state.imageUrl = "" + ctx.message?.inputText;
      } else {
        state.error =
          "Input error! Try again.\nPaste the image URL in the box below. Leave blank if there's no image";
        state.setupPos = state.setupPos--;
      }
      break;

    case 3:
      textImage =
        "We'll notify the other contributors about this Love Bomb. Once the minimum number of contributors has added their text and images, we will deploy the Love Bomb after the number of days has transpired.";
      textInput = "";
      if (ctx.message?.inputText) {
        state.invitee = ctx.message?.inputText;
        await createMessage(ctx.message.requesterFid, state);
      } else {
        state.error =
          "Input error! Try again.\nInvite at least one other person to join the minimum contributors for this Love Bomb";
        state.setupPos = state.setupPos--;
      }
      break;
  }

  return {
    image: (
      <div tw="flex">
        <div>{state.error ?? textImage}</div>
      </div>
    ),
    textInput,
    buttons: [
      <Button action="post" target={createPos <= 2 ? "/message" : "/final"}>
        {createPos <= 2 ? "⇨" : "Notify the next contributor"}
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
