var websocket         = null;
var pluginUUID        = null;
var settingsCache     = {};
var timers        = []; // timers for each context (=instance) are stored here.
var printerStatus   = []; // Status info of printer(s)
var DestinationEnum   = Object.freeze({ "HARDWARE_AND_SOFTWARE": 0, "HARDWARE_ONLY": 1, "SOFTWARE_ONLY": 2 });
const background      = [];
background['default'] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASAAAAEgCAYAAAAUg66AAAAP9klEQVR4Xu3da4yVB5nA8WdaYLiVATowZabDZcqtDEVgI7DaYtposl6iEbeuH9ptTAzpF7eauHVro0bXtQmaXV2/7DZZjWs3cZdtG42xJiY1pd7ASNlyLSDXMhRKgeFa6LSzeZkAHbnMmZlzzkM5v/OlaXvO+7zvb578c+ZyzqmLiO64Bm/19ROifsSkGFbfGEOHjY0hQ0bFDTfUR9TdcA2erVMicA0JdL8Vb711Jrq6TsYbZ4/G2TOH4szp/XHmzKvX0En2nErdtRCg4SNbomHc/BjTMDdGj5kdo0a3xY1DRl1zWE6IwDtZ4M2uk3HyxI44cWxLHOvcEJ1H1sXrp/alXlJagBrGL4zGiUtjfON7Y+ToaakIhhOoVYFTJ3bG4UO/iUMHVkXnkbVVZ6hqgIaPaI5bWj4SE5s/GCNGtlb9Yg0kQODKAqdP7Y2DHc/EK/t+Fq+f7qgKVVUCNGbsHdEy+ZPnwuNGgMC1L3Bw/y9i3+6Vcezo/1X0ZCsaoJsa2mNy2wPR2HRPRS/CwQkQqIzAoQO/ir07/zOOHV1fkQEVCdDQYeNi6owHo7n1ExU5aQclQKC6Avtffjp2bfv3c79RK+et7AGa1Los2mZ9NoYMuamc5+lYBAgkCxS/Rdux9XvRsed/y3YmZQtQ8fc6M+Y87Nutsn1pHIjAtSlQfFu2fdOKsvxdUVkCdPPEu2Jm+6Pn/mjQjQCB61/g7NnDsXXDN+K1g6sGdbGDDlDrtPujbdZDgzoJDyZA4J0psOOlfz33Q+qB3gYVoOm3fyFapnxqoLM9jgCB60Bg3+7/ju2bvzWgKxlwgGbP+3o0NX9oQEM9iACB60vgQMfPY8uLX+n3RQ0oQHPmPxYTbvlAv4d5AAEC16/Aq6/8Mjate6RfF9jvAHnm0y9fdyZQUwL9fSbUrwD5mU9N7ZKLJTAggX27fxzbN3+7pMeWHCC/7SrJ050IEIiIHS99N/bu/FGfFiUFqPg7n7kL/6XPg7kDAQIEzgtsWPv5eO3g81cF6TNAxR8X/sV7nvBHhvaKAIF+CRSvG/vjb++76uvH+gxQ+4IVXl7RL3Z3JkDgvMChA8/GxhceviLIVQNUvLB0ZvuXaBIgQGDAAls3fjP2733qso+/YoCKt9RYdNdTMWSoV7UPWN4DCRCIrq7jsWbVsnjj7JFLNK4YoBntj3g/H8tDgEBZBDr2PhnbNj5WWoCKdzJc+Jc/LMtgByFAgEAhsPZ3D8Txzo29MC77DGjOghUxwduo2hoCBMoocLkfSF8SoOIN5Bcs+UEZxzoUAQIEegRe+P2ne72/9CUBun3eP/r0CttCgEBFBIqP/dn84pcvHLtXgIrP7Vr8vp9WZLCDEiBAoBBY/dxHL3zuWK8ATZ2+PKZMX06JAAECFRPYvf3x2LX98XPH7xWgRUuf9omlFWN3YAIECoHiE1jXrPp47wA1jFsY8xf3VMmNAAEClRRYt2Z5dB5ee/EZ0G2zPxe3Tr2vkjMdmwABAucEXt71RPxpy3cuBujdd66MkaOn4SFAgEDFBU6d2Bl/+PW9PQEaPrIlFi/9ScWHGkCAAIHzAqtXfawnQE0tH47Zd3yNDAECBKomsGX9V3sCNGPOF6N58r1VG2wQAQIEOvas7AlQ8dKL4iUYbgQIEKiWwLGj63sCdOf7n4sbh4yq1lxzCBAgEG92nYy6+voJ3UvufgYHAQIEqi5QN2bsvO4FS75f9cEGEiBAoK6x6Z7u4o3n3QgQIFBtgbpJrcu6vfF8tdnNI0CgEKhrnXZ/d9ush2gQIECg6gJ1U277TPfUGQ9WfbCBBAgQqJsyfXl38T5AbgQIEKi2gABVW9w8AgQuCAiQZSBAIE1AgNLoDSZAQIDsAAECaQIClEZvMAECAmQHCBBIExCgNHqDCRAQIDtAgECagACl0RtMgIAA2QECBNIEBCiN3mACBATIDhAgkCYgQGn0BhMgIEB2gACBNAEBSqM3mAABAbIDBAikCQhQGr3BBAgIkB0gQCBNQIDS6A0mQECA7AABAmkCApRGbzABAgJkBwgQSBMQoDR6gwkQECA7QIBAmoAApdEbTICAANkBAgTSBAQojd5gAgQEyA4QIJAmIEBp9AYTICBAdoAAgTQBAUqjN5gAAQGyAwQIpAkIUBq9wQQICJAdIEAgTUCA0ugNJkBAgOwAAQJpAgKURm8wAQICZAcIEEgTEKA0eoMJEBAgO0CAQJqAAKXRG0yAgADZAQIE0gQEKI3eYAIEBMgOECCQJiBAafQGEyAgQHaAAIE0AQFKozeYAAEBsgMECKQJCFAavcEECAiQHSBAIE1AgNLoDSZAQIDsAAECaQIClEZvMAECAmQHCBBIExCgNHqDCRAQIDtAgECagACl0RtMgIAA2QECBNIEBCiN3mACBATIDhAgkCYgQGn0BhMgIEB2gACBNAEBSqM3mAABAbIDBAikCQhQGr3BBAgIkB0gQCBNQIDS6A0mQECA7AABAmkCApRGbzABAgJkBwgQSBMQoDR6gwkQECA7QIBAmoAApdEbTICAANkBAgTSBAQojd5gAgQEyA4QIJAmIEBp9AYTICBAdoAAgTQBAUqjN5gAAQGyAwQIpAkIUBq9wQQICJAdIEAgTUCA0ugNJkBAgOwAAQJpAgKURm8wAQICZAcIEEgTEKA0eoMJEBAgO0CAQJqAAKXRG0yAgADZAQIE0gQEKI3eYAIEBMgOECCQJiBAafQGEyAgQHaAAIE0AQFKozeYAAEBsgMECKQJCFAavcEECAiQHSBAIE1AgNLoDSZAQIDsAAECaQIClEZvMAECAmQHCBBIExCgNHqDCRAQIDtAgECagACl0RtMgIAA2QECBNIEBCiN3mACBATIDhAgkCYgQGn0BhMgIEB2gACBNAEBSqM3mAABAbIDBAikCQhQGr3BBAgIkB0gQCBNQIDS6A0mQECA7AABAmkCApRGbzABAgJkBwgQSBMQoDR6gwkQECA7QIBAmoAApdEbTICAANkBAgTSBAQojd5gAgQEyA4QIJAmIEBp9AYTICBAdoAAgTQBAUqjN5gAAQGyAwQIpAkIUBq9wQQICJAdIEAgTUCA0ugNJkBAgOwAAQJpAgKURm8wAQICZAcIEEgTEKA0eoMJEBAgO0CAQJqAAKXRG0yAgADZAQIE0gQEKI3eYAIEBMgOECCQJiBAafQGEyAgQHaAAIE0AQFKozeYAAEBsgMECKQJCFAavcEECAiQHSBAIE1AgNLoDSZAQIDsAAECaQIClEZvMAECAmQHCBBIExCgNHqDCRAQIDtAgECagACl0RtMgIAA2QECBNIEBCiN3mACBATIDhAgkCYgQGn0BhMgIEB2gACBNAEBSqM3mAABAbIDBAikCQhQGr3BBAgIkB0gQCBNQIDS6A0mQECA7AABAmkCApRGbzABAgJkBwgQSBMQoDR6gwkQECA7QIBAmoAApdEbTICAANkBAgTSBAQojd5gAgQEyA4QIJAmIEBp9AYTICBAdoAAgTQBAUqjN5gAAQGyAwQIpAkIUBq9wQQICJAdIEAgTUCA0ugNJkBAgOwAAQJpAgKURm8wAQICZAcIEEgTEKA0eoMJEBAgO0CAQJqAAKXRG0yAgADZAQIE0gQEKI3eYAIEBMgOECCQJiBAafQGEyAgQHaAAIE0AQFKozeYAAEBsgMECKQJCFAavcEECAiQHSBAIE1AgNLoDSZAQIDsAAECaQIClEZvMAECAmQHCBBIExCgNHqDCRAQIDtAgECaQN2U2z7TPXXGg2knYDABArUrUNc67f7utlkP1a6AKydAIE2gblLrsu6Z7V9KOwGDCRCoXYG6xqZ7utsXrKhdAVdOgECaQN2YsfO6Fyz5ftoJGEyAQO0K1NXXT+hecvcztSvgygkQSBOoi4juO9//XNw4ZFTaSRhMgEDtCbzZdTLOBWjBkh/EmLF31J6AKyZAIE3g2NH1PQGaMeeL0Tz53rQTMZgAgdoT6NizsidATS0fjtl3fK32BFwxAQJpAlvWf7UnQMNHtsTipT9JOxGDCRCoPYHVqz7WE6Di0t9958oYOXpa7Sm4YgIEqi5w6sTO+MOv770YoNtmfy5unXpf1U/EQAIEak/g5V1PxJ+2fOdigBrGL4z5ix6vPQlXTIBA1QXWrV4enUfWXgxQcQaLlj4dI0a2Vv1kDCRAoHYETp/aG2tWffzcBV/4GVDxL1OnL48p05fXjoQrJUCg6gK7tz8eu7b3fLfVK0DDRzTH4vf9tOonZCABArUjsPq5j8brpzsuDVDxX25/1zdi4qS/qh0NV0qAQNUEDnY8E5tf/PKFeb2eARX/dczYd8WCJf9RtRMyiACB2hF44fefjuIlGOdvlwSo+B/tC74VjU13146KKyVAoOICrx54Nja98HCvOZcNUPHC1OIFqm4ECBAol8Da3z0Qxzs39h2g4h4z5z4ak27t+VWZGwECBAYj0LH3ydi28bFLDnHZZ0DFvYbVN8aiu570PkGDUfdYAgSi643jseb5ZfHG2SOlB6i4Z/Pkv44Zc/4BIQECBAYssHXjN2P/3qcu+/grPgM6f28/kB6wuwcSqHmBQweejY1/9oPnt6P0GaD6+gmx8D3/FcPqx9c8JgACBEoXOHvmUPzxt/dF8c8r3foMUPHAmycujbkL/7n0ye5JgEDNC2xY+/l47eDzV3UoKUDFEVqn/W20zfq7mkcFQIBA3wI7Xvpu7N35oz7vWHKAiiNNv/3vo2XK3/R5UHcgQKB2Bfbt/nFs3/ztkgD6FaDiiLPnfT2amj9U0sHdiQCB2hI40PHz2PLiV0q+6H4HqDjynPmPxYRbPlDyEHckQOD6F3j1lV/GpnWP9OtCBxQgz4T6ZezOBK57gf4+8zkPMuAA9fxM6AvRMuVT1z2uCyRA4MoC/fmZz58fZVABKg7WOu3+aJv1kK8PAQI1KFDqb7uuRDPoABUHvnniXTGz/dFzrx9zI0Dg+hco/rhw68Z/6vPvfPqSKEuAiiFFfGbMeTgam+7pa6b/T4DAO1igeHnFtk0rrvoXzqVeXtkCdH7gpNZl0TbzszFk6E2lnoP7ESDwDhDo6joeO1763hVfWDqQSyh7gIqTGDpsXEyd8WA0t35iIOfkMQQIXGMCxfv57Nr2b5d9S43BnGpFAnT+hG5qaI/Wtgdigm/LBvM18lgCaQLFt1t7dvzwkncyLNcJVTRA50+yeIvXlsmfjInNHyzXeTsOAQIVFCg+vWLfnv/p9QbylRhXlQCdP/Hic8duafnIuRD5BNZKfDkdk8DABYpPLC3C88q+n1343K6BH620R1Y1QG8/pYZxC6OxaWmMb3xvjBw9rbSzdS8CBMoqcOrEzjh86Ddx6OCq6Dy8tqzHLuVgaQF6+8kNH9kSDePmx5iGuTF6zOwYNbrNe1GX8tVzHwL9EHiz62ScPLEjThzbEsc6N0TnkXXx+ql9/ThC+e/6/7DeU7722LSLAAAAAElFTkSuQmCC";
background['black']   = "data:image/png;base64,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";
background['green']   = "data:image/png;base64,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";
background['white']   = "data:image/png;base64,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";
background['blue']    = 'data:image/png;base64,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';
background['red']     = "data:image/png;base64,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";

