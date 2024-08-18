// Exports standard information about levels and styling for easy access and modification
export const levels = [{
    level: 1,
    name: "Level 1",
    slug: 1,
    borderStyle: "border-indigo-500 bg-indigo-100",
    stars: 1,
    seconds: 10,
    setCount: 3,
},
{
    level: 2,
    name: "Level 2",
    slug: 2,
    borderStyle: "border-cyan-500 bg-cyan-100",
    stars: 2,
    seconds: 20,
    setCount: 4,
},
{
    level: 3,
    name: "Level 3",
    slug: 3,
    borderStyle: "border-green-500 bg-green-100",
    stars: 3,
    seconds: 30,
    setCount: 5,
},
{
    level: 4,
    name: "Level 4",
    slug: 4,
    borderStyle: "border-yellow-500 bg-yellow-100",
    stars: 4,
    seconds: 40,
    setCount: 6,
},
{
    level: 5,
    name: "Level 5",
    slug: 5,
    borderStyle: "border-orange-500 bg-orange-100",
    stars: 5,
    seconds: 50,
    setCount: 7,
},
{
    level: 6,
    name: "Endless",
    slug: "endless",
    borderStyle: "border-red-500 bg-red-100",
    stars: 5,
    displaySeconds: "∞",
    seconds: Infinity,
    setCount: Infinity,
}];

export const backendURL = "http://localhost:5000/"
export const timingTolerance = 0.08;