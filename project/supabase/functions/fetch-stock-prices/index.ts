import { load } from "npm:cheerio@1.0.0-rc.12";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tickers } = await req.json();
    const prices: Record<string, number> = {};

    // Fetch prices for each ticker
    await Promise.all(tickers.map(async (ticker: string) => {
      try {
        const response = await fetch(`https://tr.investing.com/equities/${ticker.toLowerCase()}-technical`);
        const html = await response.text();
        const $ = load(html);
        
        // Extract the current price
        const priceText = $('.text-5xl').first().text().trim();
        const price = parseFloat(priceText.replace(',', '.'));
        
        if (!isNaN(price)) {
          prices[ticker] = price;
        }
      } catch (error) {
        console.error(`Error fetching price for ${ticker}:`, error);
      }
    }));

    return new Response(JSON.stringify(prices), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});