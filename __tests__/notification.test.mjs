import sendNotification from "../src/notification.mjs";
import { IncomingWebhook } from "@slack/webhook";

jest.mock("@slack/webhook");

describe("sendNotification", () => {
  it("sends a notification", async () => {
    const sendMock = jest.spyOn(IncomingWebhook.prototype, "send");

    await sendNotification({
      number: "12345",
      currency: "USD",
      amount: 100,
      dueDate: new Date(),
    });

    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining("invoice 12345 of USD 100 is due on"),
      })
    );
  });
});
