# Sappling-Chores.github.io
Official github.io for Sappling-Chores

## The Math Behind the Particle Animation

The interactive particle background on this site (powered by `tsParticles`) is a great example of applied mathematics and physics working together in real-time. Here are the core mathematical concepts driving the visual effects:

### 1. Kinematics (Position, Velocity, & Time)
Every single particle is treated as a point mass with a position $(x, y)$ and a velocity vector. To create smooth movement, the engine continuously calculates the new position of each particle every frame using basic kinematic equations:
$$ P_{new} = P_{old} + V \times \Delta t $$
Where $P$ is position, $V$ is velocity, and $\Delta t$ is the change in time between frames.

### 2. Euclidean Distance (The Pythagorean Theorem)
To draw the connecting lines ("links") between the particles, and to determine when the mouse cursor is close enough to "grab" or "repulse" a particle, the engine relies heavily on calculating the straight-line distance between two points $(x_1, y_1)$ and $(x_2, y_2)$ using the Pythagorean theorem:
$$ d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2} $$
The engine constantly checks these distances. (This is also why reducing the number of particles improves performance—checking distances between $N$ particles takes $O(N^2)$ time complexity!).

### 3. Vector Mathematics
Movement and interactions are calculated using 2D vectors. When you hover your mouse and trigger the **"repulse"** effect, the engine calculates a vector pointing from your mouse cursor to the particle. It then normalizes this vector (scales it to a length of 1) and multiplies it by a repulsion force. This resulting force vector is added to the particle's current velocity vector to gently push it away.

### 4. Linear Interpolation & Ratios (Opacity Fade)
The lines connecting the particles don't just appear out of nowhere; they fade in smoothly. This is done using linear scaling. If the maximum distance for a link is $100px$, and two particles are $50px$ apart, the engine scales the opacity based on the ratio of current distance to max distance:
$$ Opacity = 1 - \left( \frac{CurrentDistance}{MaxDistance} \right) $$
This math ensures that as particles drift further apart, the line connecting them slowly fades out before disappearing.

### 5. Trigonometry (Sines and Cosines)
When a particle spawns or bounces, the engine needs to determine its trajectory. It uses random angles (in radians) and converts them into $x$ and $y$ velocity components using Sine and Cosine functions:
$$ V_x = Speed \times \cos(\theta) $$
$$ V_y = Speed \times \sin(\theta) $$

### 6. Collision Detection (Boundary Checks)
To keep the particles from flying off the screen forever, the engine uses simple boundary collision math. It checks if the $x$ or $y$ coordinates of a particle exceed the dimensions of the browser window. If $x < 0$ or $x > Width$, the particle's $x$-velocity is inverted ($V_x = -V_x$), causing it to bounce back into the viewport.
