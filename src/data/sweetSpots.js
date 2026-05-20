// Curated sweet spot redemptions per rewards program
// cpp = cents per point at this redemption
export const SWEET_SPOTS = {
  'Chase Ultimate Rewards': [
    { partner: 'World of Hyatt', description: 'Off-peak Category 1–4 hotel nights', cpp: 2.5, difficulty: 'Easy', tip: 'Best value in the program. Book directly at hyatt.com after transferring.' },
    { partner: 'United MileagePlus', description: 'Domestic saver awards (under 1,500 miles)', cpp: 1.8, difficulty: 'Easy', tip: 'Short-haul domestic flights. Look for Saver availability.' },
    { partner: 'Air France KLM Flying Blue', description: 'Promo awards to Europe', cpp: 2.0, difficulty: 'Medium', tip: 'Flying Blue runs monthly promo awards — 25–50% off. Check flyingblue.com.' },
    { partner: 'British Airways Avios', description: 'Short-haul AA or Alaska flights', cpp: 1.8, difficulty: 'Medium', tip: 'Great for under-1,000 mile domestic flights on American or Alaska.' },
    { partner: 'Singapore Airlines KrisFlyer', description: 'Business/First class to Asia', cpp: 3.5, difficulty: 'Hard', tip: 'Incredible value on Singapore Suites. Availability is rare but worth hunting.' },
  ],
  'Amex Membership Rewards': [
    { partner: 'Air France KLM Flying Blue', description: 'Promo awards to Europe', cpp: 2.2, difficulty: 'Medium', tip: 'Check monthly promos — some routes drop to 20K points round trip in economy.' },
    { partner: 'ANA Mileage Club', description: 'Round-trip business class to Japan', cpp: 4.0, difficulty: 'Hard', tip: 'Transfer via Virgin Atlantic. 90K points round trip business to Japan is legendary.' },
    { partner: 'Delta SkyMiles', description: 'Last-minute domestic flights', cpp: 1.5, difficulty: 'Easy', tip: 'Delta prices by demand — transfer when you find low-point availability.' },
    { partner: 'British Airways Avios', description: 'Short-haul American flights', cpp: 1.8, difficulty: 'Medium', tip: 'Use Avios for AA flights under 1,150 miles at just 7,500 points each way.' },
    { partner: 'Singapore Airlines KrisFlyer', description: 'Business/First to Asia or Europe', cpp: 3.5, difficulty: 'Hard', tip: 'One of the best business class redemptions in the world.' },
  ],
  'Capital One Miles': [
    { partner: 'Turkish Airlines Miles&Smiles', description: 'Star Alliance business class', cpp: 2.5, difficulty: 'Medium', tip: 'United Polaris business to Europe for just 45,000 miles each way.' },
    { partner: 'Air France KLM Flying Blue', description: 'Promo awards to Europe', cpp: 2.0, difficulty: 'Medium', tip: 'Flying Blue promos apply to Capital One transfers too.' },
    { partner: 'Avianca LifeMiles', description: 'Star Alliance economy & business', cpp: 2.0, difficulty: 'Medium', tip: 'No fuel surcharges on Star Alliance partners. Great for United & Lufthansa.' },
    { partner: 'Air Canada Aeroplan', description: 'Business class via short connections', cpp: 2.2, difficulty: 'Medium', tip: 'Aeroplan has no close-in fees and great Star Alliance partner availability.' },
  ],
  'Citi ThankYou': [
    { partner: 'Turkish Airlines Miles&Smiles', description: 'United Polaris business class', cpp: 2.5, difficulty: 'Medium', tip: '45,000 miles for United business to Europe. No fuel surcharges.' },
    { partner: 'Air France KLM Flying Blue', description: 'Promo awards to Europe', cpp: 2.0, difficulty: 'Medium', tip: 'Monthly promos available — always check before transferring.' },
    { partner: 'Singapore Airlines KrisFlyer', description: 'Business/First to Asia', cpp: 3.0, difficulty: 'Hard', tip: 'Excellent business class product and availability on Singapore metal.' },
    { partner: 'Avianca LifeMiles', description: 'Star Alliance economy & business', cpp: 1.8, difficulty: 'Medium', tip: 'No fuel surcharges and solid Star Alliance availability.' },
  ],
  'World of Hyatt': [
    { partner: 'Hyatt Hotels', description: 'Category 1–4 off-peak nights', cpp: 2.0, difficulty: 'Easy', tip: 'Off-peak nights start at 3,500 points. Incredible value at nicer properties.' },
    { partner: 'Hyatt Hotels', description: 'All-inclusive resorts (Inclusive Collection)', cpp: 2.5, difficulty: 'Easy', tip: 'Food, drinks, and activities included — points value skyrockets.' },
    { partner: 'Hyatt Hotels', description: 'Category 7–8 aspirational hotels', cpp: 1.5, difficulty: 'Medium', tip: 'Peak nights at Park Hyatt NYC or Maldives can still beat cash rates.' },
  ],
  'Marriott Bonvoy': [
    { partner: 'Marriott Hotels', description: 'Off-peak Category 1–4 hotels', cpp: 0.9, difficulty: 'Easy', tip: 'Best value is off-peak — avoid peak pricing which inflates point costs.' },
    { partner: 'Marriott Hotels', description: '5th night free on award stays', cpp: 1.2, difficulty: 'Easy', tip: 'Book 5 nights and the 5th is free — effectively 20% off any award stay.' },
    { partner: 'Delta SkyMiles', description: 'Airline transfer (3:1 ratio)', cpp: 0.7, difficulty: 'Easy', tip: 'Every 60K Marriott points = 25K airline miles. Rarely worth it unless bonus.' },
  ],
  'Hilton Honors': [
    { partner: 'Hilton Hotels', description: '5th night free on standard awards', cpp: 0.8, difficulty: 'Easy', tip: 'Gold/Diamond status gives you 5th night free on all standard awards.' },
    { partner: 'Hilton Hotels', description: 'Aspirational all-inclusive resorts', cpp: 1.0, difficulty: 'Medium', tip: 'Conrad Maldives or Waldorf properties — food/drinks make points go far.' },
  ],
  'Delta SkyMiles': [
    { partner: 'Delta Airlines', description: 'Last-minute domestic flights', cpp: 1.5, difficulty: 'Easy', tip: 'Delta removes close-in fees. Great for booking 1–2 days out when cash prices spike.' },
    { partner: 'Delta Airlines', description: 'Short-haul domestic (under 500 miles)', cpp: 1.3, difficulty: 'Easy', tip: 'Short routes often price well in points — especially off-peak.' },
  ],
  'United MileagePlus': [
    { partner: 'United Airlines', description: 'Domestic saver awards', cpp: 1.5, difficulty: 'Easy', tip: 'Look for Saver availability — MileagePlus dynamic pricing can vary widely.' },
    { partner: 'Air Canada Aeroplan', description: 'Star Alliance partners', cpp: 1.8, difficulty: 'Medium', tip: 'Transfer to Aeroplan for better Star Alliance availability and pricing.' },
    { partner: 'United Airlines', description: 'Business class to Europe (Polaris)', cpp: 2.0, difficulty: 'Hard', tip: 'Saver business class to Europe can be 70K miles — great value on Polaris seats.' },
  ],
  'AA AAdvantage': [
    { partner: 'American Airlines', description: 'Off-peak domestic saver awards', cpp: 1.5, difficulty: 'Easy', tip: 'AAdvantage has off-peak pricing for domestic routes. Check the award chart.' },
    { partner: 'British Airways Avios', description: 'Short American flights', cpp: 1.8, difficulty: 'Medium', tip: 'Transfer to Avios and fly AA metal for short hops at a fraction of the miles.' },
    { partner: 'Cathay Pacific Asia Miles', description: 'Business class to Asia', cpp: 2.5, difficulty: 'Hard', tip: 'AA business to Asia via Cathay Pacific is one of the best premium redemptions.' },
  ],
  'Southwest Rapid Rewards': [
    { partner: 'Southwest Airlines', description: 'Any Southwest flight (fixed cpp)', cpp: 1.5, difficulty: 'Easy', tip: 'Southwest points are fixed at ~1.5cpp regardless of route. No blackout dates.' },
    { partner: 'Southwest Airlines', description: 'Companion Pass flights (2-for-1)', cpp: 3.0, difficulty: 'Easy', tip: 'With a Companion Pass, your companion flies free on every flight all year.' },
  ],
  'Alaska Mileage Plan': [
    { partner: 'Alaska Airlines', description: 'West Coast domestic routes', cpp: 1.8, difficulty: 'Easy', tip: 'Alaska has great pricing on West Coast routes and to Hawaii.' },
    { partner: 'Cathay Pacific', description: 'Business class to Asia', cpp: 3.0, difficulty: 'Hard', tip: '50,000 miles for Cathay business to Asia — one of the best partner deals.' },
    { partner: 'Emirates', description: 'First class to Dubai/Asia', cpp: 3.5, difficulty: 'Hard', tip: 'Alaska miles can book Emirates First Class at partner rates without fuel surcharges.' },
  ],
  'JetBlue TrueBlue': [
    { partner: 'JetBlue Airlines', description: 'Any JetBlue flight', cpp: 1.5, difficulty: 'Easy', tip: 'TrueBlue points are worth a fixed ~1.5cpp. No award chart — fully dynamic.' },
    { partner: 'JetBlue Airlines', description: 'Mint business class (transcon)', cpp: 2.0, difficulty: 'Medium', tip: 'JetBlue Mint on NY-LA/SF is an incredible product — points go further here.' },
  ],
  'IHG One Rewards': [
    { partner: 'IHG Hotels', description: 'PointBreaks hotels (when available)', cpp: 1.0, difficulty: 'Medium', tip: 'IHG runs PointBreaks sales — select hotels for as low as 5,000 points/night.' },
    { partner: 'IHG Hotels', description: '4th night free on awards', cpp: 1.2, difficulty: 'Easy', tip: 'IHG Premier card gives you 4th night free on all standard award stays.' },
  ],
  'Aeroplan': [
    { partner: 'Air Canada', description: 'Business class to Europe', cpp: 2.5, difficulty: 'Medium', tip: 'Aeroplan has no close-in fees and excellent Star Alliance partner availability.' },
    { partner: 'United Airlines', description: 'Star Alliance saver awards', cpp: 2.0, difficulty: 'Medium', tip: 'Book United Polaris business via Aeroplan — often better availability than MileagePlus.' },
    { partner: 'Lufthansa', description: 'Business class to Europe', cpp: 2.5, difficulty: 'Hard', tip: 'Aeroplan can book Lufthansa business without the massive fuel surcharges.' },
  ],
}

