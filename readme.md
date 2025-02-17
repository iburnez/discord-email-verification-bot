<h1>Summary</h1>
This discord bot will listen to all messages on a specified discord channel (verificationChannelId). When users enter their email address it will callout to square.com api (squareToken) and attempt to find an existing customer matching that email address. If the email address is found the users role in the discord server is upadted to a specified role (verifiedRoleName).

<h3>Setup</h3>
1. Clone this repo locally
2. Add a config.json file to the /src folder with the following properties: </br>

{</br>
	"botToken": "",</br>
    	"clientId": "",</br>
	"guildId": "",</br>
	"squareToken": "",</br>
	"verificationChannelId": "",</br>
	"verifiedRoleName": "",</br>
	"adminRoleName": ""</br>
}</br>

3. Login to the developer portal for Discord: 
    * https://discord.com/developers/applications
4. Create a new application
5. Go to `General Information` and copy the `Application ID` and add it the config.json file `clientId` property.
	6. ![image](https://github.com/user-attachments/assets/7574dcde-d93e-4a35-823f-226cb85add11)
7. Go to Installation and set Install Link to 'None'
	8. ![image](https://github.com/user-attachments/assets/3d288286-1653-42cd-9dc4-250fc7f29859)
9. Go to the `Bot` section and select Reset Token to generate a new token.
    * copy the resulting token to the config.json file `botToken` property.
10. In the 'Bot' section got 'Privileged Gateway Intents' sub-section and enable the following intents: 
    * Presence Intent
    * Server Members Intent
    * Message Content Intent
11. To install the bot into your discord server 
12. Go to the 'OAuth2' section and 'Redirects' sub-section to create a redirect URL
    * Use the following format for the redirect URL https://discordapp.com/oauth2/authorize?&client_id={clientId}&scope=bot
13. On the 'OAuth2' page create a bot installation link by giving the bot the following scope/permissions:
    * Scopes: 
        * bot
        * application.commands
        * guild.members.read
        * roles_connections.write
        * messages.read
    * Permissions: 
        * Administrator
14. In the 'Select redirect URL' drop down select the redirect URL from the previous step
15. Copy the url from the 'Generated URL' section into your browser and following the prompts to install in the desired discord server
16. On discord.com or in the discord desktop app right click on the server name and click 'Copy Server Id'. Paste this value into the config.json file as the `guildId`
	17. ![image](https://github.com/user-attachments/assets/89ce2aae-9a94-4e50-a1c7-da19b96037c6)
    * if you do not see the 'Copy Server Id' [follow these step to enable developer mode on your account](https://www.howtogeek.com/714348/how-to-enable-or-disable-developer-mode-on-discord/)
18. Right click on the channel you want the bot to listen to and click 'Copy Channel Id' and paste that value into the config.json `verificationChannelId` property
	19. ![image](https://github.com/user-attachments/assets/6797213e-b9a9-4c16-949b-249322630e5e)
20. Right click on the server name and click 'Server Settings' > 'Roles'.
	21. ![image](https://github.com/user-attachments/assets/06e00792-a93c-4a24-a07a-00d7ed8a3a48)
22. Move the bot role to be higher than the role being assigned on verification (bots cannot assign a role higher than the role they have, assignment will result in an error)
	23. ![image](https://github.com/user-attachments/assets/882fdf62-c8be-4efb-977f-5da29affd06b)
16. Enter the name of the role you want users to be assigned after verification into the config.json `verifiedRoleName` property
17. Enter the name of the 'admin' role for this channel that will be allowed to use the /verify command
18. Login to the assoicated square account and create an application
19. Under the Credentials section copy the 'Access token' into the config.json `squareToken` property
	20. ![image](https://github.com/user-attachments/assets/32042f36-1e9d-4c8b-a3bc-5c27c2722faa)
21. In vscode terminal run `npm install`
22. In vscode terminal run `cd src`
23. In vscode terminal run `cd deploy-commands.js`
24. In vscode terminal run `cd ..`
25. In vscode terminal run `npm run autostart`
26. Bot should be running and listening to messages on the discord server.
