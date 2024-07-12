/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { isNumeric } from "../setup/route";
import { appURL } from "../../utils";
import { Button } from "frames.js/next";

const notifyUser = async (
  organizerUsername: string,
  recipientUsername: string,
  refId: string | number
) => {
  const message = `${organizerUsername} is creating a Love Bomb for ${recipientUsername}. They have invited you to contribute. Would you like to participate?
    ${appURL()}/frames/invite?ref=${refId}
  `;
  try {
    const resp = await fetch(
      "https://api.warpcast.com/v2/ext-send-direct-cast",
      {
        method: "PUT",
        headers: {
          Authorization:
            `Bearer ${process.env.WC_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientFid: 568857,
          message,
          idempotencyKey: 1,
        }),
      }
    );
  } catch (error) {
    return false;
  }
};

const notifyCreator = async () => {
  const message =
    "Your last contributor did not suggest any new contributors. Please suggest a new contributor";
};

export const getUsernameAndFid = async (fidOrUsername: string | number) => {
  const route =
    typeof fidOrUsername === "number" || isNumeric(fidOrUsername)
      ? `user?fid=${fidOrUsername}`
      : `user-by-username?username=${fidOrUsername}`;

  const rawResponse = await fetch(`https://api.warpcast.com/v2/${route}`);
  const content = await rawResponse.json();

  return {
    username: content.result.user.username,
    fid: +content.result.user.fid,
  };
};

const saveMessage = async (
  fid: string | number,
  message: string,
  imageUrl: string,
  loveBombRefId: string | number
) => {
  // Backend
};

export const POST = frames(async (ctx) => {
  console.log(ctx);
  let message = "";
  let textInput = "";
  const rejected = ctx.url.searchParams.get("rejected");
  if (rejected) {
    message =
      "Please suggest someone else to contribute to <username>'s Love Bomb";
    textInput = "Enter username or fid";
  }

  try {
    const { username, fid } = await getUsernameAndFid(ctx.state.invitee);
    const { username: organizerUsername } = await getUsernameAndFid(
      ctx.message?.requesterFid as number
    );
    await saveMessage(
      ctx.message?.requesterFid as number,
      ctx.state.messageText,
      ctx.state.imageUrl,
      ctx.state.id
    );
    await notifyUser(organizerUsername, username, ctx.state.id);
    message = `Notified ${username}(#${fid}). Thank you for submitting!`;
  } catch (error) {
    ctx.state.error = "No such user!";
  }

  return {
    image: (
      <div tw="flex">
        <div>{ctx.state.error ?? message}</div>
      </div>
    ),
    textInput,
    buttons: rejected
      ? [
          <Button action="post" target="/message">
            ⇨
          </Button>,
        ]
      : [],
  };
});
