# discord-funding-bot
A bot to track progress of a signupgenius and send that to a discord server

## DISCLAIMER
I am not a professional node.js programmer. I didn't follow any best practices for this code (Except I kept my discord API token as a github secret). Use at your own risk

## What it does
In index.js, it grabs a signupgenius (The URL is stored as a secret so random people don't sign up on it), and saves it's HTML code. It separates the signups from the rest of the page using DIV tags, then it totals up either just numbers, or numbers with $ signs in front of them. Once it does that, it totals up the numbers, then uses discord.js to send a message to a specified channel.
The run.yml file runs the bot on a cron schedule.
