import { expect } from "chai";
import pkg from "pactum";
const { spec } = pkg;
import "dotenv/config";
import { baseURL, userID } from "../helpers/data.js";

describe("Api tests", () => {
  it("Get request", async () => {
    const response = await spec().get(`${baseURL}/BookStore/v1/Books`);
    //.inspect();
    const responseB = JSON.stringify(response.body);
    expect(response.statusCode).to.eql(200);
    //console.log(process.env.SECRET_PASSWORD);
    expect(response.body.books[1].title).to.eql(
      "Learning JavaScript Design Patterns"
    );
    expect(response.body.books[2].pages).to.eql(238);
    expect(response.body.books[4].author).to.eql("Kyle Simpson");

    expect(responseB).to.include("Learning JavaScript Design Patterns");
    const noStarchPublisher = response.body.books.filter(
      (book) => book.publisher === "No Starch Press"
    );
    expect(noStarchPublisher).to.not.be.empty;
    noStarchPublisher.forEach((book) => {
      expect(book.publisher).to.eql("No Starch Press");
      // Add more assertions for other properties if needed
    });
  });

  it.skip("Create a user", async () => {
    const response = await spec().post(`${baseURL}/Account/v1/User`).withBody({
      userName: "TomaszTest",
      password: process.env.SECRET_PASSWORD,
    });
    //.inspect();
    expect(response.statusCode).to.eql(201);
  });
  //
});
