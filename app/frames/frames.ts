import { createFrames } from "frames.js/next";

export type State = {
  id: number | string;
  next: number | string;
  recipient: number | string;
  creator: number | string;
  setupPos: number;
  createPos: number;
  deploymentDate: number;
  numberOfContributors: number;
  messageText: string;
  imageUrl: string;
  error?: string;
  invitee: number | string;
};

export const frames = createFrames<State>({
  basePath: "/frames",
  initialState: {
    id: "",
    next: "",
    recipient: "",
    creator: "",
    setupPos: 0,
    createPos: 0,
    deploymentDate: +new Date(),
    numberOfContributors: 0,
    messageText: "",
    imageUrl: "",
    invitee: "",
  },
  debug: process.env.NODE_ENV === "development",
});
