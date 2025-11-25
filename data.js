const DATA_CHALLENGES = {
    "challenges": {
        "K_S1C1": {
            "title": "First Steps",
            "goal": "Move the turtle forward to the target.",
            "learningObjective": "To move the turtle, type `forward(100)`. This tells the computer to move the turtle 100 steps forward.",
            "startPosition": {
                "x": 50,
                "y": 200,
                "angle": 0
            },
            "target": {
                "x": 350,
                "y": 200,
                "radius": 15
            }
        },
        "K_S1C2": {
            "title": "A Simple Turn",
            "goal": "Turn the turtle to face the target, then move forward.",
            "learningObjective": "First turn the turtle with `turn(90)`, then move it with `forward(100)`.",
            "startPosition": {
                "x": 200,
                "y": 350,
                "angle": 0
            },
            "target": {
                "x": 200,
                "y": 50,
                "radius": 15
            }
        },
        "K_S1C3": {
            "title": "Box Step 1: Forward and Turn",
            "goal": "Move forward, turn right, and move forward again.",
            "learningObjective": "Try this sequence:<br>1. `forward(100)`<br>2. `turn(90)`<br>3. `forward(100)`",
            "startPosition": {
                "x": 100,
                "y": 300,
                "angle": 0
            },
            "target": {
                "x": 200,
                "y": 200,
                "radius": 15
            }
        },
        "K_S1C4": {
            "title": "Box Step 2: Two Sides",
            "goal": "Draw two sides of a square.",
            "learningObjective": "You need to go forward, turn, and go forward again. <br>Example: `forward(100)` then `turn(90)`.",
            "startPosition": {
                "x": 100,
                "y": 300,
                "angle": 0
            },
            "target": {
                "x": 200,
                "y": 200,
                "radius": 15
            }
        },
        "K_S1C5": {
            "title": "Box Step 3: Three Sides",
            "goal": "Draw three sides of a square.",
            "learningObjective": "Keep going! <br>`forward(100)`<br>`turn(90)`<br>`forward(100)`<br>`turn(90)`<br>`forward(100)`",
            "startPosition": {
                "x": 100,
                "y": 300,
                "angle": 0
            },
            "target": {
                "x": 100,
                "y": 200,
                "radius": 15
            }
        },
        "K_S1C6": {
            "title": "Complete the Square",
            "goal": "Draw a full square and return to the start.",
            "learningObjective": "Finish the square by adding one last turn and forward move.",
            "startPosition": {
                "x": 100,
                "y": 300,
                "angle": 0
            },
            "target": {
                "x": 100,
                "y": 300,
                "radius": 15
            }
        },
        "K_S1C7": {
            "title": "Staircase",
            "goal": "Climb the stairs! Forward, Turn, Forward, Turn...",
            "learningObjective": "Pattern: `forward(50)`, `turn(90)`, `forward(50)`, `turn(-90)`. Repeat this!",
            "startPosition": {
                "x": 50,
                "y": 350,
                "angle": 0
            },
            "target": {
                "x": 350,
                "y": 50,
                "radius": 25
            }
        },
        "G1_S1C1": {
            "title": "Pen Colors",
            "goal": "Draw a red line, then a blue line.",
            "learningObjective": "Learn the 'setColor(c)' command to change the turtle's trail color.",
            "startPosition": {
                "x": 50,
                "y": 200,
                "angle": 0
            },
            "target": {
                "x": 350,
                "y": 200,
                "radius": 15
            }
        },
        "G1_S1C2": {
            "title": "Lift the Pen",
            "goal": "Move to a new spot without drawing a line.",
            "learningObjective": "Learn 'penUp()' and 'penDown()' to control when the turtle draws.",
            "startPosition": {
                "x": 50,
                "y": 100,
                "angle": 0
            },
            "target": {
                "x": 350,
                "y": 300,
                "radius": 15
            }
        },
        "G1_S1C3": {
            "title": "Dashed Line",
            "goal": "Draw a dashed line across the screen.",
            "learningObjective": "Combine pen controls with movement.",
            "startPosition": {
                "x": 50,
                "y": 200,
                "angle": 0
            },
            "target": {
                "x": 350,
                "y": 200,
                "radius": 15
            }
        },
        "G1_S1C4": {
            "title": "Introduction to Loops",
            "goal": "Use a loop to draw a square (conceptually - manual repetition for now).",
            "learningObjective": "Recognizing patterns that can be looped.",
            "startPosition": {
                "x": 150,
                "y": 250,
                "angle": 0
            },
            "target": {
                "x": 150,
                "y": 250,
                "radius": 15
            }
        },
        "G1_S1C5": {
            "title": "Triangle",
            "goal": "Draw an equilateral triangle.",
            "learningObjective": "Turning other than 90 degrees.",
            "startPosition": {
                "x": 150,
                "y": 250,
                "angle": 0
            },
            "target": {
                "x": 150,
                "y": 250,
                "radius": 15
            }
        },
        "G1_S1C6": {
            "title": "Looping Colors",
            "goal": "Change colors for each side of a shape.",
            "learningObjective": "Sequencing state changes.",
            "startPosition": {
                "x": 150,
                "y": 250,
                "angle": 0
            },
            "target": {
                "x": 150,
                "y": 250,
                "radius": 15
            }
        },
        "G1_S1C7": {
            "title": "House",
            "goal": "Draw a square with a triangle on top.",
            "learningObjective": "Combining shapes.",
            "startPosition": {
                "x": 150,
                "y": 300,
                "angle": 0
            },
            "target": {
                "x": 150,
                "y": 300,
                "radius": 15
            }
        },
        "G2_S1C1": {
            "title": "My First Function",
            "goal": "Define a sequence of commands to draw a shape, then call it.",
            "learningObjective": "Understand the concept of abstraction by defining and calling a simple function.",
            "startPosition": {
                "x": 100,
                "y": 200,
                "angle": 0
            },
            "target": {
                "x": 300,
                "y": 200,
                "radius": 15
            }
        },
        "G2_S1C2": {
            "title": "Function with Parameters",
            "goal": "Create a function that takes a 'size' parameter to draw shapes of different sizes.",
            "learningObjective": "Learn how to make functions more flexible with parameters.",
            "startPosition": {
                "x": 100,
                "y": 200,
                "angle": 0
            },
            "target": {
                "x": 300,
                "y": 200,
                "radius": 15
            }
        },
        "G1_C1": {
            "title": "Move Forward",
            "goal": "Move the turtle forward to the target.",
            "learningObjective": "Learn the 'forward(n)' command to move the turtle.",
            "startPosition": { "x": 50, "y": 200, "angle": 0 },
            "target": { "x": 350, "y": 200, "radius": 15 }
        },
        "G1_C2": {
            "title": "Turn Right",
            "goal": "Turn the turtle to face the target.",
            "learningObjective": "Learn the 'turn(d)' command to change the turtle's direction.",
            "startPosition": { "x": 200, "y": 200, "angle": 0 },
            "target": { "x": 200, "y": 300, "radius": 15 }
        },
        "G1_C3": {
            "title": "Draw a Line and Turn",
            "goal": "Move forward and then turn left.",
            "learningObjective": "Practice sequencing two commands.",
            "startPosition": { "x": 100, "y": 300, "angle": 0 },
            "target": { "x": 200, "y": 200, "radius": 15 }
        },
        "G1_C4": {
            "title": "Draw a Square",
            "goal": "Draw a full square by repeating commands.",
            "learningObjective": "Understand how to create shapes with a sequence of commands.",
            "startPosition": { "x": 150, "y": 250, "angle": 0 },
            "target": { "x": 150, "y": 250, "radius": 15 }
        },
        "G1_C5": {
            "title": "Pen Up and Down",
            "goal": "Draw two separate lines.",
            "learningObjective": "Learn to use 'penUp()' and 'penDown()' to control drawing.",
            "startPosition": { "x": 50, "y": 150, "angle": 0 },
            "target": { "x": 350, "y": 250, "radius": 15 }
        },
        "G1_C6": {
            "title": "Changing Colors",
            "goal": "Draw a red line and then a blue line.",
            "learningObjective": "Learn to use 'setColor(c)' to change the pen color.",
            "startPosition": { "x": 50, "y": 200, "angle": 0 },
            "target": { "x": 350, "y": 200, "radius": 15 }
        },
        "G2_C1": {
            "title": "Loop a Square",
            "goal": "Draw a square using the 'repeat' command.",
            "learningObjective": "Learn how to use loops to repeat commands and write more efficient code.",
            "startPosition": { "x": 150, "y": 250, "angle": 0 },
            "target": { "x": 150, "y": 250, "radius": 15 }
        },
        "G2_C2": {
            "title": "Loop a Triangle",
            "goal": "Draw an equilateral triangle using the 'repeat' command.",
            "learningObjective": "Practice using loops with different angles.",
            "startPosition": { "x": 150, "y": 250, "angle": 0 },
            "target": { "x": 150, "y": 250, "radius": 15 }
        },
        "G2_C3": {
            "title": "Loop a Pentagon",
            "goal": "Draw a pentagon using a loop.",
            "learningObjective": "Calculate the correct angle for a 5-sided shape (360/5).",
            "startPosition": { "x": 150, "y": 250, "angle": 0 },
            "target": { "x": 150, "y": 250, "radius": 15 }
        },
        "G2_C4": {
            "title": "Dashed Line with a Loop",
            "goal": "Draw a dashed line using a loop.",
            "learningObjective": "Combine pen controls and movement inside a loop.",
            "startPosition": { "x": 50, "y": 200, "angle": 0 },
            "target": { "x": 350, "y": 200, "radius": 15 }
        },
        "G3_C1": {
            "title": "Function for a Square",
            "goal": "Define and use a function to draw a square.",
            "learningObjective": "Learn to create functions to reuse code.",
            "startPosition": { "x": 150, "y": 250, "angle": 0 },
            "target": { "x": 150, "y": 250, "radius": 15 }
        },
        "G3_C2": {
            "title": "Function with a Size Parameter",
            "goal": "Create a function that can draw squares of any size.",
            "learningObjective": "Learn to use parameters to make functions more powerful.",
            "startPosition": { "x": 100, "y": 300, "angle": 0 },
            "target": { "x": 300, "y": 100, "radius": 15 }
        },
        "G3_C3": {
            "title": "Function to Draw a House",
            "goal": "Combine a square and a triangle function to draw a house.",
            "learningObjective": "Learn to compose functions to create more complex drawings.",
            "startPosition": { "x": 150, "y": 300, "angle": 0 },
            "target": { "x": 150, "y": 300, "radius": 15 }
        },
        "G4_C1": {
            "title": "Variable for Length",
            "goal": "Use a variable to control the length of a line.",
            "learningObjective": "Learn to declare and use variables to store values.",
            "startPosition": { "x": 50, "y": 200, "angle": 0 },
            "target": { "x": 350, "y": 200, "radius": 15 }
        },
        "G4_C2": {
            "title": "Growing Spiral",
            "goal": "Use a variable that changes in a loop to draw a spiral.",
            "learningObjective": "Learn how to modify variables within a loop.",
            "startPosition": { "x": 200, "y": 200, "angle": 0 },
            "target": { "x": 200, "y": 200, "radius": 50 }
        },
        "G4_C3": {
            "title": "Math with Variables",
            "goal": "Draw a half-square using a variable and division.",
            "learningObjective": "Learn to perform simple arithmetic operations on variables.",
            "startPosition": { "x": 100, "y": 300, "angle": 0 },
            "target": { "x": 150, "y": 250, "radius": 15 }
        },
        "G5_C1": {
            "title": "Conditional Color",
            "goal": "Draw a line that changes color halfway.",
            "learningObjective": "Learn to use 'if' statements to control program flow.",
            "startPosition": { "x": 50, "y": 200, "angle": 0 },
            "target": { "x": 350, "y": 200, "radius": 15 }
        },
        "G5_C2": {
            "title": "Wall Bounce",
            "goal": "Make the turtle turn around when it hits a 'wall'.",
            "learningObjective": "Use 'if' statements with position-based conditions.",
            "startPosition": { "x": 50, "y": 200, "angle": 0 },
            "target": { "x": 50, "y": 200, "radius": 15 }
        },
        "G5_C3": {
            "title": "If/Else Branching",
            "goal": "Draw a shape with alternating colors using an if/else statement.",
            "learningObjective": "Learn to use if/else statements for branching logic.",
            "startPosition": { "x": 150, "y": 250, "angle": 0 },
            "target": { "x": 150, "y": 250, "radius": 15 }
        }
    },
    "curriculum": {
        "K": {
            "1": [
                "K_S1C1",
                "K_S1C2",
                "K_S1C3",
                "K_S1C4",
                "K_S1C5",
                "K_S1C6",
                "K_S1C7"
            ]
        },
        "1": {
            "1": [
                "G1_S1C1",
                "G1_S1C2",
                "G1_S1C3",
                "G1_S1C4",
                "G1_S1C5",
                "G1_S1C6",
                "G1_S1C7"
            ],
            "2": ["G1_C1", "G1_C2", "G1_C3", "G1_C4", "G1_C5", "G1_C6"]
        },
        "2": {
            "1": [
                "G2_S1C1",
                "G2_S1C2"
            ],
            "2": ["G2_C1", "G2_C2", "G2_C3", "G2_C4"]
        },
        "3": {
            "1": ["G3_C1", "G3_C2", "G3_C3"]
        },
        "4": {
            "1": ["G4_C1", "G4_C2", "G4_C3"]
        },
        "5": {
            "1": ["G5_C1", "G5_C2", "G5_C3"]
        }
    }
};

const DATA_LAYOUTS = {
    "default": {
        "title": "Default View",
        "areas": [
            "'instructions visualization'",
            "'editor editor'"
        ]
    },
    "focus-code": {
        "title": "Focus on Code",
        "areas": [
            "'editor editor'",
            "'instructions visualization'"
        ]
    },
    "side-by-side": {
        "title": "Side-by-Side",
        "areas": [
            "'instructions editor visualization'"
        ]
    }
};

// Initialize global data
window.ALL_DATA = {
    ...DATA_CHALLENGES,
    layouts: DATA_LAYOUTS
};
