
export const promptExamples = [
    {
        "image": "cat.jpg",
        "mime": "image/jpeg",
        "output": `[
            {
                "title": "Cute Kitten",
                "description": "There's a super cute kitten in the image! It has stripes and spots, kind of like a little tiger.  It's lying down on a soft blanket, and it has big, bright eyes. It looks like it's waiting for someone to play with!",
                "x": 499,
                "y": 499
            }
        ]`
    },
    {
        "image": "iss.jpg",
        "mime": "image/jpeg",
        "output": `[
            {
                "title": "International Space Station",
                "description": "Wow! That's the International Space Station! It's a large spacecraft that orbits Earth and serves as a home where astronauts can live.",
                "x": 495,
                "y": 387
            },
            {
                "title": "Earth",
                "description": "Look at that beautiful blue planet! That's Earth, our home. From space, we can see the swirling clouds and vast oceans that cover its surface. ",
                "x": 498,
                "y": 621
            },
            {
                "title": "Sun",
                "description": "The bright light is the sun! It's a star and the center of our solar system. The sun gives us light and heat, making life possible on Earth.",
                "x": 493,
                "y": 103
            }
        ]`
    },
    {
        "image": "pisa.jpg",
        "mime": "image/jpeg",
        "output": `[
            {
                "title": "Leaning Tower of Pisa",
                "description": "Wow! Look at that leaning tower! It's the Leaning Tower of Pisa in Italy. It's famous because it leans to one side. It's like a giant building is playing a balancing game!",
                "x": 450,
                "y": 350
            },
            {
                "title": "Tourists",
                "description": "See all those people around the tower? They are tourists from all over the world who came to see the Leaning Tower of Pisa. Maybe they are taking pictures or trying to hold it up!",
                "x": 250,
                "y": 800
            },
            {
                "title": "Blue Sky",
                "description": "Look at the beautiful sky! The sun is setting, and the clouds are all sorts of colors like orange, pink, and purple. It's like a giant painting in the sky!",
                "x": 500,
                "y": 100
            }
        ]`
    },
    {
        "image": "tools.jpg",
        "mime": "image/jpeg",
        "output": `[
            {
                "title": "Yellow Hammer",
                "description": "Wow! A bright yellow hammer with a metal head. This is used to drive nails into wood or other surfaces.",
                "x": 450,
                "y": 350
            },
            {
                "title": "Metal Saw",
                "description": "Look, a shiny metal saw with a yellow handle. This is used for cutting through wood and other materials. Be careful, it's sharp!",
                "x": 200,
                "y": 400
            },
            {
                "title": "Red Clamp",
                "description": "Cool! A red clamp used to hold things tightly together. This is useful when gluing or nailing pieces of wood.",
                "x": 600,
                "y": 450
            },
            {
                "title": "Measuring Tape",
                "description": "Check it out! A measuring tape used to measure length. It has numbers and markings to help you get accurate measurements.",
                "x": 750,
                "y": 400
            },
            {
                "title": "Pliers",
                "description": "Shiny and silver pliers! These are used to grip, bend, or cut things like wires and nails.",
                "x": 150,
                "y": 300
            },
            {
                "title": "Pointy Nails",
                "description": "A bunch of pointy nails! These are used with the hammer to hold pieces of wood together. Be careful, they're sharp too!",
                "x": 300,
                "y": 400
            },
            {
                "title": "Screwdriver",
                "description": "A screwdriver! This is used to turn screws into wood or other materials.",
                "x": 250,
                "y": 100
            },
            {
                "title": "Box Cutter",
                "description": "A box cutter! This has a sharp blade and is used to cut through cardboard, paper, and other materials.",
                "x": 400,
                "y": 100
            },
            {
                "title": "Level",
                "description": "A level! This tool helps you make sure things are straight and not tilted.",
                "x": 800,
                "y": 100
            }
        ]`
    }
]

export const prompt = "I am a kid that wants to learn more about the world. Grab my attention and describe to me the objects of interest in the scene. Return the description under a description key in json. Return to me the position of the object in X and Y format (0,0 being at the top left) and the position should be in the middle of the object. Return the output as a JSON array for each object of interest. An object of interest is any objects that are plainly visible in the image and of significance. I have provided some examples and their output followed by the images I want you to describe."
