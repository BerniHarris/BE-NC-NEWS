const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

// ---- connect and disconnect for each test ----
beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET/api/topics", () => {
  describe("GET", () => {
    test("status 200: returns an array of topic objects with a key of slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(res.body.topics.length).toBe(3);
          res.body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("ERRORS", () => {
    test(`status: 404 - returns a path not found message if topic doesn't exist`, () => {
      return request(app)
        .get("/api/jibberish")
        .expect(404)
        .then((res) => {
          expect(res.body.message).toBe("Path not found.");
        });
    });
  });
});

describe("GET/api/articles/:article_id", () => {
  describe("GET", () => {
    test("status 200: returns an article object with specified properties", () => {
      return request(app)
        .get("/api/articles/1") // ---- as askng for article 1, results should match 1
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toBeInstanceOf(Object);
          expect(article).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: expect.any(String),
              votes: 100,
            })
          );
        });
    });
  });
  describe("ERRORS", () => {
    test(`status: 404 - returns a path not found message if article id doesn't exist`, () => {
      return request(app)
        .get("/api/articles/15")
        .expect(404)
        .then((res) => {
          expect(res.body.message).toBe(
            `Article id not found. Please check and try again :)`
          );
        });
    });
    test(`status: 400 - returns invalid error message if id is not input as a number`, () => {
      return request(app)
        .get("/api/articles/notanumber")
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe(
            "Not a valid article id. Please check your id number and try again"
          );
        });
    });
  });
});

describe("PATCH/api/articles/:article_id", () => {
  describe("PATCH", () => {
    test("status: 200 - updates article votees by an increment of 1", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then((res) => {
          const { article } = res.body;
          expect(article).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: expect.any(String),
              votes: 101,
            })
          );
        });
    });
  });
  describe("ERRORS", () => {
    test(`status: 404 - returns a path not found message if article id doesn't exist`, () => {
      return request(app)
        .patch("/api/articles/15")
        .send({ inc_votes: 1 })
        .expect(404)
        .then((res) => {
          expect(res.body.message).toBe(
            `Article id not found. Please check and try again :)`
          );
        });
    });
    test(`status: 400 - returns invalid error message if id is not input as a number`, () => {
      return request(app)
        .patch("/api/articles/notanumber")
        .send({ inc_votes: 1 })
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe(
            "Not a valid article id. Please check your id number and try again"
          );
        });
    });
  });
});

describe("GET/api/users", () => {
  test("status: 200 - should return an array of users objects with a length of 4", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body.length).toEqual(4);
      });
  });
  test("status: 200 - each user object should contain the property of username", () => {
    return request(app)
      .get("/api/users/")
      .expect(200)
      .then((res) => {
        res.body.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET/api/articles", () => {
  describe("GET", () => {
    test("status 200: returns an array of article objects with specified properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          expect(res.body.articles.length).toBe(12);
          res.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
  });
  describe("ERRORS", () => {
    test(`status: 404 - returns a path not found message if article doesn't exist`, () => {
      return request(app)
        .get("/api/jibberish")
        .expect(404)
        .then((res) => {
          expect(res.body.message).toBe("Path not found.");
        });
    });
  });
});

describe("GET/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("status 200: returns an array of comment objects for the given id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
          expect(
            res.body["comments"].forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                })
              );
            })
          );
        });
    });
    test("status 200: returns an empty array if valid article id is requested but article has no comments", () => {
      return request(app)
        .get("/api/articles/7/comments")
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toEqual([]);
        });
    });
  });
  describe("ERRORS", () => {
    test("status 404: returns a not found error if valid id is requested but article does not exist", () => {
      return request(app)
        .get("/api/articles/3000/comments")
        .expect(404)
        .then((res) => {
          expect(res.body.message).toBe("Article not found");
        });
    });
    test("status 400: returns an error if article id is invalid", () => {
      return request(app)
        .get("/api/articles/invalid/comments")
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe(
            "Not a valid article id. Please check your id number and try again"
          );
        });
    });
  });
});

describe("GET/api/articles/:article:id comment count", () => {
  describe("GET", () => {
    test("Status 200: returns an article containing a comment_count property", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          expect(res.body.article.comment_count).toEqual(11);
        });
    });
    test("Status 200: returns an article containing 0 comment counts if the article has no comments", () => {
      return request(app)
        .get("/api/articles/7")
        .expect(200)
        .then((res) => {
          expect(res.body.article.comment_count).toEqual(0);
        });
    });
    test("Status 200: returns a number as a comment_count", () => {
      return request(app)
        .get("/api/articles/9")
        .expect(200)
        .then((res) => {
          expect(res.body.article.comment_count).toEqual(expect.any(Number));
        });
    });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  describe("POST", () => {
    test("status 201: returns a posted comment", () => {
      const userComment = {
        username: "butter_bridge",
        body: "I am finding this very easy to understand",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(userComment)
        .expect(201)
        .then((res) => {
          expect(res.body.comment).toEqual(
            expect.objectContaining({
              comment_id: 19,
              article_id: 1,
              author: "butter_bridge",
              body: "I am finding this very easy to understand",
              votes: 0,
              created_at: expect.any(String),
            })
          );
        });
    });
  });
  describe("ERRORS", () => {
    test("status 400: returns error if no body and username are included in the comment", () => {
      const userComment = {};
      return request(app)
        .post("/api/articles/2/comments")
        .send(userComment)
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe(
            `Don't forget to include your username and comment body!`
          );
        });
    });
    test("status 404: returns error if username doesn't exist", () => {
      const userComment = {
        username: "Berni-Bobs",
        body: "Peice of cake",
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(userComment)
        .expect(404)
        .then((res) => {
          expect(res.body.message).toBe(`Input not found. Please try again`);
        });
    });
    test("status 400: returns a not found error if the article id is valid but does not exist", () => {
      const userComment = {
        username: "butter_bridge",
        body: "Actually, now is a little easier",
      };
      return request(app)
        .post("/api/articles/2000/comments")
        .send(userComment)
        .expect(404)
        .then((res) => {
          expect(res.body.message).toBe(`Input not found. Please try again`);
        });
    });
  });
});
