import { expect } from "chai";
import pkg from "pactum";
const { spec } = pkg;
import "dotenv/config";
import { baseURL, userID, user, password } from "../helpers/data.js";

let token_response;
describe("Api tests", () => {
  it.skip("Get request", async () => {
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
      userName: user,
      password: password,
    });
    //.inspect();
    expect(response.statusCode).to.eql(201);
  });

  it.only("Generate token", async () => {
    const response = await spec()
      .post(`${baseURL}/Account/v1/GenerateToken`)
      .withBody({
        userName: user,
        password: password,
      });
    //.inspect();
    token_response = response.body.token;
    console.log(token_response);
  });

  it.only("check token", async () => {
    console.log("token =" + token_response);
  });

  it.only("add book", async () => {
    console.log("token in addbook  " + token_response);
    const response = await spec()
      .post(`${baseURL}/BookStore/v1/Books`)
      .withBearerToken(token_response)
      .withBody({
        userId: userID,
        collectionOfIsbns: [
          {
            isbn: "9781449331818",
          },
        ],
      });
    console.log(response.body);
    expect(response.statusCode).to.eql(201);
  });

  it.skip("check books in user", async () => {
    const response = await spec()
      .get(`${baseURL}/Account/v1/User/${userID}`)
      .withBearerToken(token_response);
    console.log(response.body);
    expect(response.statusCode).to.eql(200);
    console.log(response.body);
  });

  it.only("Delete all books", async () => {
    const response = await spec()
      .delete(`${baseURL}/BookStore/v1/Books?UserId=${userID}`)
      .withBearerToken(token_response)
      .inspect();
    expect(response.statusCode).to.eql(204);
  });

  it.only("check the delete all books", async () => {
    const response = await spec()
      .get(`${baseURL}/BookStore/v1/Books?UserId=${userID}`)
      .withBearerToken(token_response)
      .inspect();
    expect(response.statusCode).to.eql(200);
  });
});
