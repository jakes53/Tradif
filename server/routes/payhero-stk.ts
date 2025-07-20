import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();

router.post("/payhero-stk", async (req: Request, res: Response) => {
  const { phone, amount } = req.body;

  try {
    const response = await axios.post(
      "https://api.payhero.co.ke/api/stkPush",
      {
        amount: parseInt(amount), 
        phone_number: phone,
        channel_id: parseInt(process.env.PAYHERO_CHANNEL_ID || "0"), 
        provider: "m-pesa",
        network: "63902", 
        callback_url: "https://yourdomain.com/api/payhero-callback",
        external_reference: "TXN-" + Date.now(),

        api_user: process.env.PAYHERO_API_USER,
        api_key: process.env.PAYHERO_API_KEY,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ success: true, response: response.data });
  } catch (error: any) {
    console.error("STK error:", error?.response?.data || error.message);
    res.status(500).json({
      error: error?.response?.data?.message || "STK Push failed",
    });
  }
});

export default router;
