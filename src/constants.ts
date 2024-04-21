export const promptExamples = [
  {
    image: 'ps4.jpg',
    mime: 'image/jpeg',
    output: `{
            "item_title": "Sony PlayStation 4 Slim 500GB Console with Accessories",
            "description": "Immerse yourself in the world of incredible gaming experiences with the Sony PlayStation 4 Slim 500GB console. This bundle includes everything you need to get started, featuring a sleek console, a DualShock 4 wireless controller, power cable, HDMI cable, and a USB charging cable. Enjoy stunning graphics, lightning-fast processing, and a vast library of games for endless entertainment.",
            "specifications": {
              "Storage Capacity": "500GB",
              "Model": "PlayStation 4 Slim",
              "Connectivity": "Wi-Fi, Bluetooth, Ethernet",
              "Included Accessories": "DualShock 4 Wireless Controller, Power Cable, HDMI Cable, USB Charging Cable",
              "Features": "HDR gaming, Remote Play, Share Play, access to streaming services"
            },
            "use_cases": [
              "Playing immersive single-player and multiplayer games",
              "Streaming movies, TV shows, and music from popular platforms",
              "Connecting with friends online for social gaming experiences",
              "Enjoying virtual reality experiences with the PlayStation VR headset (sold separately)"
            ],
            "SEO_keywords": [
              "PlayStation 4",
              "PS4 Slim",
              "500GB Console",
              "Gaming Console",
              "DualShock 4 Controller",
              "HDR Gaming",
              "Entertainment System"
            ]
          }`,
  },
  {
    image: 'turtle.jpg',
    mime: 'image/jpeg',
    output: `{
            "item_title": "Red-Eared Slider Turtle - Perfect Aquatic Companion",
            "description": "Bring joy and tranquility to your home with a charming Red-Eared Slider Turtle. These captivating creatures are known for their vibrant colors, playful personalities, and ease of care, making them ideal pets for both beginners and experienced reptile enthusiasts. Create a stimulating aquatic environment and watch them thrive as they swim, bask, and explore their surroundings.",
            "specifications": {
              "Scientific Name": "Trachemys scripta elegans",
              "Adult Size": "Up to 12 inches in shell length",
              "Lifespan": "20-30 years with proper care",
              "Diet": "Omnivorous, including commercial turtle pellets, insects, leafy greens, and vegetables",
              "Habitat Requirements": "Spacious aquarium with a basking area, clean water, and proper filtration",
              "Temperature": "Water temperature between 75-80°F, basking area temperature between 85-90°F",
              "Lighting": "Full-spectrum UVB light for shell health and overall well-being"
            },
            "use_cases": [
              "Educational Pet: Observe and learn about turtle behavior, anatomy, and aquatic ecosystems.",
              "Stress Relief: Watching turtles swim gracefully can have a calming and therapeutic effect.",
              "Home Decor: Create a beautiful and unique aquatic display in your living space.",
              "Conversation Starter: Their vibrant colors and playful nature attract attention and spark discussions."
            ],
            "SEO_keywords": [
              "Red-Eared Slider Turtle",
              "aquatic turtle",
              "pet turtle",
              "turtle care",
              "reptile pet",
              "aquarium",
              "basking",
              "turtle food",
              "UVB light",
              "water filtration"
            ]
          }`,
  },
  {
    image: 'axolotl.jpg',
    mime: 'image/jpeg',
    output: `{
            "item_title": "Adorable Axolotl Merchandise - Tote Bag & Keychain",
            "description": "Embrace the cuteness of axolotls with this delightful merchandise set! Featuring a charming tote bag adorned with an axolotl design and a matching keychain, this combo is perfect for axolotl enthusiasts and anyone who appreciates unique and eye-catching accessories.",
            "specifications": {
              "Tote Bag": {
                "Material": "Durable canvas or fabric",
                "Size": "Varies (e.g., 15x18 inches)",
                "Design": "Axolotl print or illustration"
              },
              "Keychain": {
                "Material": "Acrylic or rubber",
                "Size": "Compact and lightweight",
                "Design": "Axolotl charm with a keyring attachment"
              }
            },
            "use_cases": [
              "Everyday Carryall: The tote bag is perfect for carrying books, groceries, or everyday essentials.",
              "Travel Companion: Pack your belongings in style and show your love for axolotls on your adventures.",
              "Gift Idea: Surprise your friends, family, or fellow axolotl enthusiasts with a unique and thoughtful gift.",
              "Collectible Item: Expand your axolotl collection with these adorable and functional pieces.",
              "Fashion Statement: Add a touch of personality and whimsy to your outfit with the eye-catching axolotl designs."
            ],
            "SEO_keywords": [
              "axolotl",
              "axolotl merchandise",
              "tote bag",
              "keychain",
              "cute accessories",
              "animal lover gifts",
              "unique gifts",
              "kawaii",
              "amphibian",
              "neotenic"
            ]
          }`,
  },
  {
    image: 'rilakumar.jpg',
    mime: 'image/jpeg',
    output: `{
            "item_title": "Rilakkuma Plush Toy - Adorable and Huggable Companion",
            "description": "Bring home the irresistible charm of Rilakkuma with this delightful plush toy. Known for its relaxed demeanor and cute appearance, Rilakkuma is the perfect companion for cuddling, playtime, or adding a touch of kawaii to your space.",
            "specifications": {
              "Character": "Rilakkuma",
              "Material": "Soft plush fabric",
              "Size": "Varies (e.g., 10 inches tall)",
              "Features": "Embroidered details, signature relaxed posture"
            },
            "use_cases": [
              "Cuddly Companion: Rilakkuma's soft and huggable nature makes it the ideal snuggle buddy.",
              "Playtime Friend: Spark imaginative adventures and create lasting memories with Rilakkuma as your playtime companion.",
              "Room Decor: Add a touch of kawaii and Japanese charm to your bedroom, living room, or office space.",
              "Collectible Item: Expand your Rilakkuma collection or start a new one with this adorable plush toy.",
              "Gift Idea: Surprise your loved ones with a heartwarming and huggable gift that brings joy and comfort."
            ],
            "SEO_keywords": [
              "Rilakkuma",
              "plush toy",
              "kawaii",
              "Japanese character",
              "bear plush",
              "soft toy",
              "huggable",
              "collectible",
              "gift idea",
              "room decor"
            ]
          }`,
  },
];

export const prompt =
  'You are a store assistant. Help me come up with item title, description, specification, as well as potential use cases of how the item will be used by people for the main item in the image which i want to sell. If its not obvious, make use of the text input to reference to the item. Depending on the item, return to me useful information that user needs to know under the specification. I want the SEO keywords to help my sell my item well as well. Return to me in a valid JSON format. For use_cases its an array of string btw.';
