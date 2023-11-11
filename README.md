![Static Badge](https://img.shields.io/badge/built%20while%20sleep%20deprived-8A2BE2?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAArlBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAABAQECAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD6+voAAAAAAABWVlb///+Kioqfn5/k5OT///////8AAAD///8BAQEICAgWFhYqKipVVVUgICBwcHAODg47OztEREQyMjJ+fn7Q0NBlZWVMTExqamphYWGhoaHv7++Pj4/d3d2ysrK8vLzAtKruAAAAIXRSTlMAyzPbBw4baUD1tqrpTXMl+pJhhftae/2h8GYeYG6PvN/1mIHfAAABoUlEQVRYw+2Vx3aDMBBF6c1U44LThaimg42d//+xQNzAiQHL52SRw12xeVfSjBhh2MjIyMhfQDEcq6CGaUXSBZLnOaQwMdVwUQUVdwuqXcsGvoIAzgCKgKt2DZrcK2DBFY8IoB36sf/6jCSAdpBvkq1pmsuP97cXTqHvEayj9BCu2X7Ggc2LgjblGGqQICrPYXO3zyPrdKQVKehzgu4TeMkxvNxtCsdqFhQCMBNxY051CvxDOildD4Jf4aVOQVnn95l9I13DdgqcMlnuvNtpYIdPPV2ws9iN1jfi69B12L42QsvLUrddwANWUFRdkYfcRMtx82uHFaRhvbNBAgDhOkj97NIKGOWu/f3VJZjCq4L5/rEhTl6cSrvoEfBi8/J4buyHtpf6ztndJZCqMWQQOtk6ulPEcdAoR5eA1shJNUYVGZ+1mneKq2rPRcKw4y/HTAX+ZxtJVuchPnBQ09JEbMfVCYFR0pwZPmAJjWwtT98/4JUFDi/LI8Gw+Hc7dRr5gZtDlAemeTfqjooEuoCpz6BR6AKMMASZxh6CwkZGRv4/XzbvWiNq+LZnAAAAAElFTkSuQmCC)

# Communauté Events Discord Bot

The official discord bot of Communauté Events. Basic documentation is coming soon.

### Running

To run this bot, you need:
1. An [event monitoring websocket](https://github.com/Communaute-Events/ce-event-monitor)
2. A MongoDB database
3. A discord bot account

The **.env** file should look like this:
```dosini
BOT_TOKEN=<bot token>
CLIENT_ID=<bot client id>
SOCKET_URL=<websocket url>
MONGO_URI=<mongodb uri>
```

### Contributing

Feel free to open issues, PRs, etc... I'm not very familiar with git so I may take a little bit of time to accept your changes.