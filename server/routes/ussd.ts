import { RequestHandler } from "express";

// Simple USSD flow emulator
// text: "" => show root menu
// "1" => advice, "2" => market buyers, "3" => record help
export const handleUssd: RequestHandler = (req, res) => {
  const { text = "", phoneNumber = "" } = (
    req.method === "GET" ? req.query : req.body
  ) as any;
  const input = String(text);

  if (input === "") {
    return res
      .type("text/plain")
      .send(
        "CON KrishiSetu\n1. Get Advice\n2. Find Buyer\n3. Record Farm\n0. Exit",
      );
  }
  if (input === "0") {
    return res.type("text/plain").send("END Thank you");
  }
  if (input.startsWith("1")) {
    return res
      .type("text/plain")
      .send("END Advice: Irrigate 10mm this week. Pest risk: Low");
  }
  if (input.startsWith("2")) {
    return res
      .type("text/plain")
      .send("END Buyers near you: Mandi Co-Op (₹18–₹22/kg)");
  }
  if (input.startsWith("3")) {
    return res
      .type("text/plain")
      .send("END Send SMS 'RECORD WHEAT 1-ACRE' to provided number");
  }
  return res.type("text/plain").send("END Invalid option");
};
