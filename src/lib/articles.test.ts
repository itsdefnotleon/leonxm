import { describe, expect, it } from "vitest";
import { articleLastEdited, articles } from "./articles";

describe("article edit dates", () => {
  it("provides a last-edited date for every article", () => {
    for (const article of articles) {
      expect(articleLastEdited(article), article.id).toBeTruthy();
    }
  });

  it("uses the original publication date when there is no later revision", () => {
    const article = articles.find((item) => item.id === "account-privacy-controls");
    expect(article).toBeDefined();
    expect(articleLastEdited(article!)).toBe("November 15, 2026");
  });

  it("records the Zyphonic article's November 15 rewrite", () => {
    const article = articles.find((item) => item.id === "ilikeradio-swarm-zyphonic-metadata-restored");
    expect(article).toBeDefined();
    expect(articleLastEdited(article!)).toBe("November 15, 2026");
  });
});
