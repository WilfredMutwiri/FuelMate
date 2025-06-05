const axios = require('axios');

// paystack initialization
const paystackInit=async(req,res)=>{
  const {email,amount}=req.body;

  try {
    const response=await axios.post('https://api.paystack.co/transaction/initialize',
      {
        email,
        amount:amount*100,
      },
      {
        headers:{
          Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type":'application/json',
        },
      }
);

console.log(process.env.PAYSTACK_SECRET_KEY)

res.status(200).json({
  authorization_url: response.data.data.authorization_url,
  reference: response.data.data.reference,
  success:true
});

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
}


// payment verification

const verifyPayment = async (req, res) => {
  const { reference } = req.params;

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    if (response.data.data.status === 'success') {
      // Payment successful — save order, credit wallet, etc.
      return res.status(200).json({ message: 'Payment verified', data: response.data.data });
    } else {
      console.log("Received body:", req.body);
      return res.status(400).json({ message: 'Payment failed', data: response.data.data });
    }

  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: 'Payment verification failed' });
  }
};



module.exports={
  paystackInit,
  verifyPayment
}