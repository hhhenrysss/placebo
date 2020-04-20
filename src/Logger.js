class Logger {
    constructor() {
        this.userItentifier = this.getGuid();
    }

    getGuid() {
        let out = "";
        const GUID_LENGTH = 32;
        const NUM_SYMBOLS = 16;
        for(let i = 0; i < GUID_LENGTH; i++) {
            out += Math.floor(Math.random() * NUM_SYMBOLS).toString(NUM_SYMBOLS)
        }
        return out;
    }

    setUsername(username) {
        this._log(this.buildMessage("info", `Set username to ${username}`));
    }

    logInfo(message) {
        this._log(this.buildMessage("info", message));
    }

    logWarn(message) {
        this._log(this.buildMessage("warn", message));
    }

    logAlert(message) {
        this._log(this.buildMessage("alert", message));
    }

    _log(message) {
        // This will be OK for testing 
        const LOG_URL = "/api/postLog";
        console.log(message);
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        fetch(LOG_URL, { 
            method: "POST",
            body: JSON.stringify(message),
            headers
        }).then((res) => {
            console.log('log response', res);
            // Response object is not JSON-serializable
            return res;
        }).catch(e => console.log('error in log', e));
    }

    buildMessage(type, message) {
        let time = (new Date()).toDateString();
        return { type, message, userId: this.userItentifier, time };
    }
}

export let logger = new Logger();
