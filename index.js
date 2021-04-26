//Libraries
const axios = require('axios').default
const Discord = require('discord.js')
let client = new Discord.Client()

//Strings
const yes = "█"
const no = "░"

//Utility function for string manipulation
function regexIndexOf(string, regex, startpos) {
    var indexOf = string.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}

let token
if(process.env.BOT_TOKEN) {
    token = process.env.BOT_TOKEN
} else {
    token = require('./token.json').token
}

let url
if(process.env.SG_URL) {
    url = process.env.SG_URL
} else {
    url = require('./token.json').url
}

//A list of promises
let promis = []

//The code I wrote myself
async function update() {
    //Logs in the Discord bot
    await client.login(token)
    //Grabs site data
    let site = await axios.get(url)
    let data = site.data

    //Finds the data users inputted, splitting the html into sections by the div tags
    let table = data.split(/(<div class="SUGMemberComment">|<\/div>|\(.*\))/gm)
    let numbers = [];
    console.log(table)
    let postcards = false
    table.forEach(item => {
        if(item.length <= 5) {
            //Tests if the string is either a number, or a number with a $ in front
            if(regexIndexOf(item, /(\$[0-9]|[0-9])/, 0) === 0) {
                //console.log(item)
                //Adds each number to the list
                numbers.push(item)
            }
        }
    })
    //For debugging
    console.log(numbers)

    //Detects and finds the total
    let total = 0;
    numbers.forEach(item => {
        total += parseInt(item.replace('\$',""))
    })
    console.log("TOTAL: $" + total)

    //Progress bar string
    let percent = (total / 94) * 10
    let numy = Math.floor(percent)
    let numx = 10 - numy
    let bar = ""
    for (let i = 0; i < numy; i++) {
        bar += yes
    }
    for (let i = 0; i < numx; i++) {
        bar += no
    }

    let done = false
    let channel = await client.channels.fetch("826218090018242621")

    while(!done) {
        try {
            //This is to check if the total is the same as earlier
            let isEqual = false

            let messages = await channel.messages.fetch()
            console.log(`Received ${messages.size} messages`);
            messages.array().forEach(message => {
                let a = message.content.split(" ")
                if(a[a.length - 1] === "$" + total) {
                    isEqual = true
                }
            })

            //Deletes previous progress messages if the total is different
            if(!isEqual) {
                messages.array().forEach(message => {
                    promis.push(message.delete())
                })
                //Sends the message if theres a new total
                promis.push(channel.send("Current funding progress: \n" + "[" + bar + "]\n" +
                    "Total raised: $" + total))

            }
            done = true




        } catch (e) {
            //Once in a while, discord.js fails to send the message. This loop and catch block are designed to keep trying until success.
            console.log("Oops lol")
            channel = await client.channels.fetch("826218090018242621")
        }


    }
}

//Some code to actually run the update function
console.log("Beginning update")
update().then(() => {
    Promise.all(promis).then(() => {
        console.log("Finished")
        process.exit()
    })
})