var octoDeckAction    = {

    onKeyUp: function (context, settings, coordinates, userDesiredState) {
        console.log("onKeyUp context: ", context, " settings: ", settings);

        getData(settingsCache[context], context);
    },

    onWillAppear: function (context, settings, coordinates) {
        console.log("onWillAppear context: ", context, " settings: ", settings);

        settingsCache[context] = settings;
        printerStatus[context] = {}; // Create empty status. This will be updated by rest requests.
        getData(settingsCache[context], context);

        // Start timer when this plugin becomes visible.
        resetTimer(context, settings);
    },

    onWillDisappear: function (context, settings, coordinates) {
        console.log("onWillDisappear context: ", context, " settings: ", settings);

/*		// If timer is set, then clear it.
        let timer = timers[context];
        if (timer != null) {
            clearInterval(timer);
        }
 */
    },

    SetTitle: function (context, titleText) {
        var json = {
            "event": "setTitle",
            "context": context,
            "payload": {
                "title": "" + titleText,
                "target": DestinationEnum.HARDWARE_AND_SOFTWARE
            }
        };

        websocket.send(JSON.stringify(json));
    },

    SetImage: function (context, text) {
        var json = {
            "event": "setImage",
            "context": context,
            "payload": {
                "image": text,
                "target": DestinationEnum.HARDWARE_AND_SOFTWARE
            }
        };

        websocket.send(JSON.stringify(json));
    },

    SetSettings: function (context, settings) {
        var json = {
            "event": "setSettings",
            "context": context,
            "payload": settings
        };

        websocket.send(JSON.stringify(json));
        settingsCache[context] = settings;
        console.log("New Settings", settings);
        console.log("New JSON", JSON.stringify(json));
        octoDeckAction.SetImage(context, background[settings.octoBackground]);

        // Start timer when new settings are received.
        resetTimer(context, settings);
    },

    showAlert: function (context) {
        var json = {
            "event": "showAlert",
            "context": context,
        };
        websocket.send(JSON.stringify(json));
    },
};

