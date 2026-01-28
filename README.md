# Clippy
> Add Clippy or his friends to any website for instant nostalgia.

## Demos

Please be patient for first load. It may take some time as agents are loaded one by one.

- [Simple JSFiddle](https://jsfiddle.net/lizozomi/n5yz3jeb/23/)

![clippy-agents](https://user-images.githubusercontent.com/3016806/223058578-e4123bc3-0f4b-4913-a15d-d04e8be04525.png)


## Usage

### Demo

Run `npm run demo` to view the agent demo page.


### NPM / Webpack

```
npm install clippyts
```

```ts
import clippy from 'clippyts'

clippy.load('Merlin', (agent: Agent) => {
    // do anything with the loaded agent
    agent.show();
});
```

## Actions
All the agent actions are queued and executed by order, so you could stack them.

```javascript
// play a given animation
agent.play('Searching');

// play a random animation
agent.animate();

// get a list of all the animations
agent.animations();
// => ["MoveLeft", "Congratulate", "Hide", "Pleased", "Acknowledge", ...]

// Show text balloon
agent.speak('When all else fails, bind some paper together. My name is Clippy.');

// move to the given point, use animation if available
agent.moveTo(100,100);

// gesture at a given point (if gesture animation is available)
agent.gestureAt(200,200);

// stop the current action in the queue
agent.stopCurrent();

// stop all actions in the queue and go back to idle mode
agent.stop();
```


# Licence
MIT

[FOSSA Status](https://app.fossa.com/projects/git%2Bgithub.com%2Flizozom%2Fclippyts?utm_source=share_link)

## Special Thanks
- [pi0 for the original clippyJS implementation](https://github.com/pi0/clippyjs)
- The [Clippy.JS](http://smore.com/clippy-js) project by [Smore](http://smore.com)
- The awesome [Cinnamon Software](http://www.cinnamonsoftware.com/) for developing [Double Agent](http://doubleagent.sourceforge.net/)
the program we used to unpack Clippy and his friends!
- Microsoft, for creating clippy :)
