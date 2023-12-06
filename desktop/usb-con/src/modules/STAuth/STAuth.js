

class STAuth {

    config = {
        pingURL: 'http://127.0.0.1:8000/ping',
        protectedPingURL: 'http://127.0.0.1:8000/protected-ping'
    }

    constructor(config) {
        // Override default config
        this.config = Object.assign(this.config, config);
    }

    ping() {
        console.log('ping');
        fetch(this.config.pingURL)
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
    }

}

module.exports = { STAuth };