// Transfer partners with ratios for each program
export const TRANSFER_RATIOS = {
  'Chase Ultimate Rewards': [
    { partner: 'United MileagePlus', ratio: '1:1', type: 'airline' },
    { partner: 'Southwest Rapid Rewards', ratio: '1:1', type: 'airline' },
    { partner: 'Air France KLM Flying Blue', ratio: '1:1', type: 'airline' },
    { partner: 'British Airways Avios', ratio: '1:1', type: 'airline' },
    { partner: 'Singapore Airlines KrisFlyer', ratio: '1:1', type: 'airline' },
    { partner: 'Aer Lingus AerClub', ratio: '1:1', type: 'airline' },
    { partner: 'Iberia Plus', ratio: '1:1', type: 'airline' },
    { partner: 'Virgin Atlantic Flying Club', ratio: '1:1', type: 'airline' },
    { partner: 'World of Hyatt', ratio: '1:1', type: 'hotel' },
    { partner: 'Marriott Bonvoy', ratio: '1:1', type: 'hotel' },
    { partner: 'IHG One Rewards', ratio: '1:1', type: 'hotel' },
  ],
  'Amex Membership Rewards': [
    { partner: 'Delta SkyMiles', ratio: '1:1', type: 'airline' },
    { partner: 'Air France KLM Flying Blue', ratio: '1:1', type: 'airline' },
    { partner: 'British Airways Avios', ratio: '1:1', type: 'airline' },
    { partner: 'Singapore Airlines KrisFlyer', ratio: '1:1', type: 'airline' },
    { partner: 'ANA Mileage Club', ratio: '1:1', type: 'airline' },
    { partner: 'Virgin Atlantic Flying Club', ratio: '1:1', type: 'airline' },
    { partner: 'Avianca LifeMiles', ratio: '1:1', type: 'airline' },
    { partner: 'Emirates Skywards', ratio: '1:1', type: 'airline' },
    { partner: 'Cathay Pacific Asia Miles', ratio: '1:1', type: 'airline' },
    { partner: 'Hilton Honors', ratio: '1:2', type: 'hotel' },
    { partner: 'Marriott Bonvoy', ratio: '1:1', type: 'hotel' },
  ],
  'Capital One Miles': [
    { partner: 'Air Canada Aeroplan', ratio: '1:1', type: 'airline' },
    { partner: 'Air France KLM Flying Blue', ratio: '1:1', type: 'airline' },
    { partner: 'British Airways Avios', ratio: '1:1', type: 'airline' },
    { partner: 'Turkish Airlines Miles&Smiles', ratio: '1:1', type: 'airline' },
    { partner: 'Avianca LifeMiles', ratio: '1:1', type: 'airline' },
    { partner: 'Singapore Airlines KrisFlyer', ratio: '1:1', type: 'airline' },
    { partner: 'Emirates Skywards', ratio: '1:1', type: 'airline' },
    { partner: 'Cathay Pacific Asia Miles', ratio: '1:1', type: 'airline' },
  ],
  'Citi ThankYou': [
    { partner: 'Air France KLM Flying Blue', ratio: '1:1', type: 'airline' },
    { partner: 'Turkish Airlines Miles&Smiles', ratio: '1:1', type: 'airline' },
    { partner: 'Singapore Airlines KrisFlyer', ratio: '1:1', type: 'airline' },
    { partner: 'Avianca LifeMiles', ratio: '1:1', type: 'airline' },
    { partner: 'JetBlue TrueBlue', ratio: '1:1', type: 'airline' },
    { partner: 'Wyndham Rewards', ratio: '1:1', type: 'hotel' },
  ],
  'Marriott Bonvoy': [
    { partner: 'Delta SkyMiles', ratio: '3:1', type: 'airline', note: '60K = 25K miles' },
    { partner: 'United MileagePlus', ratio: '3:1', type: 'airline', note: '60K = 25K miles' },
    { partner: 'AA AAdvantage', ratio: '3:1', type: 'airline', note: '60K = 25K miles' },
    { partner: 'British Airways Avios', ratio: '3:1', type: 'airline', note: '60K = 25K miles' },
    { partner: 'Air France KLM Flying Blue', ratio: '3:1', type: 'airline', note: '60K = 25K miles' },
    { partner: 'Singapore Airlines KrisFlyer', ratio: '3:1', type: 'airline', note: '60K = 25K miles' },
  ],
}
