import { Router, Request, Response } from "express";
const router = Router();

router.post("/payhero-callback", async (req: Request, res: Response) => {
  const data = req.body;

  console.log("📩 PayHero Callback Received:", data);


  res.status(200).send("Callback received");
});

export default router;
