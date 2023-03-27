# Rubik's Cube A*

## Description

This is my attempt to create an AI that would solve Rubik's Cubes. It uses A-star to analyze and determine the best path.

## Site

You can visit the page here:



## Explanation of the Algorithm

The algorithm is A-star. This is a pathfinding algorithm that ranks nodes based on a heuristic, then follows the best-ranked nodes to attempt to find a path to the goal. I will only describe the heuristic here. You can read a detailed discription of the algorithm elsewhere.

The heuristic is based on the idea of scoring a cube based on how "close" it is to being solved. But what makes one cube "closer" to being solved than another? I have identified these key elements:

- Cubies in the correct position
- Cubies in the correct position and orientation
- Cubies "close" to the correct position, i.e. one move away
- Cubies "near" the correct position, i.e. two moves away
- Cubies next to the correct neighbors
- Cubies with the correct orientation relative to their neighbor
- Cubies that are alone are bad
- Lone pairs of cubies are bad

Each of these is given a score. The total of the scores is the total score for that state of the cube.

In a standard heuristic, the h value of a node would be directly related to the score. I found better performance when I used a dynamic h value. In essence, early moves are worth lots of points, but moves close to the final solution are worth few points. So as the score gets closer to a perfect score, I add extra weighting to the value of those moves. Think of it this way: if you're trying to find a path to a castle, but the castle is surrounded by mud, then even though each step toward the castle gets you a smaller distance, you're still on the right track and should weigh these steps more favorably.

## Challenges

### Memory concerns

Rubik's Cubes have 43x10^15 permutations. It is impossible to search all of them. Even using an A-star algorithm to optimize searching would still require searching an impossible number of nodes. Since I'm using JavaScript, I found that Chrome would crash if I searched more than 10,000 nodes. At best, I can try to solve the cube by clicking the solve button, letting it try its best, and clicking the solve button again to get a little closer.

### Speed concerns

I am happy to announce that while speed was initially a large challenge (it would take 30 seconds to analyze 1,000 nodes) I overcame this by implementing a priority queue for the open set and a simple hash map for the closed set. This made the program blazingly fast and it can now analyze 10,000 nodes in less than two seconds.

### Heuristic concerns

I know that it would help the heuristic if I could evaluate whether a "close" cubie was in the correct orientation given its incorrect location, but I simply could not figure out how to do that.

I also know that it would be valuable to evaluate whether any faces are correct, but I couldn't figure that out either.

### The fundamental flaw

The fundamental flaw here is that I'm using A-star incorrectly. Imagine you are in a mountain range, and you are trying to find a path to the tallest peak. Let's say that you know your current GPS location and the peak's GPS location. A-star can help you there.

Instead, you are in a mountain range in a fog. You don't know either location, but you know your altitude and the peak's altitude. You also know the slope of the area around you. You can make a reasonable guess that the peak is in the direction of the steepest slope upward, but that's not always true. While you're close, it's likely true, and so my algorithm can usually solve cubes that are up to 8 moves away from solved. But if you must go down one mountain to climb another, this method will fail. For the same reason, my solver fails.

## References

- [The Coding Train
 - Coding Challenge #142: Rubik's Cube Part 1](https://www.youtube.com/watch?v=9PGfL4t-uqE)

- [Wael Yasmina - Three.js Tutorial For Absolute Beginners](https://www.youtube.com/watch?v=xJAfLdUgdc4)

- [SithDev - Fibonacci Heaps or "How to invent an extremely clever data structure"](https://www.youtube.com/watch?v=6JxvKfSV9Ns)