// Helper function for resetting internal timer
function resetTimer(context, settings){
    // If timer is set, then clear it. (It will be created again soom.)
    let timer = timers[context];
    if (timer != null) {
        clearInterval(timer);
    }

    // Create timer for this context. (having timers associated with context enables multible instances to exist.)
    timers[context] = setInterval(function() {
        getData(settingsCache[context], context);
    }, settings.octoInterval * 1000);
}

function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
    pluginUUID = inPluginUUID

    // Open the web socket
    websocket = new WebSocket("ws://127.0.0.1:" + inPort);

    function registerPlugin(inPluginUUID) {
        var json = {
            "event": inRegisterEvent,
            "uuid": inPluginUUID
        };

        websocket.send(JSON.stringify(json));
    };

    websocket.onopen = function () {
        // WebSocket is connected, send message
        registerPlugin(pluginUUID);
    };

    websocket.onmessage = function (evt) {
        console.log("onmessage event received!");
        // Received message from Stream Deck
        var jsonObj = JSON.parse(evt.data);
        console.log("onmessage json: ", jsonObj);
        var event = jsonObj['event'];
        var action = jsonObj['action'];
        var context = jsonObj['context'];
        var jsonPayload = jsonObj['payload'] || {};

        if (event == "keyUp") {
            var settings = jsonPayload['settings'];
            var coordinates = jsonPayload['coordinates'];
            var userDesiredState = jsonPayload['userDesiredState'];
            octoDeckAction.onKeyUp(context, settings, coordinates, userDesiredState);
        }
        else if (event == "willAppear") {
            var settings = jsonPayload['settings'];
            var coordinates = jsonPayload['coordinates'];
            octoDeckAction.onWillAppear(context, settings, coordinates);
        }
        else if (event == "willDisappear") {
            var settings = jsonPayload['settings'];
            var coordinates = jsonPayload['coordinates'];
            octoDeckAction.onWillDisappear(context, settings, coordinates);
        }
        else if (event == "sendToPlugin") {
            console.log("sendToPlugin received payload: ", jsonPayload);
            if (jsonPayload != null && jsonPayload.hasOwnProperty('city')) {
                octoDeckAction.SetSettings(context, jsonPayload);
            }
        }
        else if (event == "didReceiveSettings") {
            console.log("didReceiveSettings received payload: ", jsonPayload);
            if (jsonPayload != null && jsonPayload['settings'] != null) {
                octoDeckAction.SetSettings(context, jsonPayload['settings']);
            }
        }

        updateTitleText( context );
    };

    websocket.onclose = function () {
        // Websocket is closed
    };
};

