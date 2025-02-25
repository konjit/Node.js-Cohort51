import app from "../app.js";
import supertest from "supertest";

import * as helper from "../helper.js";

const request = supertest(app);

describe("POST /", () => {
  // Tests if a city name is not empty string.
  describe("Given an empty city string", () => {
    it("should return 400 with message 'City name is required.' ", async () => {
      const cityName = "";
      await request
        .post("/weather")
        .send({ cityName })
        .expect(400)
        .expect({ message: "City name is required." });
    });
  });

  // Tests that if a city name is not found, the appropriate status code and message are returned.
  describe("Given ", () => {
    describe("a gibberish city name", () => {
      it("should return code 404", async () => {
        const cityName = "ahfeiueriuter";
        await request.post("/weather").send({ cityName }).expect(404);
      });
    });

    describe("a gibberish city name", () => {
      it("should return a message: 'City is not found!'", async () => {
        const cityName = "ahfeiueriuter";
        await request
          .post("/weather")
          .send({ cityName })
          .expect((res) => {
            expect(res.body).toHaveProperty(
              "weatherText",
              "City is not found!"
            );
          });
      });
    });
  });

  // Tests that give a valid city name, the appropriate status code and weather data are returned.
  describe("Given ", () => {
    describe("valid city name", () => {
      it("should return code 200", async () => {
        const cityName = "Addis Ababa";
        await request.post("/weather").send({ cityName }).expect(200);
      });
    });

    describe("valid city name", () => {
      it("should return weather data with a message containing the city name", async () => {
        const cityName = "Addis Ababa";
        const response = await request
          .post("/weather")
          .send({ cityName })
          .expect(200);
    
        expect(response.body).toHaveProperty("weatherText", expect.stringContaining(cityName));
      });
    });
    
  });

  // Tests that given wrong domain, the appropriate status code and message are returned.

  describe("Given ", () => {
    describe("wrong domain address ", () => {
      it("should return 400", async () => {
        const cityName = "Addis Ababa";
        const wrongUrl = helper.getWeatherUrlWithWrongDomain(cityName);

        await request.post("/weather").send({ cityName, wrongUrl }).expect(400);
      });
    });

    describe("wrong domain address ", () => {
      it("should return  a message: 'Invalid domain name.'", async () => {
        const cityName = "Addis Ababa";
        const wrongUrl = helper.getWeatherUrlWithWrongDomain(cityName);

        await request
          .post("/weather")
          .send({ cityName, wrongUrl })
          .expect({ message: "Invalid domain name." });
      });
    });
  });

  // Tests that given wrong API key, the appropriate status code and message are returned.
  describe("Given ", () => {
    describe("wrong credential", () => {
      it("should return 401", async () => {
        const cityName = "Addis Ababa";
        const wrongUrl = helper.getWeatherUrlWithWrongApiKey(cityName);
        await request.post("/weather").send({ cityName, wrongUrl }).expect(401);
      });
    });

    describe("wrong credential ", () => {
      it("should return  a message 'Unauthorized access.'", async () => {
        const cityName = "Addis Ababa";
        const wrongUrl = helper.getWeatherUrlWithWrongApiKey(cityName);

        await request
          .post("/weather")
          .send({ cityName, wrongUrl })
          .expect((res) => {
            expect(res.body).toHaveProperty("message", "Unauthorized access.");
          });
      });
    });
  });
  // Tests that given wrong end point, the appropriate status code and message are returned.
  describe("Given ", () => {
    describe("wrong end point", () => {
      it("should return 404", async () => {
        const cityName = "Addis Ababa";
        const wrongUrl = helper.getWeatherUrlWithWrongEndPoint(cityName);
        await request.post("/weather").send({ cityName, wrongUrl }).expect(404);
      });
    });

    describe("wrong end point ", () => {
      it("should return  a message 'Resource not found.'", async () => {
        const cityName = "Addis Ababa";
        const wrongUrl = helper.getWeatherUrlWithWrongEndPoint(cityName);

        await request
          .post("/weather")
          .send({ cityName, wrongUrl })
          .expect((res) => {
            expect(res.body).toHaveProperty("message", "Resource not found.");
          });
      });
    });
  });
});
