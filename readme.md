## Homography input selector
This webpage will allow the user to quickly open an image on his browser and select pairs of points on both images, outputing a list of coordinate pairs that can be used to calculate a Homography Matrix.

## Get Started
Litterally open index.html and play with the buttons. There are error messages not allowing you to mess up and there are layers ensuring that correct pairs are made.

## Problems and future implementation
Several changes can be made here.
- Fix problem where window size change / zoom change completely breaks the coordinate system as they use position absolute for the dots and the coordinates are based on mouse coordinates on window:
    - Freeze sizes no matter window size or work with more dynamic zones for each image that will, no matter the window or the image size have always the same coordinate system;
- Display a list of selected Pairs;
- Allow user to zoom in for better accuracy;
- Change dot collor for new pairs
- Increment a better visual for pair selections
- Allow user to edit each individual point separately
- Further refactor JS


## Personal Notes
As this was supposed to be done with vanillaJS and avoid heavy frameworks, the work was quite loaded.
After design was in place, an engine that would be checking clicks on both engines was needed.

I decided to create a Controller class that would handle and match all these methods together, and it went like a charm.

The first thing that happens is, after the controller being instantiated, the buttons are wired to the HTML.

We then have the work started by a MutationObserver (sounds a lot scarier than it is). Which is basically a class that monitors a DOM target for new changes and triggers a callback function when the change happens.
"Why did we need that?"

If I tried to add an event listener on the user uploaded image, it would fail and stop javascript on page load, that's because no image was uploaded yet.

The observer sees the new image being added and goes to sleep. Leaving all the work to the controller (that is way overwhelmed already and needs a few Classes to help him out). The  heavy work is done by two functions: startCoordinatePairWatcher and startPairSelection. Both of these are too much responsability for one Controller, so further use of this project requires further refactoring.

startCoordinatePairWatcher adds event listener to both images and uses startPairSelection to manage the clicks.

If a user clicks twice on the same image, he gets an error.
If he proceeds to succeed with clickend once on each image, we only save this events on the controller properties.

Once we have 2 events saved, we have a pair. The controller extracts from the event, the information needed and saves this on it's coordinatePairs property.

Once we have 4 pairs, the controller displays the send-button allowing for API calls to be wired.

It was a lot of fun solving this puzzle as it allowed me to bring some OOP to the front-end which is always nice. Of course, this needs much more work, but I did not want to overkill it. As of now, it allows for further additions and updates with ease.