// Helper function to determine how text should be written to button.
function updateTitleText( context ){
    let text = "";

    // Filename to first line
    if ( printerStatus[context].filename == null ){
        text += "";
    } else {
        text += printerStatus[context].filename.substring(0, 8) + "\n";
    }

    // Printer status to SECOND line
    if ( printerStatus[context].status ){

        if ( printerStatus[context].status == "printing" ){
            // Printer is printing. Show progress percentage and time.
            text += printerStatus[context].progress + "% ";
            text += Math.floor(printerStatus[context].timeRemaining/60)+"min";
        } else if ( printerStatus[context].status == "on" ) {
            text = "On";
        } else if ( printerStatus[context].status == "cancel" ) {
            text = "Cancel";
        } else if ( printerStatus[context].status == "off" ) {
            text =  "Off" ;
        }
    }

    // Temperatures to THIRD line
    if ( printerStatus[context].hotend != null && printerStatus[context].bed != null ){
        text += "\n" + printerStatus[context].hotend + "/" + printerStatus[context].bed + " °C";
    }

    octoDeckAction.SetTitle(context, text );
}

function fetchPrinterJobStatus( context, settings ){

    fetch(settings.octoUrl + "/api/job", {
        headers: { 'X-Api-Key': settings.octoKey}
    })
        .then(res => res.json())
        .catch(err => {
            console.log('Invalid API Response Error');
            octoDeckAction.showAlert(context);
        })
        .then((out) => {
            console.log('Received jobJSON[',out.state,']',context,']', out);

            if (out.state == "Printing" ) {
                console.log ("printing...");
                printerStatus[context].status = "printing";
                printerStatus[context].progress = Math.floor(out.progress.completion);
                printerStatus[context].timeRemaining = Math.floor(out.progress.printTimeLeft);
                printerStatus[context].filename = out.job.file.display;

                let width = Math.floor(printerStatus[context].progress/100*110); // Scale percent progress to 120px width.
                let img = 'data:image/svg+xml;charset=utf8,<svg height="144" width="144"><rect x="17" y="5" width="'+width+'" height="10" style="fill:rgb(220,220,240);fill-opacity:0.7;stroke-opacity:0.9" /><rect x="17" y="5" width="110" height="10" style="fill:blue;fill-opacity:0.2;stroke-opacity:0.9;stroke:rgb(220,220,240);stroke-width:1" /></svg>';

                console.log(img);
                octoDeckAction.SetImage(context, img);

            } else if (out.state == "Operational" ) {
                console.log ("on...");
                printerStatus[context].status = "on";
                printerStatus[context].progress = null;
                printerStatus[context].timeRemaining = null;
                printerStatus[context].filename = out.job.file.display;
            } else if (out.state == "Cancelling" ) {
                printerStatus[context].status = "cancel";
                printerStatus[context].progress = null;
                printerStatus[context].timeRemaining = null;
                printerStatus[context].filename = out.job.file.display;
            } else if (out.state.search( "Offline" >= 0)) {
                printerStatus[context].status = "off";

                // Reset if offline
                printerStatus[context].progress = null;
                printerStatus[context].timeRemaining = null;
                printerStatus[context].hotend = null;
                printerStatus[context].bed = null;
                printerStatus[context].filename = null;
            } else {
                // Printer is on, but not printing.
                printerStatus[context].status = "on";
                printerStatus[context].progress = null;
                printerStatus[context].timeRemaining = null;
                printerStatus[context].filename = out.job.file.display;
            }

            // Update button
            //octoDeckAction.SetImage(context, background[settings.octoBackground]);
            updateTitleText( context );

            console.log('PrinterStatus[',context,']', printerStatus[context]);
        })
        .catch(err => {
            console.log('Invalid JSON Parsing Error');
            octoDeckAction.showAlert(context);
            printerStatus[context].status = "";
        });

}

