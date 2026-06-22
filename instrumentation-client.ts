import { initBotId } from "botid/client/core";

// Attach BotID bot-detection to the submission server action. Server actions
// invoked from /submit POST to that route, so we protect that path+method.
// checkBotId() on the server only works for paths declared here.
initBotId({
  protect: [{ path: "/submit", method: "POST" }],
});
