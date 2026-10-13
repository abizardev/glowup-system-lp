export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const apiKey = process.env.DODO_API_KEY || '7dBNls83fhYVueK7.iKw4au0HHk27hN0Ab2MS-klq_MgjnI2OJ-MI9m6hecZSpgk4';
      
      const response = await fetch('https://test.dodopayments.com/checkouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          product_cart: [{
            product_id: 'pdt_0NiMS29Vq2adAXkxIYMxE',
            quantity: 1
          }],
          return_url: 'https://plan.aviiro.tech/',
          customization: {
            theme: "light",
            theme_config: {
              light: {
                primary_color: "#de2b70",     // Tombol checkout pink
                background_color: "#ffffff",  // Background putih bersih
                brand_color: "#de2b70",       // Aksen brand pink
                text_color: "#1a1a1a"         // Teks ink
              }
            }
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Dodo API Error response:', data);
        return res.status(response.status).json({ error: data.error || 'Dodo API error details', detail: data });
      }

      return res.status(200).json({ checkoutUrl: data.checkout_url });
    } catch (error) {
      console.error('Error creating checkout session:', error.message);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
