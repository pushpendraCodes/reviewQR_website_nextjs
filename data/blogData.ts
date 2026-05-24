export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image: string;
  category: string;
  content: string;
  keywords: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'how-to-get-more-google-reviews',
    title: 'How to Get More Google Reviews: The Ultimate Guide for Local Businesses',
    description: 'Discover proven strategies to boost your Google Review count and improve your local search ranking.',
    date: 'May 5, 2026',
    author: 'ReviewQR Team',
    image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800',
    category: 'Marketing',
    keywords: 'get more google reviews, increase google ratings, local business marketing',
    content: `
      <p>Google reviews are one of the most powerful tools for local businesses to build trust and attract new customers. But how do you consistently get more reviews without being pushy? This guide explores the best strategies.</p>
      
      <h3>1. Just Ask (at the Right Time)</h3>
      <p>The simplest way to get more reviews is to ask. The best time is right after a successful transaction or when a customer expresses satisfaction. Don't wait—ask while the experience is fresh in their mind.</p>
      
      <h3>2. Make it Effortless</h3>
      <p>Customers are much more likely to leave a review if the process is simple. Using a Google Review QR code on your tables, counters, or receipts removes the friction of searching for your business manually.</p>
      
      <h3>3. Respond to Every Review</h3>
      <p>When you respond to reviews (both positive and negative), you show prospective customers that you value feedback. This encourages others to share their thoughts, knowing they will be heard.</p>
      
      <h3>4. Use Physical Reminders</h3>
      <p>Having a well-designed standee with a QR code in your physical store serves as a constant, subtle reminder for customers to share their feedback before they leave.</p>
    `
  },
  {
    id: '2',
    slug: 'how-to-create-google-review-qr-code',
    title: 'How to Create a Google Review QR Code (Step by Step)',
    description: 'Learn how to generate a custom QR code that links directly to your Google Business Profile review page.',
    date: 'May 6, 2026',
    author: 'ReviewQR Team',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    category: 'Tutorial',
    keywords: 'create google review qr code, qr code generator for reviews, step by step qr code',
    content: `
      <p>A Google Review QR code is a bridge between your physical location and your digital reputation. Here is how you can create one in minutes using ReviewQR.</p>
      
      <h3>Step 1: Find Your Place ID</h3>
      <p>Your Google Place ID is a unique identifier for your business on Google Maps. You can find this using Google's Place ID Finder or simply by searching for your business name on our homepage.</p>
      
      <h3>Step 2: Generate the Link</h3>
      <p>The review link follows a specific format: <code>https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID</code>. Our tool handles this automatically for you.</p>
      
      <h3>Step 3: Customize Your Design</h3>
      <p>A plain black and white QR code can be boring. Use our customizer to add your brand colors, your logo in the center, and choose a dot shape that matches your brand's aesthetic.</p>
      
      <h3>Step 4: Choose a Template</h3>
      <p>Don't just print the code. Place it on a professional-looking standee. We offer several templates from Minimal to Luxury that you can download and print instantly.</p>
    `
  },
  {
    id: '3',
    slug: 'best-places-to-put-google-review-qr-code',
    title: 'Best Places to Put Your Google Review QR Code',
    description: 'Maximize your review collection by placing your QR codes in these high-visibility locations.',
    date: 'May 7, 2026',
    author: 'ReviewQR Team',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800',
    category: 'Strategy',
    keywords: 'qr code placement, review collection tips, retail marketing',
    content: `
      <p>Placement is everything when it comes to QR codes. If your customers don't see it, they won't scan it. Here are the most effective places to put your Google Review QR code.</p>
      
      <h3>1. The Billing Counter</h3>
      <p>This is the most common and effective location. While customers are waiting for their bill or change, they have a few seconds of "idle time" where they are likely to scan a code.</p>
      
      <h3>2. On Dining Tables</h3>
      <p>For restaurants and cafes, table-top standees are gold. Customers spend a lot of time sitting at their tables, providing plenty of opportunity to leave feedback after a great meal.</p>
      
      <h3>3. Near the Exit</h3>
      <p>A "Thank You" sign near the door with a QR code can capture reviews from customers as they leave your establishment, feeling satisfied with your service.</p>
      
      <h3>4. On Product Packaging</h3>
      <p>If you sell physical products, including a QR code on the box or a thank-you card inside can lead to reviews even after the customer has left your store.</p>
    `
  },
  {
    id: '4',
    slug: 'why-google-reviews-matter-for-local-seo',
    title: 'Why Google Reviews Matter for Local SEO',
    description: 'Understand the critical role reviews play in your business ranking on Google Maps and local search results.',
    date: 'May 8, 2026',
    author: 'ReviewQR Team',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    category: 'SEO',
    keywords: 'local seo google reviews, ranking factors, business visibility',
    content: `
      <p>If you want your business to show up in the "Local 3-Pack" (the top three results on Google Maps), you need a strong review strategy. Here is why Google reviews are a primary ranking factor.</p>
      
      <h3>1. Trust and Credibility</h3>
      <p>Google aims to provide the best possible results to its users. A business with a high volume of positive reviews is seen as more trustworthy, and Google is more likely to rank it higher.</p>
      
      <h3>2. Review Velocity and Recency</h3>
      <p>It's not just about having a high rating. Google looks at how often you get reviews (velocity) and how recent they are. A steady stream of new reviews tells Google your business is active and consistently providing good service.</p>
      
      <h3>3. Keywords in Reviews</h3>
      <p>When customers describe their experience using specific keywords (e.g., "best pizza in Rewa"), Google uses that data to understand what your business offers, helping you rank for those specific terms.</p>
      
      <h3>4. Click-Through Rate (CTR)</h3>
      <p>Higher ratings lead to more clicks from the search results. A high CTR tells Google that users find your listing relevant, which further boosts your ranking over time.</p>
    `
  },
  {
    id: '5',
    slug: 'how-to-handle-negative-google-reviews',
    title: 'How to Handle Negative Google Reviews Like a Pro',
    description: 'Learn the best practices for responding to negative feedback and turning unhappy customers into loyal fans.',
    date: 'May 9, 2026',
    author: 'ReviewQR Team',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    category: 'Customer Service',
    keywords: 'handle negative reviews, reputation management, business growth',
    content: `
      <p>Negative reviews are inevitable for any growing business. However, how you respond to them can either damage your reputation or showcase your commitment to customer satisfaction.</p>
      
      <h3>1. Respond Quickly and Calmly</h3>
      <p>Try to respond within 24-48 hours. A prompt response shows you care. Take a deep breath and avoid getting defensive. Your goal is to solve the problem, not win an argument.</p>
      
      <h3>2. Acknowledge and Apologize</h3>
      <p>Even if you think the customer is wrong, acknowledge their feelings. A simple "We are sorry to hear you had a bad experience" goes a long way in de-escalating the situation.</p>
      
      <h3>3. Take it Offline</h3>
      <p>Don't get into a long back-and-forth in the public comments. Provide a phone number or email address where the customer can reach you directly to resolve the issue privately.</p>
      
      <h3>4. Ask for a Second Chance</h3>
      <p>If you've resolved the issue, politely invite the customer back. Many customers are willing to update their review once they see you've taken their feedback seriously.</p>
    `
  },
  {
    id: '6',
    slug: 'using-social-proof-to-grow-your-business',
    title: 'Using Social Proof to Grow Your Business Fast',
    description: 'Discover how to leverage your positive Google reviews across your website and social media to build trust.',
    date: 'May 10, 2026',
    author: 'ReviewQR Team',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800',
    category: 'Marketing',
    keywords: 'social proof, business growth, digital marketing',
    content: `
      <p>Social proof is the psychological phenomenon where people follow the actions of others. Your Google reviews are the ultimate form of social proof. Here is how to use them effectively.</p>
      
      <h3>1. Embed Reviews on Your Website</h3>
      <p>Don't just collect reviews on Google. Display them on your homepage or a dedicated "Testimonials" page to build trust with website visitors immediately.</p>
      
      <h3>2. Share Reviews on Social Media</h3>
      <p>Create "Customer Spotlight" posts on Instagram or Facebook using screenshots of your best reviews. It's free content that builds immense credibility.</p>
      
      <h3>3. Use "ReviewQR" Standees</h3>
      <p>Physical standees with "500+ Happy Customers" badges (available in our Pro plan) act as a visual social proof indicator for everyone walking into your store.</p>
      
      <h3>4. Include Reviews in Your Ads</h3>
      <p>If you're running paid ads, including a real customer quote can significantly increase your click-through and conversion rates compared to generic ad copy.</p>
    `
  },
  {
    id: '7',
    slug: 'free-google-review-qr-code-generator',
    title: 'Free Google Review QR Code Generator: No Sign-Up, No Expiry',
    description: 'Generate a free Google Review QR code in seconds. No hidden fees, no expiration date — just a scannable code your customers can use instantly.',
    date: 'May 11, 2026',
    author: 'ReviewQR Team',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=800',
    category: 'Tutorial',
    keywords: 'free google review qr code generator, free qr code for google reviews, google review qr code free, no sign up qr code generator',
    content: `
      <p>Searching for a truly free Google Review QR code generator — one without watermarks, hidden fees, or codes that expire after 30 days? You've come to the right place. Here's everything you need to know before you generate yours.</p>
 
      <h3>What Makes a QR Code Generator "Truly Free"?</h3>
      <p>Many tools advertise free QR codes but bury the catch: the code stops working after a trial period, or it redirects customers through an ad page before reaching your review form. A genuine free Google Review QR code should work indefinitely, send customers directly to your Google review page with zero redirects, and require no paid subscription to keep functioning.</p>
 
      <h3>How to Generate Your Free QR Code in Under 2 Minutes</h3>
      <p>Using ReviewQR, the process is simple. Create a free account using just your email — no password required. Search for your business by name and we automatically pull your Google Business Profile. Your QR code is generated instantly and delivered in three print-ready sizes (small, medium, and large). Place it at your checkout counter, on your receipt, or on a table tent and customers can scan and leave a review in under 30 seconds.</p>
 
      <h3>Does the Free QR Code Ever Expire?</h3>
      <p>No. Your QR code links directly to your Google review page URL, which is permanent. As long as your Google Business Profile is active, your QR code will work — forever. You never need to reprint or regenerate it unless you change business locations.</p>
 
      <h3>Free vs. Pro: What's the Difference?</h3>
      <p>The free plan gives you everything you need to start collecting reviews. The optional Pro plan ($6.49/month) unlocks scan analytics — peak hours, daily trends, conversion tracking — and removes the small ReviewQR branding from your printed standees. But the QR code itself is free, always.</p>
 
      <h3>Tips to Get the Most Out of Your Free QR Code</h3>
      <p>Print it at a size of at least 2x2 inches (5x5 cm) so any smartphone camera can read it from a comfortable distance. Test it on both an iPhone and an Android device before displaying it publicly. Place it where customers naturally have their phones out — at the billing counter, on the dining table, or near the exit door.</p>
    `
  },
  {
    id: '8',
    slug: 'google-review-qr-code-for-restaurants',
    title: 'Google Review QR Code for Restaurants: The Complete Setup Guide',
    description: 'A step-by-step guide for restaurant owners to set up Google Review QR codes on tables, menus, and receipts to consistently collect 5-star reviews.',
    date: 'May 12, 2026',
    author: 'ReviewQR Team',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
    category: 'Industry Guide',
    keywords: 'google review qr code restaurant, qr code for restaurant reviews, restaurant reputation management, get more restaurant reviews',
    content: `
      <p>Restaurants live and die by their online reputation. A single drop from 4.2 to 3.9 stars on Google can cost you hundreds of customers a month. A Google Review QR code is the simplest tool to build a steady stream of positive reviews. Here's the exact setup used by successful restaurants.</p>
 
      <h3>Where to Place QR Codes in Your Restaurant</h3>
      <p>Table tents are the highest-performing placement for restaurants — customers sit for 30-60 minutes and have their phones nearby. At the end of a good meal, they are at peak satisfaction and most likely to take 60 seconds to leave a review. Place a small, well-designed standee on every table. Secondary placements include the back of your menu, the billing folder, and a sign near the exit thanking guests for their visit.</p>
 
      <h3>The "Verbal + Visual" Technique</h3>
      <p>Data shows that mentioning the QR code verbally at the time of presenting the bill increases scan rates by up to 40%. Train your staff to say something like: "We'd love to hear your feedback — there's a QR code on the table that takes you straight to our Google page." This simple prompt, combined with the visible QR code, dramatically improves conversion.</p>
 
      <h3>Choosing the Right Design for a Restaurant Setting</h3>
      <p>Your QR code standee should match your restaurant's aesthetic. A fine-dining restaurant should use a minimal, elegant black-and-white design on a thick card stock. A casual café can use a warm, brand-colored design. ReviewQR offers templates ranging from Minimal to Luxury, so you can download and print a standee that feels native to your environment, not like an afterthought.</p>
 
      <h3>Handling the Peak Review Window</h3>
      <p>Industry data shows that Friday and Saturday dinner services generate the highest scan rates. These are the moments when customers are most satisfied and most likely to share their experience. Make sure your QR codes are prominently visible during these high-traffic periods and that your staff actively mentions them.</p>
 
      <h3>What to Do with Your New Reviews</h3>
      <p>Always respond to every review — positive or negative — within 24 hours. For positive reviews, a short, warm thank-you response encourages other readers to visit. For negative reviews, a calm, solution-focused response demonstrates professionalism. This practice itself encourages more customers to leave reviews, knowing their voice will be heard.</p>
    `
  },
  {
    id: '9',
    slug: 'static-vs-dynamic-google-review-qr-code',
    title: 'Static vs Dynamic Google Review QR Code: Which One Do You Need?',
    description: 'Understand the difference between static and dynamic QR codes for Google Reviews and choose the right option for your business.',
    date: 'May 13, 2026',
    author: 'ReviewQR Team',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800',
    category: 'Tutorial',
    keywords: 'static vs dynamic qr code, dynamic google review qr code, editable qr code for reviews, trackable qr code google reviews',
    content: `
      <p>When generating a Google Review QR code, you'll often come across two options: static and dynamic. Most businesses don't know the difference and end up choosing the wrong type. Here's a clear breakdown to help you decide.</p>
 
      <h3>What is a Static QR Code?</h3>
      <p>A static QR code has the destination URL permanently encoded into the pattern itself. Once printed, the code cannot be changed. If your Google review link ever changes (for example, if you move to a new location and get a new Google Business Profile), you would need to generate and reprint an entirely new QR code. Static codes are simpler, completely free, and work perfectly well for most small businesses.</p>
 
      <h3>What is a Dynamic QR Code?</h3>
      <p>A dynamic QR code works through a redirect: the code points to a short URL, and that short URL redirects to your Google review page. The visual pattern of the code stays the same, but you can change the destination URL at any time from a dashboard without reprinting. Dynamic codes also allow scan tracking — you can see how many times the code was scanned, from which devices, and at what times of day.</p>
 
      <h3>Which One Should You Choose?</h3>
      <p>For most local businesses — restaurants, salons, clinics, and retail shops — a static QR code is the smarter choice. It's free, permanent, has no monthly fees, and sends customers directly to Google with no intermediate redirect that could slow things down. If your Google Business Profile is established and stable, there's no reason to pay for a dynamic code.</p>
 
      <p>Dynamic codes make sense if you run multiple locations and want centralized scan analytics, or if you're running a time-limited campaign and want to redirect the QR code to a different page later (like a seasonal promotion). For long-term, permanent review collection, static wins on simplicity and cost.</p>
 
      <h3>The Scan Reliability Factor</h3>
      <p>Static QR codes encode data directly and are generally more reliable in poor lighting or when the print quality is less than perfect, because there's no dependency on a third-party redirect server. A dynamic QR code relies on the shortlink service being live — if that service goes down (even temporarily), your code will fail to work.</p>
 
      <h3>Our Recommendation</h3>
      <p>Start with a free static QR code for Google Reviews. It requires no account on a QR platform, never expires, and directs customers to Google with zero friction. If you grow to multiple locations and need scan-level analytics across all of them, consider upgrading to a dynamic solution at that point.</p>
    `
  },
  {
    id: '10',
    slug: 'how-to-print-google-review-qr-code-standee',
    title: 'How to Print a Google Review QR Code Standee That Actually Gets Scanned',
    description: 'Learn the right size, format, and design principles for printing a Google Review QR code standee that customers will notice and scan.',
    date: 'May 14, 2026',
    author: 'ReviewQR Team',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=80&w=800',
    category: 'Strategy',
    keywords: 'print google review qr code, qr code standee, qr code size for printing, qr code table tent, google review display card',
    content: `
      <p>Generating a QR code is the easy part. Getting customers to actually scan it depends almost entirely on how you print and display it. Here's the complete guide to creating a standee that works.</p>
 
      <h3>The Right Size for Your QR Code</h3>
      <p>Use the 10:1 rule: your QR code should be 1 cm wide for every 10 cm of scanning distance. For a code placed on a dining table (scanning distance roughly 30-50 cm), the code should be at least 3-5 cm wide. For a counter display that customers might scan from 1 meter away, the code needs to be 10 cm wide. Printing smaller than 2x2 cm almost always leads to scan failures, especially on older devices.</p>
 
      <h3>Format: PNG vs SVG</h3>
      <p>Always download your QR code as a high-resolution PNG (at least 1000x1000 pixels) or as an SVG vector file for printing. Never screenshot a QR code from a screen — the resolution will be too low for clean printing and may cause scan failures. ReviewQR delivers print-ready files in the correct resolution so you don't have to worry about this step.</p>
 
      <h3>Design Principles That Increase Scan Rates</h3>
      <p>A QR code surrounded by clear context gets scanned more. Always include a short headline above the code, such as "Love your experience? Leave us a review!" and a simple instruction below it: "Scan to open Google Reviews." People are more likely to scan when they know exactly what will happen and why. Adding your business logo in the center of the code (at up to 30% of the code area) reinforces trust and brand recognition.</p>
 
      <h3>Choosing the Right Material</h3>
      <p>For table-top standees, print on 350-400 GSM card stock for durability. A matte laminate protects against moisture and fingerprints. Avoid glossy lamination for QR codes — reflections from overhead lighting can interfere with smartphone cameras trying to read the code. If you're placing the standee outdoors or near a kitchen, a waterproof vinyl sticker is a better option.</p>
 
      <h3>Test Before You Print in Bulk</h3>
      <p>Always print one test copy on the actual material and scan it with at least two different phones — one iPhone and one Android — from your intended viewing distance. Test in your actual lighting conditions (not just at your desk). Only once it scans reliably on both devices should you print your full batch.</p>
    `
  },
  {
    id: '11',
    slug: 'google-review-qr-code-for-salons-and-spas',
    title: 'Google Review QR Code for Salons and Spas: Grow Your 5-Star Rating',
    description: 'A practical guide for salons, spas, and beauty businesses to use Google Review QR codes to build a strong online reputation.',
    date: 'May 15, 2026',
    author: 'ReviewQR Team',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800',
    category: 'Industry Guide',
    keywords: 'google review qr code salon, qr code for spa reviews, beauty salon reputation management, get more reviews salon',
    content: `
      <p>For salons and spas, your Google rating is your most important marketing asset. Potential clients read reviews before booking their first appointment. A Google Review QR code turns every satisfied client into a public advocate — here's how to make it work for your business.</p>
 
      <h3>The Best Moment to Ask for a Review in a Salon</h3>
      <p>Timing is everything. The optimal moment is right after a client sees their finished look in the mirror — when they're at peak satisfaction and still sitting in the chair. This is when a simple, friendly mention from your stylist carries the most weight: "We'd love to hear what you think — you can leave us a quick Google review by scanning that code on the mirror."</p>
 
      <h3>Where to Place Your QR Code in a Salon</h3>
      <p>The most effective locations are the stylist's station mirror (at eye level so clients see it while they're seated), the reception desk during checkout, and the waiting area where clients sit before their appointment. A QR code in the waiting area captures clients who are already on their phones and primed to engage with your brand.</p>
 
      <h3>Design Your Code to Match Your Salon's Aesthetic</h3>
      <p>A well-designed QR code feels like part of your brand, not an awkward add-on. If your salon has a luxury aesthetic with gold accents, use a dark background with gold-toned elements. If it's a modern, minimalist space, a clean black-and-white design on a thick white card works perfectly. ReviewQR's template library includes designs suited to premium beauty environments.</p>
 
      <h3>What Keywords Clients Naturally Use in Salon Reviews</h3>
      <p>Clients who review salons tend to use highly specific phrases: the stylist's name, the service type ("balayage," "keratin treatment," "nail art"), and location-specific terms. These keywords inside reviews directly help your salon rank higher in local Google searches for those specific services. Encouraging prompt, detailed reviews — while the client still remembers the experience — captures this valuable keyword data naturally.</p>
 
      <h3>Using Reviews as a Rebooking Tool</h3>
      <p>After a client leaves a positive review, your response is visible to thousands of potential new clients. Responding with something like "So glad you loved your balayage! We look forward to seeing you for your next appointment" subtly reinforces the rebooking habit and shows prospective clients that you have an ongoing, caring relationship with your regulars.</p>
    `
  },
  {
    id: '12',
    slug: 'what-is-a-google-place-id-and-how-to-find-it',
    title: 'What is a Google Place ID and How to Find Yours in 60 Seconds',
    description: 'Your Google Place ID is the key to creating a direct review link for your business. Here is what it is, why it matters, and exactly how to find it.',
    date: 'May 16, 2026',
    author: 'ReviewQR Team',
    image: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=800',
    category: 'Tutorial',
    keywords: 'google place id, find google place id, google business place id, google review link generator, direct google review link',
    content: `
      <p>Every business on Google Maps has a unique identifier called a Place ID. This ID is the foundation of your Google Review QR code and direct review link. Without it, customers have to search for your business manually — a step most won't bother with. Here's everything you need to know.</p>
 
      <h3>What is a Google Place ID?</h3>
      <p>A Google Place ID is a unique alphanumeric string that identifies a specific location in Google's database. It looks something like this: <code>ChIJN1t_tDeuEmsRUsoyG83frY4</code>. Every distinct business listing on Google Maps has its own Place ID. If you have multiple locations, each one has a separate, unique ID.</p>
 
      <h3>How to Find Your Place ID</h3>
      <p>The fastest way is to use our ReviewQR search bar: simply type your business name and city, and we automatically locate your Place ID and build your review link. Alternatively, you can use Google's official Place ID Finder tool at <code>developers.google.com/maps/documentation/places/web-service/place-id</code>. Search for your business name, click on the result, and the Place ID is displayed below the map.</p>
 
      <h3>How Your Place ID Becomes a Review Link</h3>
      <p>Your direct Google review link follows a simple format: <code>https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID</code>. When a customer opens this link, Google skips the business profile page entirely and opens the review dialog box directly — the interface where they select their star rating and write their feedback. This "one-tap" experience is the key reason QR codes generate significantly more reviews than simply asking customers to "find us on Google."</p>
 
      <h3>Does My Place ID Ever Change?</h3>
      <p>Your Place ID is stable as long as your Google Business Profile remains at the same address. If you move locations, Google typically creates a new listing with a new Place ID, which means you would need to regenerate your QR code. For this reason, it's worth keeping a note of your Place ID so you can quickly update your materials if needed.</p>
 
      <h3>Verifying You Have the Right Listing</h3>
      <p>If your business name is common, there may be multiple listings in your search results. Always verify by checking the address shown alongside the Place ID result before generating your QR code. Using the wrong Place ID will send customers to a completely different business's review page — a costly mistake to fix after printing hundreds of standees.</p>
    `
  }
];
