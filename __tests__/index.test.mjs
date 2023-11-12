import { start } from "../src/index.mjs";
import { MongoClient } from "mongodb";

jest.mock("mongodb");

describe("start", () => {
  it("successfully connects to the database", async () => {
    const dbMock = {
      collection: jest.fn(() => ({
        find: jest.fn(() => ({
          toArray: jest.fn(() => []),
        })),
      })),
    };

    MongoClient.connect.mockResolvedValue(dbMock);

    await start();

    expect(MongoClient.connect).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object)
    );
    expect(dbMock.collection).toHaveBeenCalledWith("invoices");
  });
});
