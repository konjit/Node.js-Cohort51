import app from "../app.js";
import supertest from "supertest";

import * as helper from "../helper.js";

const request = supertest(app);

describe("POST /weather", () => {
  // Tests for empty city string
  describe("Given an empty city string", () => {
    it("should return 400 with message 'City name is required.'", async () => {
      const cityName = "";
      await request
        .post("/weather")
        .send({ cityName })
        .expect(400)
        .expect({ message: "City name is required." });
    });
  });

  // Tests for non-existent city name
  describe("Given a gibberish city name", () => {
    it("should return 404", async () => {
      const cityName = "ahfeiueriuter";
      await request.post("/weather").send({ cityName }).expect(404);
    });

    it("should return message 'City is not found!'", async () => {
      const cityName = "ahfeiueriuter";
      await request
        .post("/weather")
        .send({ cityName })
        .expect((res) => {
          expect(res.body).toHaveProperty("weatherText", "City is not found!");
        });
    });
  });

  // Tests for valid city name
  describe("Given a valid city name", () => {
    it("should return 200", async () => {
      const cityName = "Addis Ababa";
      await request.post("/weather").send({ cityName }).expect(200);
    });

    it("should return weather data containing city name", async () => {
      const cityName = "Addis Ababa";
      const response = await request
        .post("/weather")
        .send({ cityName })
        .expect(200);

      expect(response.body).toHaveProperty(
        "weatherText",
        expect.stringContaining(cityName)
      );
    });
  });

  // Tests for wrong domain
  describe("Given a wrong domain", () => {
    it("should return 400", async () => {
      const cityName = "Addis Ababa";
      const wrongUrl = helper.getWeatherUrlWithWrongDomain(cityName);

      await request.post("/weather").send({ cityName, wrongUrl }).expect(400);
    });

    it("should return message 'Invalid domain name.'", async () => {
      const cityName = "Addis Ababa";
      const wrongUrl = helper.getWeatherUrlWithWrongDomain(cityName);

      await request
        .post("/weather")
        .send({ cityName, wrongUrl })
        .expect({ message: "Invalid domain name." });
    });
  });

  // Tests for invalid API key
  describe("Given a wrong API key", () => {
    it("should return 401", async () => {
      const cityName = "Addis Ababa";
      const wrongUrl = helper.getWeatherUrlWithWrongApiKey(cityName);
      await request.post("/weather").send({ cityName, wrongUrl }).expect(401);
    });

    it("should return message 'Unauthorized access.'", async () => {
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

  // Tests for wrong endpoint
  describe("Given a wrong end point", () => {
    it("should return 404", async () => {
      const cityName = "Addis Ababa";
      const wrongUrl = helper.getWeatherUrlWithWrongEndPoint(cityName);
      await request.post("/weather").send({ cityName, wrongUrl }).expect(404);
    });

    it("should return message 'Resource not found.'", async () => {
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
