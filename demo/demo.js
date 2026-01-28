
import clippy from '../dist/index.js'

const ClippyDemo = (function() {
    const availableAgents = ['Bonzi', 'Clippy', 'F1', 'Genie', 'Genius', 'Links', 'Merlin', 'Peedy', 'Rocky', 'Rover']
    const talks = [
        'How can i help you?',
        'Nice day!',
        'Glad to meet you.',
        'At your service',
        'Helloo'
    ]

    function init() {
        this.$el = document.querySelector('.my-clippy')
    }

    function nextAgent() {
        let agentName = availableAgents[Math.floor(Math.random() * (availableAgents.length))]
        if (!agentName) return;

        clippy.load({
            name: agentName,
            selector: "my-clippy",
            successCb: agent => {
                window[agentName] = agent
                agent.show();

                // Speak on click and start
                const speak = () => {
                    agent.speak('I am ' + agentName + ', ' + talks[~~(Math.random() * talks.length)])
                    agent.animate()
                }
                agent._el.addEventListener('click', () => speak());
                speak()

                // Animate randomly
                setInterval(() => {
                    agent.animate()
                }, 3000 + (Math.random() * 4000))
            }
        });
    } 
    function destroy() {
        this.$el.innerHTML = ''
    }

    return {
        init,
        nextAgent,
        destroy,

    }
})();


window.onload = () => {
    ClippyDemo.init();
    ClippyDemo.nextAgent();
    document.getElementById('next-agent').addEventListener('click', () => {
        ClippyDemo.destroy();
        ClippyDemo.nextAgent();
    });
}