function fetchPrinterTemperatures(  context, settings ){

    // ### MAKE another request for getting the printers temperatures ###
    fetch(settings.octoUrl + "/api/printer", {
        headers: { 'X-Api-Key': settings.octoKey}
    })
        .then((res)=>{
                // If request succeeded, then return as json. Otherwise throw error (usually 404, 409 or similar).
                if(res.ok) {
                    // return res.json();
                    return res.json();
                } else if (res.status == 409){
                    console.log('Getting printer status failed. Printer probably powered off and not connected to octoprint. This is ok.');
                    throw new Error("Printer offline :" + res.status);
                } else {
                    throw new Error("Status code error :" + res.status);
                }
            }
        )
        .then((out) => {

            console.log('Received printerJSON[',context,']', out);

            // Get hotend temperature
            if ( out.temperature && out.temperature.tool0 && out.temperature.tool0.actual) {
                printerStatus[context].hotend = Math.floor(out.temperature.tool0.actual);
            }

            // Get bed temperature
            if ( out.temperature && out.temperature.bed && out.temperature.bed.actual) {
                printerStatus[context].bed = Math.floor(out.temperature.bed.actual);
            }

            console.log('PrinterStatus[',context,']', printerStatus[context]);

            // Update button
            //octoDeckAction.SetImage(context, background[settings.octoBackground]);
            updateTitleText( context );
        })
        .catch(err => {
            console.log('Invalid API Response Error');

            // Its ok to get 409 from /api/printer. We dont want to show alert.
            // octoDeckAction.showAlert(context);

            // Reset if request failed.
            printerStatus[context].hotend = null;
            printerStatus[context].bed = null;
        })

}

function getData(settings, context) {
    if (!settings.octoUrl || !settings.octoKey || !settings.octoInterval || !settings.octoBackground) {
        octoDeckAction.showAlert(context);
        return;
    }

    // ## Make first request to get printers job status progress (and printers status ###
    fetchPrinterJobStatus( context, settings);

    // Make second request to get printers temperatures.
    fetchPrinterTemperatures(  context, settings );


}

function parseJson (jsonString) {
    if (typeof jsonString === 'object') return jsonString;
    try {
        const o = JSON.parse(jsonString);
        if (o && typeof o === 'object') {
            return o;
        }
    } catch (e) {}

    return false;
};
