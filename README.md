# Flappy Bird in HTML5 / JS!

## Run instructions
- $ npm install
- $ npm run dev

## Exercises

### Exercise 1
> As you start the game, you will see that Flappy already appears on the screen. The first exercise is to let Flappy flutter its wings.
> To do that, you must extend the use of the picture 'flap.png'. 
> Switch every x milliseconds (using the interval from the update-method) to another image of Flappy to simulate the fluttering.

<img src="https://github.com/mvdmaas/flap/blob/master/img/preview/flappy-fluttering.gif" width="200px" />

1. Checkout branch 'exercise-1'
2. Make the Flappy bird flutter
3. *Solution is found on branch 'exercise-1-solution'*

### Exercise 2
> Next, make a mechanism for rendering the pipes. Render the pipes from the right side of the screen, and use a random function 
> to generate pipe heights. You can use the 'pipe.png' image for rendering the pipes. To render the top pipe, you can rotate the image.
> Make sure that the pipes move from right to left at a sustainable pace.

<img src="https://github.com/mvdmaas/flap/blob/master/img/preview/pipes.jpg" width="300px" />

1. Checkout branch 'exercise-2'
2. Make the pipes appear on the screen
3. *Solution is found on branch 'exercise-2-solution'*

### Exercise 3
> At this moment, there is no gravitation on the planet of Flappy. Put some gravitation force on the Flappy object, so that it will drop down slowly to the bottom.
> Next it is also necessary to interact with Flappy so that it will fly up when you hit the spacebar. 

1. Checkout branch 'exercise-3'
2. Put some gravitation on Flappy
3. Make Flappy moveable through key events (space bar will let Flappy jump)
4. *Solution is found on branch 'exercise-3-solution'*

### Exercise 4
> The game is now playable, but actually scoring points is what it's all about. Update the score everytime you pass another pipe. 

1. Checkout branch 'exercise-4'
2. Find a mechanism to keep track of the score
3. *Solution is found on branch 'exercise-4-solution'*

### Exercise 5
> Flappy Bird is known for its characteristic sounds. Add some sounds (located in the sounds folder) to the events for scoring, jumping and collision (possible after exercise 6)

1. Checkout branch 'exercise-5'
2. Add sounds to the events (jumping, scoring)
3. *Solution is found on branch 'exercise-5-solution'*

### Exercise 6
> The final step to complete the game is to add collision detection to the game. Find a mechanism to detect the collision between Flappy and the pipes (and the top / bottom of the game)

1. Checkout branch 'exercise-6'
2. Add collision detection between Flappy and the pipes
3. *Solution is found on branch 'exercise-6-solution'*