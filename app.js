const request = require('request');
const express = require('express');
const fs = require('fs');
const { error } = require('console');
const app = express();

app.use(express.json());
app.use(express.urlencoded())

// Define global variables
let playerList;
let formData;
let id;
let token;

function makeRequest(url) {
return new Promise((resolve, reject) => {
    request({ url: url, json: true }, (error, response, body) => {
        if (error) {
            reject(error);
        } else {
            resolve({ response, body });
        }
        });
    });
}

// Function to read and update global variables
function readAndUpdateGlobalVariables() {
    fs.readFile('playerList.json', 'utf8', (err, playerListData) => {
        if (err) {
            console.error('Error reading playerList.json:', err);
            return;
        }

        fs.readFile('pathData.json', 'utf8', (err, pathData) => {
            if (err) {
                console.error('Error reading pathData.json:', err);
                return;
            }

            fs.readFile('pass.json', 'utf8', (err, passData) => {
                if (err) {
                    console.error('Error reading pass.json:', err);
                    return;
                }

                // Parse JSON data and update global variables
                playerList = JSON.parse(playerListData);
                formData = JSON.parse(pathData);
                id = formData.battleid
                token = JSON.parse(passData).token;

                // // You can now use these global variables anywhere in your script
                // console.log('Player List:', playerList);
                // console.log('Form Data:', formData);
                // console.log('Token:', token);

                // Call functions or perform other operations that depend on these variables
                // ...
            });
        });
    });
}

// Call the function to read and update global variables
readAndUpdateGlobalVariables();



// delete require.cache[require.resolve('./playerList.json')];
// delete require.cache[require.resolve('./pathData.json')];
// delete require.cache[require.resolve('./pass.json')];

// //581722252141704640 // 256264473860831638
// let playerList = require('./playerList.json');
// let formData = require('./pathData.json')
// let id = formData.battleid
// let token = require('./pass.json').token

const formatTime = (number) => {
    const hours = Math.floor(number / 60);
    const minutes = number % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}

function roles_letter(letter) {
    const roleMap = {
        'mid': 1,
        'exp': 2,
        'gold': 3,
        'jg': 4,
        'roam': 5,
    };
    return roleMap[letter] || 0;
}

// Example role_sorter function
function role_sorter(array, playerList) {
    // Iterate through the array and assign c_role based on playerList data
    for (const player of array) {
        if (playerList && playerList[player.roleid]) {
            player.c_role = playerList[player.roleid].role;
        } else {
            player.c_role = 'undefined';
        }
    }

    // Sort the array based on c_role
    array.sort((a, b) => roles_letter(a.c_role) - roles_letter(b.c_role));

    return array;
}

function name_finder(roleid, playerList) {
    if (playerList[roleid]) {
        return playerList[roleid].name
    } else {
        return null
    }
}

// let battleData = 'http://esportsdata.mobilelegends.com:30260/battledata?authkey=ee3af4c1a0963e7f052754e66bcb7b6f&battleid=' + id + '&dataid=1';
// let postData = 'http://esportsdata.mobilelegends.com:30260/postdata?authkey=ee3af4c1a0963e7f052754e66bcb7b6f&battleid=' + id;
const roleList = {
    mid : [68803090, 223230224, 483831473, 774330503],
    exp : [94049667, 73886849, 397274893, 188967162],
    gold : [209758451, 65230628, 314791724, 1356202800],
    jungle : [29280266, 78879183, 165882875, 238782140],
    roam : [95662347, 231789508, 198130240, 415045935]
}

const playerNames = {
    68803090 : "ACK", 223230224 : "Rinz Wong", 94049667 : "Ying", 73886849 : "Gobs Wong", 209758451 : "Kafuu", 65230628 : "Bunny", 29280266 : "Policy", 
    78879183 : "ldok", 95662347 : "Gugun", 231789508 : "Tychon", 165882875 : "Ange", 198130240 : "Burman Esports", 483831473 : "TOM", 397274893 : "Wiboy",
    314791724 : "UN 7", 188967162 : "Tyke", 774330503 : "Suplax", 1356202800 : "Sweet Coffee", 415045935 : "Yann" , 238782140 : "LanShin"
}

const heroNames = {1: "MIYA", 2: "BALMOND", 3: "SABER", 4: "ALICE", 5: "NANA", 6: "TIGREAL", 7: "ALUCARD", 8: "KARINA", 9: "AKAI", 10: "FRANCO", 
    11: "BANE", 12: "BRUNO", 13: "CLINT", 14: "RAFAELA", 15: "EUDORA", 16: "ZILONG", 17: "FANNY", 18: "LAYLA", 19: "MINOTAUR", 20: "LOLITA", 
    21: "HAYABUSA", 22: "FREYA", 23: "GORD", 24: "NATALIA", 25: "KAGURA", 26: "CHOU", 27: "SUN", 28: "ALPHA", 29: "RUBY", 30: "YI SUN-SHIN", 31: "MOSKOV", 
    32: "JOHNSON", 33: "CYCLOPS", 34: "ESTES", 35: "HILDA", 36: "AURORA", 37: "LAPU-LAPU", 38: "VEXANA", 39: "ROGER", 40: "KARRIE", 41: "GATOTKACA", 
    42: "HARLEY", 43: "IRITHEL", 44: "GROCK", 45: "ARGUS", 46: "ODETTE", 47: "LANCELOT", 48: "DIGGIE", 49: "HYLOS", 50: "ZHASK", 51: "HELCURT", 
    52: "PHARSA", 53: "LESLEY", 54: "JAWHEAD", 55: "ANGELA", 56: "GUSION", 57: "VALIR", 58: "MARTIS", 59: "URANUS", 60: "HANABI", 61: "CHANG'E", 
    62: "KAJA", 63: "SELENA", 64: "ALDOUS", 65: "CLAUDE", 66: "VALE", 67: "LEOMORD", 68: "LUNOX", 69: "HANZO", 70: "BELERICK", 71: "KIMMY", 
    72: "THAMUZ", 73: "HARITH", 74: "MINSITTHAR", 75: "KADITA", 76: "FARAMIS", 77: "BADANG", 78: "KHUFRA", 79: "GRANGER", 80: "GUINEVERE", 81: "ESMERALDA", 
    82: "TERIZLA", 83: "X.BORG", 84: "LING", 85: "DYRROTH", 86: "LYLIA", 87: "BAXIA", 88: "MASHA", 89: "WANWAN", 90: "SILVANNA", 91: "CECILION", 
    92: "CARMILLA", 93: "ATLAS", 94: "POPOL AND KUPA", 95: "YU ZHONG", 96: "LUO YI", 97: "BENEDETTA", 98: "KHALEED", 99: "BARATS", 100: "BRODY", 
    101: "YVE", 102: "MATHILDA", 103: "PAQUITO", 104: "GLOO", 105: "BEATRIX", 106: "PHOVEUS", 107: "NATAN", 108: "AULUS", 109: "AAMON", 110: "VALENTINA", 
    111: "EDITH", 112: "FLORYN", 113: "YIN", 114: "MELISSA", 115: "XAVIER", 116: "JULIAN", 117: "FREDRINN", 118: "JOY", 119: "NOVARIA", 120: "ARLOTT",
    121: "IXIA", 122 : "NOLAN"}

// app.get('/token', (req, res) => {
//     res.sendFile(__dirname + '/public/token.html')
// })

// app.post('/tokenup', (req, res) => {
//     const data = req.body.token
//     if (data) {
//         let tokenData = {}
//         tokenData.token = data
//         const jsonFormData = JSON.stringify(tokenData, null, 2)

//         fs.writeFile('pass.json', jsonFormData, (err) => {
//             if (err) {
//                 console.error('Error saving Form data:', err);
//             }
//         })
//         res.status(200).send('Token data Received successfully')
//     } else {
//         res.status(400).send('Invalid data provided.');
//     }
// })

app.get('/playerList', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/path', (req, res) => {
    res.sendFile(__dirname + '/public/path.html')
})

app.post('/pathupdate', (req, res) => {
    let newData = req.body
    if (newData.pass === token) {
        if (newData) {
            const jsonFormData = JSON.stringify(newData, null, 2)
    
            fs.writeFile('pathData.json', jsonFormData, (err) => {
                if (err) {
                    console.error('Error saving Form data:', err);
                }
            })
            readAndUpdateGlobalVariables();
            res.status(200).send('Form data Received successfully')
        } else {
            res.status(400).send('Invalid data provided.');
        }
    } else {
        res.status(400).send('Wrong token.');
    }
    
})

app.get('/getFormData', (req,res) => {
    fs.readFile('pathData.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading Path data:', err);
            return res.status(500).json({ error: 'Error reading playerList data.' });
        }

        try {
            const formListData = JSON.parse(data);
            return res.status(200).json(formListData);
        } catch (error) {
            console.error('Error parsing form data:', error);
            return res.status(500).json({ error: 'Error parsing form data.' });
        }
    })
})

app.post('/up', (req, res) => {
    let newData = req.body;
    if (newData) {
        const fileData = JSON.stringify(newData, null, 2)
        fs.writeFile('playerList.json', fileData, (err) => {
            if (err) {
                console.error('Error saving playerList data:', err);
                //return res.status(500).send('Error saving playerList data.');
            }
        })
        console.log(playerList);
        readAndUpdateGlobalVariables();
        res.status(200).send('Player list received successfully.');
    } else {
        res.status(400).send('Invalid data provided.');
    }
    
});

app.get('/code', (req, res) => {
    res.send({
        code : id,
        playerList,
        formData
    })
})

app.get('/getplayers', (req, res) => {
    // Read data from playerList.json file
    fs.readFile('playerList.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading playerList data:', err);
            return res.status(500).json({ error: 'Error reading playerList data.' });
        }

        try {
            // Parse the JSON data into a JavaScript object
            const playerListData = JSON.parse(data);

            // Create a response object with "playerList" key
            const response = {
                playerList: playerListData
            };

            // Send the response as JSON
            return res.status(200).json(response);
        } catch (parseError) {
            console.error('Error parsing playerList data:', parseError);
            return res.status(500).json({ error: 'Error parsing playerList data.' });
        }
    });
});

app.get('/post-data', (req, res) => {
    const postData = 'http://esportsdata.mobilelegends.com:30260/postdata?authkey=0874e8b4de7bcdecf0abaddee9b279e2&battleid=' + id;
    request({ url : postData, json : true }, (error, response, body) => {
        if(error) {
            return res.status(500).send(error)
        }
        try {
            let responseData = {}
            let team1 = body.data.hero_list.filter((player) => player.campid == 1)
            let team2 = body.data.hero_list.filter((player) => player.campid == 2)
            role_sorter(team1, playerList)
            role_sorter(team2, playerList)

            //team1Score
            let team1TotalKill = 0
            let team2TotalKill = 0
            for (let i = 0; i < 2; i++) {
                let team = i == 0 ? team1 : team2
                let teamKill = i == 0 ? team1TotalKill : team2TotalKill
                team.map((player) => teamKill = teamKill + player.kill_num)
                responseData[`team${i+1}TotalKil`] = teamKill
            }
            
            //victory
            responseData.team1Victory = body.data.win_camp == 1 ? 'VICTORY' : 'DEFEAT'
            responseData.team2Victory = body.data.win_camp == 1 ? 'DEFEAT' : 'VICTORY'
            //teamName
            for (let i = 0; i < 2; i++) {
                responseData[`team${i+1}Name`] = formData[`team${i+1}_name`] || body.data.camp_list[i].team_name
            }
            //teamShortName
            for (let i = 0; i < 2; i++) {
                responseData[`team${i+1}ShortName`] = formData[`team${i+1}_shortName`] || body.data.camp_list[i].team_simple_name
            }
            //teamLogo
            for (let i = 0; i < 2; i++) {
                responseData[`team${i+1}Logo`] = `${formData.post1Logo}${formData[`team${i+1}_shortName`] || body.data.camp_list[i].team_simple_name}.png`
            }
            //team1PlayerKDA
            for (let i = 0; i < 5; i++) {
                responseData[`team1Player${i+1}KDA`] = `${team1[i].kill_num} / ${team1[i].dead_num} / ${team1[i].assist_num}`
            }
            //team2PlayerKDA
            for (let i = 0; i < 5; i++) {
                responseData[`team2Player${i+1}KDA`] = `${team2[i].kill_num} / ${team2[i].dead_num} / ${team2[i].assist_num}`
            }
            //team1PlayerGold
            for (let i = 0; i < 5; i++) {
                responseData[`team1Player${i+1}Gold`] = team1[i].total_money
            }
            //team2Playergold
            for (let i = 0; i < 5; i++) {
                responseData[`team2Player${i+1}Gold`] = team2[i].total_money
            }
            //team1PlayerLvl
            for (let i = 0; i < 5; i++) {
                responseData[`team1Player${i+1}Level`] = team1[i].level
            }
            //team2PlayerLvl
            for (let i = 0; i < 5; i++) {
                responseData[`team2Player${i+1}Level`] = team2[i].level
            }
            //team1PlayerHero
            for (let i = 0; i < 5; i++) {
                responseData[`team1Hero${i+1}`] = `${formData.post1Hero}${team1[i].heroid}.png`
            }
            //team2PlayerHero
            for (let i = 0; i < 5; i++) {
                responseData[`team2Hero${i+1}`] = `${formData.post1Hero}${team2[i].heroid}.png`
            }
            //team1PlayerHero2
            for (let i = 0; i < 5; i++) {
                responseData[`team1Post2Hero${i+1}`] = `${formData.post2Hero}RIGHT/${team1[i].heroid}.png`
            }
            //team2PlayerHero2
            for (let i = 0; i < 5; i++) {
                responseData[`team2Post2Hero${i+1}`] = `${formData.post2Hero}RIGHT/${team2[i].heroid}.png`
            }
            //team1HeroName
            for (let i = 0; i < 5; i++) {
                responseData[`team1HeroName${i+1}`] = heroNames[team1[i].heroid]
            }
            //team1HeroName
            for (let i = 0; i < 5; i++) {
                responseData[`team2HeroName${i+1}`] = heroNames[team2[i].heroid]
            }
            //team1Items
            for (let i = 0; i < 5; i++) {
                for (let n = 0; n < 6; n++) {
                    responseData[`team1Player${i+1}Item${n+1}`] = `${formData.post1ItemPath}${team1[i].equip_list[n] == null ? 0 : team1[i].equip_list[n]}.png`
                }
            }
            //team2Items
            for (let i = 0; i < 5; i++) {
                for (let n = 0; n < 6; n++) {
                    responseData[`team2Player${i+1}Item${n+1}`] = `${formData.post1ItemPath}${team2[i].equip_list[n] == null ? 0 : team2[i].equip_list[n]}.png`
                }
            }
            //team1Name
            for (let i = 0; i < 5; i++) {
                responseData[`player${i+1}Name`] = name_finder(team1[i].roleid, playerList) || team1[i].name
            }
            //team2Name
            for (let i = 0; i < 5; i++) {
                responseData[`player${i+6}Name`] = name_finder(team2[i].roleid, playerList) || team2[i].name
            }
            //team1PlayerPic
            for (let i = 0; i < 5; i++) {
                responseData[`player${i+1}Photo`] = `${formData.resultPlayer}${team1[i].roleid}.png`
            }
            //team2PlayerPic
            for (let i = 0; i < 5; i++) {
                responseData[`player${i+6}Photo`] = `${formData.resultPlayer}${team2[i].roleid}.png`
            }
            //team1Spell
            for (let i = 0; i < 5; i++) {
                responseData[`player${i+1}Spell`] = `${formData.resultSpell}${team1[i].skillid}.png`
            }
            //team2Spell
            for (let i = 0; i < 5; i++) {
                responseData[`player${i+6}Spell`] = `${formData.resultSpell}${team2[i].skillid}.png`
            }
            //team1Emblem
            for (let i = 0; i < 5; i++) {
                for (let n = 0; n < 3; n++) {
                    responseData[`player${i+1}Emblem${n+1}`] = `${formData.resultEmblem}${team1[i].rune_map[n+1] || 0}.png`
                }
            }
            //team2Emblem
            for (let i = 0; i < 5; i++) {
                for (let n = 0; n < 3; n++) {
                    responseData[`player${i+6}Emblem${n+1}`] = `${formData.resultEmblem}${team2[i].rune_map[n+1] || 0}.png`
                }
            }
            //team1MainEmblem
            for (let i = 0; i < 5; i++) {
                responseData[`player${i+1}MainEmblem`] = `${formData.resultEmblem}${team1[i].runeid}.png`
            }
            //team2MainEmblem
            for (let i = 0; i < 5; i++) {
                responseData[`player${i+6}MainEmblem`] = `${formData.resultEmblem}${team2[i].runeid}.png`
            }
            //teamData
            let camp1 = body.data.camp_list[0]
            let camp2 = body.data.camp_list[1]

            //gold
            for (let i = 0; i < 2; i++) {
                let camp = i == 0 ? camp1 : camp2
                responseData[`team${i + 1}TotalGold`] = camp.total_money.toLocaleString()
            }
            //goldShort
            for (let i = 0; i < 2; i++) {
                let camp = i == 0 ? camp1 : camp2
                responseData[`team${i+1}GoldShort`] = `${(camp.total_money / 1000).toFixed(1)}k`
            }            
            //tower
            for (let i = 0; i < 2; i++) {
                let camp = i == 0 ? camp1 : camp2
                responseData[`team${i+1}Tower`] = camp.kill_tower 
            }
            //lord
            for (let i = 0; i < 2; i++) {
                let camp = i == 0 ? camp1 : camp2
                responseData[`team${i+1}Lord`] = camp.kill_lord
            }
            //turtle
            for (let i = 0; i < 2; i++) {
                let camp = i == 0 ? camp1 : camp2
                responseData[`team${i+1}Turtle`] = camp.kill_totoise
            }
            //red
            for (let i = 0; i < 2; i++) {
                let camp = i == 0 ? camp1 : camp2
                responseData[`team${i+1}RedBuff`] = camp.red_buff_num
            }
            //blue
            for (let i = 0; i < 2; i++) {
                let camp = i == 0 ? camp1 : camp2
                responseData[`team${i+1}BlueBuff`] = camp.blue_buff_num
            }
            //timer
            responseData.gameTime = formatTime(body.data.game_time)
            //Total Damage
            for(let i = 0; i < 2; i++) {
                let camp = i == 0 ? camp1 : camp2
                responseData[`team${i+1}TotalDamage`] = camp.total_damage.toLocaleString()
            }
            //ddbar
            responseData.toTalDamageBar = `${formData.totalDamageBar}${((camp2.total_damage / (camp1.total_damage + camp2.total_damage)) * 100).toFixed(0)}.png`
            //Damage Taken
            for (let i = 0; i < 2; i++) {
                let team = i == 0 ? team1 : team2
                let totalHurt = 0
                team.map((player) => totalHurt = totalHurt + player.total_hurt)
                responseData[`team${i+1}TotalDamageTaken`] = totalHurt.toLocaleString()
            }
            let team1TotalDamageTaken = 0
            team1.map((player) => team1TotalDamageTaken += player.total_hurt)
            let team2TotalDamageTaken = 0
            team2.map((player) => team2TotalDamageTaken += player.total_hurt)
            //DTBar
            responseData.damageTakenBar = `${formData.totalDamageTakenBar}${((team2TotalDamageTaken / (team1TotalDamageTaken + team2TotalDamageTaken)) * 100).toFixed(0)}.png`
            //Tower Damage
            for (let i = 0; i < 2; i++) {
                let team = i == 0 ? team1 : team2
                let totalTowerDamage = 0
                team.map((player) => totalTowerDamage = totalTowerDamage + player.total_damage_tower)
                responseData[`team${i+1}TowerDamage`] = totalTowerDamage.toLocaleString()
            }
            let team1TowerDamage = 0
            team1.map((player) => team1TowerDamage += player.total_damage_tower)
            let team2TowerDamage = 0
            team2.map((player) => team2TowerDamage += player.total_damage_tower)
            //towerBar
            responseData.totalTowerDamageBar = `${formData.totalTowerDamageBar}${((team2TowerDamage / (team1TowerDamage + team2TowerDamage)) * 100).toFixed(0)}.png`
            //LTT
            for (let i = 0; i < 2; i++) {
                let camp = i == 0 ? camp1 : camp2
                responseData[`team${i+1}TurtleLordTurret`] = `${camp.kill_totoise} / ${camp.kill_lord} / ${camp.kill_tower}`
            }
            let team1Ltt = camp1.kill_lord + camp1.kill_totoise + camp1.kill_tower
            let team2Ltt = camp2.kill_lord + camp2.kill_totoise + camp2.kill_tower
            //lttbar
            responseData.TurtleLordTurretBar = `${formData.TurtleLordTurretBar}${((team2Ltt / (team1Ltt + team2Ltt)) * 100).toFixed(0)}.png`
            //HightestGold
            let hightestGoldPlayer
            let hightestDamagePlayer
            let hightestDamageTaken
            let hightestAssist 
            let allData = body.data.hero_list
            allData.sort((a,b) => b.total_money - a.total_money)
            hightestGoldPlayer = allData[0]
            allData.sort((a,b) => b.total_damage - a.total_damage)
            hightestDamagePlayer = allData[0]
            allData.sort((a,b) => b.total_hurt - a.total_hurt)
            hightestDamageTaken = allData[0]
            allData.sort((a,b) => b.assist_num - a.assist_num)
            hightestAssist = allData[0]
            // console.log(hightestGoldPlayer.name)
            // console.log(hightestDamagePlayer.name)
            // console.log(hightestDamageTaken.name)
            // console.log(hightestAssist.name)
            //gold
            responseData.hightestGoldPlayer = name_finder(hightestGoldPlayer.roleid, playerList) || hightestGoldPlayer.name
            responseData.hightestGoldPlayerPic = `${formData.hightest}${hightestGoldPlayer.roleid}.png`
            responseData.hightestGold = hightestGoldPlayer.min_money
            //damage
            responseData.hightestDamagePlayer = name_finder(hightestDamagePlayer.roleid, playerList) || hightestDamagePlayer.name
            responseData.hightestDamagePlayerPic = `${formData.hightest}${hightestDamagePlayer.roleid}.png`
            responseData.hightestDamage = hightestDamagePlayer.total_damage.toLocaleString()
            //damageTaken
            responseData.hightestDamageTakenPlayer = name_finder(hightestDamageTaken.roleid, playerList) || hightestDamageTaken.name
            responseData.hightestDamageTakenPlayerPic = `${formData.hightest}${hightestDamageTaken.roleid}.png`
            responseData.hightestDamageTaken = hightestDamageTaken.total_hurt.toLocaleString()
            //mostAssist
            responseData.hightestAssistPlayer = name_finder(hightestAssist.roleid, playerList) || hightestAssist.name
            responseData.hightestAssistPlayerPic = `${formData.hightest}${hightestAssist.roleid}.png`
            responseData.hightestAssist = hightestAssist.assist_num

            let jsonData = { data : [responseData]} 
            res.send(jsonData)
        } catch (e) {
            res.status(500).send(e)
        }
    })
})

app.get('/mvp', (req, res) => {
    const postData = 'http://esportsdata.mobilelegends.com:30260/postdata?authkey=0874e8b4de7bcdecf0abaddee9b279e2&battleid=' + id;
    request({ url : postData, json : true }, (error, response, body) => {
        if(error) {
            return res.status(500).send(error)
        }

        try {
            let responseData = {}
            let winner = body.data.win_camp
            let mvpPlayer = body.data.hero_list.find((player) => player.campid === winner && player.mvp === true)
            let mvpPlayer2 = body.data.hero_list.find((player) => player.campid !== winner && player.mvp === true)
            let loseCampPlayers = body.data.hero_list.filter((player) => player.campid !== winner)
            if(!mvpPlayer2) {
                loseCampPlayers.sort((a,b) => b.score - a.score)
                mvpPlayer2 = loseCampPlayers[0] || null
            }
            let winnerPlayers = body.data.hero_list.filter((player) => player.campid === winner)
            let totalKill = 0
            winnerPlayers.map((player) => totalKill+=player.kill_num)
            let loseTeamTotalKill = 0
            loseCampPlayers.map((player) => loseTeamTotalKill+=player.kill_num)

            // responseData.winnerTeamName = formData[`team${winner}_name`] || mvpPlayer.team_name;
            responseData.winnerTeamName = winner == 1 ? formData.team1_name : formData.team2_name || mvpPlayer.team_name
            responseData.ShortName = winner == 1 ? formData.team1_shortName : formData.team2_shortName || mvpPlayer.team_simple_name
            responseData.teamLogo = winner == 1 ? `${formData.mvpLogoPath}${formData.team1_shortName}.png` : `${formData.mvpLogoPath}${formData.team2_shortName}.png`
            responseData.mvpPlayerName = name_finder(mvpPlayer.roleid, playerList) || mvpPlayer.name
            responseData.mvpPlayerPic = `${formData.mvpPlayerPath}${mvpPlayer.roleid}.png`
            responseData.heroName = heroNames[mvpPlayer.heroid]
            responseData.heroPic = `${formData.mvpHeroPath}${mvpPlayer.heroid}.png`
            responseData.BattleSpell = `${formData.mvpPlayerSpellPath}${mvpPlayer.skillid}.png`

            for (let i = 0; i < 3; i++) {
                responseData[`emblem${i + 1}`] = `${formData.mvpEmblemPath}${mvpPlayer.rune_map[i + 1]}.png`
            }
            responseData.customEmblem = `${formData.mvpEmblemPath}${mvpPlayer.runeid}.png`
            //items
            for (let i = 0; i < 6; i++) {
                responseData[`Item${i + 1}`] = mvpPlayer.equip_list[i] === null ? `${formData.mvpPlayerItemPath}0.png` : `${formData.mvpPlayerItemPath}${mvpPlayer.equip_list[i] || 0}.png`
            }                         
            
            responseData.kda = `${mvpPlayer.kill_num} / ${mvpPlayer.dead_num} / ${mvpPlayer.assist_num}`
            responseData.gpm = mvpPlayer.min_money

            responseData.kp = `${(((mvpPlayer.kill_num + mvpPlayer.assist_num) / totalKill) * 100).toFixed(0)}%`

            //mvp2
            responseData.mvpPlayerName2 = name_finder(mvpPlayer.roleid, playerList) || mvpPlayer2.name
            responseData.mvpPlayerPic2 = `${formData.mvpPlayerPath}${mvpPlayer2.roleid}.png`
            responseData.heroName2 = heroNames[mvpPlayer2.heroid]
            responseData.heroPic2 = `${formData.mvpHeroPath}${mvpPlayer2.heroid}.png`
            responseData.BattleSpell2 = `${formData.mvpPlayerSpellPath}${mvpPlayer2.skillid}.png`

            for (let i = 0; i < 3; i++) {
                responseData[`svpEmblem${i + 1}`] = `${formData.mvpEmblemPath}${mvpPlayer2.rune_map[i + 1]}.png`
            }
            responseData.customEmblem2 = `${formData.mvpEmblemPath}${mvpPlayer2.runeid}.png`
            //items
            for (let i = 0; i < 6; i++) {
                responseData[`svpItem${i + 1}`] = mvpPlayer2.equip_list[i] === null ? `${formData.mvpPlayerItemPath}0.png` : `${formData.mvpPlayerItemPath}${mvpPlayer2.equip_list[i] || 0}.png`
            }

            responseData.kda2 = `${mvpPlayer2.kill_num} / ${mvpPlayer2.dead_num} / ${mvpPlayer2.assist_num}`
            responseData.gpm2 = mvpPlayer2.min_money
            responseData.kp2 = `${(((mvpPlayer2.kill_num + mvpPlayer2.assist_num) / loseTeamTotalKill) * 100).toFixed(0)}%`

            let jsonData = { data : [responseData]}
            res.send(jsonData)
        } catch (e) {
            res.status(500).send(e)
        }
    })
})

app.get('/damageRanking', (req, res) => {
    const battleData = 'http://esportsdata.mobilelegends.com:30260/battledata?authkey=0874e8b4de7bcdecf0abaddee9b279e2&battleid=' + id + '&dataid=1';
    request({ url : battleData, json : true }, (error, response, body) => {
        if(error) {
            return res.status(500).send(error)
        }
        
        try {
            let a = body.data.camp_list
            const selectedCamps = a.filter((camp) => camp.campid === 1 || camp.campid === 2)
            const players = selectedCamps.map((camp) => camp.player_list).flat().map((player) => {
                return {
                    team : player.campid,
                    id : player.roleid,
                    name : name_finder(player.roleid, playerList) || player.name,
                    damage : player.total_damage,
                    damageShort : `${(player.total_damage / 1000).toFixed(1)}k`,
                    hero : `${formData.damageRankingHeroPath}${player.heroid}.png`
                }
            })
            players.sort((a,b) => b.damage - a.damage)
            let hightestDamage = players[0].damage

            players.forEach((player, index) => {
                const percent = ((player.damage / hightestDamage) * 100).toFixed(0)
                player.percentPng = `${formData.damagePercentPngPath}${player.team}/${index === 0 ? '100' : (percent === '100' ? '99' : percent)}.png`
            })
            res.send(players)
        } catch (e) {
            return res.status(500).send(e)
        }
    })
})

app.get('/goldRanking', (req, res) => {
    const battleData = 'http://esportsdata.mobilelegends.com:30260/battledata?authkey=0874e8b4de7bcdecf0abaddee9b279e2&battleid=' + id + '&dataid=1';
    request({ url : battleData, json : true }, (error, response, body) => {
        if(error) {
            return res.status(500).send(error)
        }

        try {
            let a = body.data.camp_list
            const selectedCamps = a.filter((camp) => camp.campid === 1 || camp.campid === 2);
            const players = selectedCamps.map((camp) => camp.player_list).flat().map((player) => {
                return {
                    team : player.campid,
                    id : player.roleid,
                    name : name_finder(player.roleid, playerList) || player.name,
                    gold : player.gold,
                    goldShort : `${(player.gold / 1000).toFixed(1)}k`,
                    hero : `${formData.goldRankingHeroPath}${player.heroid}.png`
                }
            })
            players.sort((a,b) => b.gold - a.gold)
            let highestGold = players[0].gold

            players.forEach((player, index) => {
                const percent = ((player.gold / highestGold) * 100).toFixed(0);
                player.percentPng = `${formData.goldPercentPngPath}${player.team}/${index === 0 ? '100' : (percent === '100' ? '99' : percent)}.png`;
            });
            res.send(players)
        } catch (e) {
            return res.status(500).send(e)
        }
    })
})

app.get('/hud', async (req, res) => {
    try {
        const battleData = 'http://esportsdata.mobilelegends.com:30260/battledata?authkey=0874e8b4de7bcdecf0abaddee9b279e2&battleid=' + id + '&dataid=1';
        const { response, body } = await makeRequest(battleData);
        if (response.statusCode !== 200) {
            return res.status(500).send('Request to external API failed');
        }

        let responseData = {}
        let a = body.data.camp_list
        let gameTime = body.data.game_time
        let team1 = a[0]
        let team2 = a[1]

        //teamLogo
        responseData.team1Name = formData.team1_name || team1.team_name
        responseData.team2Name = formData.team2_name || team2.team_name

        responseData.team1ShortName = formData.team1_shortName || team1.team_simple_name
        responseData.team2ShortName = formData.team2_shortName || team2.team_simple_name

        responseData.team1Logo = `${formData.hudLogoPath}${formData.team1_shortName || team1.team_simple_name}.png`
        responseData.team2Logo = `${formData.hudLogoPath}RIGHT/${formData.team2_shortName || team2.team_simple_name}.png`

        //game time
        responseData.gameTime = formatTime(gameTime)
        //team gold
        responseData.team1Gold = a[0].total_money > 10000 ? `${(a[0].total_money / 1000).toFixed(1)}k` : a[0].total_money
        responseData.team2Gold = a[1].total_money > 10000 ? `${(a[1].total_money / 1000).toFixed(1)}k` : a[1].total_money
        
        //gold diff
        responseData.goldDiff1 = a[0].total_money > a[1].total_money ? `+${((a[0].total_money - a[1].total_money) / 1000).toFixed(1)}k` : '';
        responseData.goldDiff2 = a[1].total_money > a[0].total_money ? `+${((a[1].total_money - a[0].total_money) / 1000).toFixed(1)}k` : '';

        //gold diff png
        responseData.goldDiffPng1 = a[0].total_money > a[1].total_money ? `${formData.goldLogo}1.png` : `${formData.goldLogo}0.png`
        responseData.goldDiffPng2 = a[1].total_money > a[0].total_money ?  `${formData.goldLogo}2.png` : `${formData.goldLogo}0.png`

        //TurtleKill
        responseData.team1TurtleKill = team1.kill_tortoise
        responseData.team2TurtleKill = team2.kill_tortoise

        //lordKill
        responseData.team1LordKill = team1.kill_lord
        responseData.team2LordKill = team2.kill_lord

        //totalKill
        for (let i = 0; i < 2; i++) {
            const team = a[i]
            responseData[`team${i + 1}TotalKill`] = team.score
        }

        //TowerDestory
        for (let i = 0; i < 2; i++) {
            const team = a[i]
            responseData[`team${i + 1}TowerDestoryed`] = team.kill_tower
        }

        let jsonData = { data : [responseData]} 
        res.send(jsonData)
    } catch (err) {
        return res.status(500).send(err)
    }
}) 

app.get('/emblem', (req, res) => {
    const battleData = 'http://esportsdata.mobilelegends.com:30260/battledata?authkey=0874e8b4de7bcdecf0abaddee9b279e2&battleid=' + id + '&dataid=1';
    request({ url : battleData, json : true }, (error, response, body) => {
        if(error) {
            return res.status(500).send('Error Fething Data')
        }
        try {
            let responseData = {}
            let a = body.data.camp_list
            
            let team1 = role_sorter(a[0].player_list, playerList)
            let team2 = role_sorter(a[1].player_list, playerList)

            //team1players Emblems
            for(let x = 0; x < 5; x++) {
                for(let i = 0; i < 3; i++) {
                    responseData[`p${x + 1}Emblem${i + 1}`] = `${formData.emblemPath}${team1[x].rune_map[i + 1]}.png` || ''
                }
            }
            
            //team2players Emblem
            for(let x = 0; x < 5; x++) {
                for(let i = 0; i < 3; i++) {
                    responseData[`p${x + 6}Emblem${i + 1}`] = `${formData.emblemPath}${team2[x].rune_map[i + 1]}.png` || ''
                }
            }
            
            //Team1spells
            for (let i = 0; i < 5 ; i++) {
                responseData[`spell${i + 1}`] = `${formData.spellPath}${team1[i].skillid}.png` || ''
            }
            
            //Team2spells
            for (let i = 0; i < 5 ; i++) {
                responseData[`spell${i + 6}`] = `${formData.spellPath}${team2[i].skillid}.png` || ''
            }
            //Team2spells
            for (let i = 0; i < 5 ; i++) {
                responseData[`custom${i + 1}`] = `${formData.emblemPath}${team1[i].rune_id}.png` || ''
            }
            for (let i = 0; i < 5 ; i++) {
                responseData[`custom${i + 6}`] = `${formData.emblemPath}${team2[i].rune_id}.png` || ''
            }
            
            let jsonData = { data : [responseData]} 
            res.send(jsonData)
        } catch (e) {
            console.error('Error processing data:', e);
            res.status(500).send('Error processing data');
        }
    })
})

app.get('/led', (req, res) => {
    const battleData = 'http://esportsdata.mobilelegends.com:30260/battledata?authkey=0874e8b4de7bcdecf0abaddee9b279e2&battleid=' + id + '&dataid=1';
    request({ url : battleData, json : true }, (error, response, body) => {
        if (error) {
            return res.status(500).send('Error fetching Data')
        }
        try {
            let responseData = {}
            let data = body
            let a = data.data.camp_list
            let team1 = role_sorter(a[0].player_list, playerList)
            let team2 = role_sorter(a[1].player_list, playerList)

            //time
            for (let i = 0; i < 5; i++) {
                responseData[`respawntime${i+1}`] = formatTime(team1[i].revive_left_time)
            }

            for (let i = 0; i < 5; i++) {
                responseData[`respawntime${i+6}`] = formatTime(team2[i].revive_left_time)
            }

            for (let i = 0; i < 5; i++) {
                responseData[`name${i+1}`] = name_finder(team1[i].roleid, playerList) || team1[i].name
            }

            for (let i = 0; i < 5; i++) {
                responseData[`name${i+6}`] = name_finder(team2[i].roleid, playerList) || team2[i].name
            }
            
            for (let i = 0; i < 5; i++) {
                responseData[`alive${i+1}`] = team1[i].revive_left_time == 0 ? `${formData.yes}/${team1[i].heroid}.png` : `${formData.no}/${team1[i].heroid}.png`
            }
            
            for (let i = 0; i < 5; i++) {
                responseData[`alive${i+6}`] = team2[i].revive_left_time == 0 ? `${formData.yes}/${team2[i].heroid}.png` : `${formData.no}/${team2[i].heroid}.png`
            }

            let jsonData = { data : [responseData]} 
            res.send(jsonData)
        } catch (e) {
            res.status(500).send(e)
        }
    })
})

app.get('/item', (req, res) => {
    const battleData = 'http://esportsdata.mobilelegends.com:30260/battledata?authkey=0874e8b4de7bcdecf0abaddee9b279e2&battleid=' + id + '&dataid=1';
    request({ url : battleData, json : true }, (error, response, body) => {
        if (error) {
            return res.status(500).send('Error Fething Data')
        }
        try {
            let responseData = {}
            let data = body
            let a = data.data.camp_list
            let team1 = role_sorter(a[0].player_list, playerList)
            let team2 = role_sorter(a[1].player_list, playerList)

            //playerNames
            responseData.player1Name = name_finder(team1[0].roleid, playerList) || team1[0].name
            responseData.player2Name = name_finder(team1[1].roleid, playerList) || team1[1].name
            responseData.player3Name = name_finder(team1[2].roleid, playerList) || team1[2].name
            responseData.player4Name = name_finder(team1[3].roleid, playerList) || team1[3].name
            responseData.player5Name = name_finder(team1[4].roleid, playerList) || team1[4].name

            responseData.player6Name = name_finder(team2[0].roleid, playerList) || team2[0].name
            responseData.player7Name = name_finder(team2[1].roleid, playerList) || team2[1].name
            responseData.player8Name = name_finder(team2[2].roleid, playerList) || team2[2].name
            responseData.player9Name = name_finder(team2[3].roleid, playerList) || team2[3].name
            responseData.player10Name = name_finder(team2[4].roleid, playerList) || team2[4].name

            //gold
            responseData.gold1 = team1[0].gold.toLocaleString() || ''
            responseData.gold2 = team1[1].gold.toLocaleString() || ''
            responseData.gold3 = team1[2].gold.toLocaleString() || ''
            responseData.gold4 = team1[3].gold.toLocaleString() || ''
            responseData.gold5 = team1[4].gold.toLocaleString() || ''
            
            responseData.gold6 = team2[0].gold.toLocaleString() || ''
            responseData.gold7 = team2[1].gold.toLocaleString() || ''
            responseData.gold8 = team2[2].gold.toLocaleString() || ''
            responseData.gold9 = team2[3].gold.toLocaleString() || ''
            responseData.gold10 = team2[4].gold.toLocaleString() || ''

            //goldshort
            responseData.gold1Short = team1[0].gold >= 1000 ? (team1[0].gold / 1000).toFixed(1) + 'k' : team1[0].gold.toString();
            responseData.gold2Short = team1[1].gold >= 1000 ? (team1[1].gold / 1000).toFixed(1) + 'k' : team1[1].gold.toString();
            responseData.gold3Short = team1[2].gold >= 1000 ? (team1[2].gold / 1000).toFixed(1) + 'k' : team1[2].gold.toString();
            responseData.gold4Short = team1[3].gold >= 1000 ? (team1[3].gold / 1000).toFixed(1) + 'k' : team1[3].gold.toString();
            responseData.gold5Short = team1[4].gold >= 1000 ? (team1[4].gold / 1000).toFixed(1) + 'k' : team1[4].gold.toString();

            responseData.gold6Short = team2[0].gold >= 1000 ? (team2[0].gold / 1000).toFixed(1) + 'k' : team2[0].gold.toString();
            responseData.gold7Short = team2[1].gold >= 1000 ? (team2[1].gold / 1000).toFixed(1) + 'k' : team2[1].gold.toString();
            responseData.gold8Short = team2[2].gold >= 1000 ? (team2[2].gold / 1000).toFixed(1) + 'k' : team2[2].gold.toString();
            responseData.gold9Short = team2[3].gold >= 1000 ? (team2[3].gold / 1000).toFixed(1) + 'k' : team2[3].gold.toString();
            responseData.gold10Short = team2[4].gold >= 1000 ? (team2[4].gold / 1000).toFixed(1) + 'k' : team2[4].gold.toString();

            //damage
            responseData.damage1Short = team1[0].total_damage >= 1000 ? (team1[0].total_damage / 1000).toFixed(1) + 'k' : team1[0].total_damage.toString();
            responseData.damage2Short = team1[1].total_damage >= 1000 ? (team1[1].total_damage / 1000).toFixed(1) + 'k' : team1[1].total_damage.toString();
            responseData.damage3Short = team1[2].total_damage >= 1000 ? (team1[2].total_damage / 1000).toFixed(1) + 'k' : team1[2].total_damage.toString();
            responseData.damage4Short = team1[3].total_damage >= 1000 ? (team1[3].total_damage / 1000).toFixed(1) + 'k' : team1[3].total_damage.toString();
            responseData.damage5Short = team1[4].total_damage >= 1000 ? (team1[4].total_damage / 1000).toFixed(1) + 'k' : team1[4].total_damage.toString();

            responseData.damage6Short = team2[0].total_damage >= 1000 ? (team2[0].total_damage / 1000).toFixed(1) + 'k' : team2[0].total_damage.toString();
            responseData.damage7Short = team2[1].total_damage >= 1000 ? (team2[1].total_damage / 1000).toFixed(1) + 'k' : team2[1].total_damage.toString();
            responseData.damage8Short = team2[2].total_damage >= 1000 ? (team2[2].total_damage / 1000).toFixed(1) + 'k' : team2[2].total_damage.toString();
            responseData.damage9Short = team2[3].total_damage >= 1000 ? (team2[3].total_damage / 1000).toFixed(1) + 'k' : team2[3].total_damage.toString();
            responseData.damage10Short = team2[4].total_damage >= 1000 ? (team2[4].total_damage / 1000).toFixed(1) + 'k' : team2[4].total_damage.toString();

            //kda
            for (let i = 0; i < 5; i++) {
                responseData[`kda${i + 1}`] = `${team1[i].kill_num} / ${team1[i].dead_num} / ${team1[i].assist_num}`
            }

            for (let i = 0; i < 5; i++) {
                responseData[`kda${i + 6}`] = `${team2[i].kill_num} / ${team2[i].dead_num} / ${team2[i].assist_num}`
            }

            //Team1spells
            for (let i = 0; i < 5 ; i++) {
                responseData[`spell${i + 1}`] = `${formData.spellPath}${team1[i].skillid}.png` || ''
            }
            
            //Team2spells
            for (let i = 0; i < 5 ; i++) {
                responseData[`spell${i + 6}`] = `${formData.spellPath}${team2[i].skillid}.png` || ''
            }

            //heroes
            responseData.hero1 = `${formData.itemHeroPath}${team1[0].heroid}.png`
            responseData.hero2 = `${formData.itemHeroPath}${team1[1].heroid}.png`
            responseData.hero3 = `${formData.itemHeroPath}${team1[2].heroid}.png`
            responseData.hero4 = `${formData.itemHeroPath}${team1[3].heroid}.png`
            responseData.hero5 = `${formData.itemHeroPath}${team1[4].heroid}.png`

            responseData.hero6 = `${formData.itemHeroPath}${team2[0].heroid}.png`
            responseData.hero7 = `${formData.itemHeroPath}${team2[1].heroid}.png`
            responseData.hero8 = `${formData.itemHeroPath}${team2[2].heroid}.png`
            responseData.hero9 = `${formData.itemHeroPath}${team2[3].heroid}.png`
            responseData.hero10 = `${formData.itemHeroPath}${team2[4].heroid}.png`

            //goldDiff Hero
            responseData.goldDiffHero1 = `${formData.goldDiffHeroPath}${team1[0].heroid}.png`
            responseData.goldDiffHero2 = `${formData.goldDiffHeroPath}${team1[1].heroid}.png`
            responseData.goldDiffHero3 = `${formData.goldDiffHeroPath}${team1[2].heroid}.png`
            responseData.goldDiffHero4 = `${formData.goldDiffHeroPath}${team1[3].heroid}.png`
            responseData.goldDiffHero5 = `${formData.goldDiffHeroPath}${team1[4].heroid}.png`

            responseData.goldDiffHero6 = `${formData.goldDiffHeroPath}${team2[0].heroid}.png`
            responseData.goldDiffHero7 = `${formData.goldDiffHeroPath}${team2[1].heroid}.png`
            responseData.goldDiffHero8 = `${formData.goldDiffHeroPath}${team2[2].heroid}.png`
            responseData.goldDiffHero9 = `${formData.goldDiffHeroPath}${team2[3].heroid}.png`
            responseData.goldDiffHero10 = `${formData.goldDiffHeroPath}${team2[4].heroid}.png`

            //items ----------------------------------------------------------------------------------------------------------
            //P1Items
            for (let i = 0; i < 6; i++) {
                responseData[`p1Item${i + 1}`] = team1[0].equip_list == null ? `${formData.itemPath}0.png` : `${formData.itemPath}${team1[0].equip_list[i] || 0}.png`;
            }

            //P2Items
            for (let i = 0; i < 6; i++) {
                responseData[`p2Item${i + 1}`] = team1[1].equip_list == null ? `${formData.itemPath}0.png` : `${formData.itemPath}${team1[1].equip_list[i] || 0}.png`;
            }
            
            //P3Items
            for (let i = 0; i < 6; i++) {
                responseData[`p3Item${i + 1}`] = team1[2].equip_list == null ? `${formData.itemPath}0.png` : `${formData.itemPath}${team1[2].equip_list[i] || 0}.png`;
            }

            //P4Items
            for (let i = 0; i < 6; i++) {
                responseData[`p4Item${i + 1}`] = team1[3].equip_list == null ? `${formData.itemPath}0.png` : `${formData.itemPath}${team1[3].equip_list[i] || 0}.png`;
            }

            //P5Items
            for (let i = 0; i < 6; i++) {
                responseData[`p5Item${i + 1}`] = team1[4].equip_list == null ? `${formData.itemPath}0.png` : `${formData.itemPath}${team1[4].equip_list[i] || 0}.png`;
            }

            //P6Items
            for (let i = 0; i < 6; i++) {
                responseData[`p6Item${i + 1}`] = team2[0].equip_list == null ? `${formData.itemPath}0.png` : `${formData.itemPath}${team2[0].equip_list[i] || 0}.png`;
            }
            
            //P7Items
            for (let i = 0; i < 6; i++) {
                responseData[`p7Item${i + 1}`] = team2[1].equip_list == null ? `${formData.itemPath}0.png` : `${formData.itemPath}${team2[1].equip_list[i] || 0}.png`;
            }

            //P8Items
            for (let i = 0; i < 6; i++) {
                responseData[`p8Item${i + 1}`] = team2[2].equip_list == null ? `${formData.itemPath}0.png` : `${formData.itemPath}${team2[2].equip_list[i] || 0}.png`;
            }

            //P9Items
            for (let i = 0; i < 6; i++) {
                responseData[`p9Item${i + 1}`] = team2[3].equip_list == null ? `${formData.itemPath}0.png` : `${formData.itemPath}${team2[3].equip_list[i] || 0}.png`;
            }

            //P10Items
            for (let i = 0; i < 6; i++) {
                responseData[`p10Item${i + 1}`] = team2[4].equip_list == null ? `${formData.itemPath}0.png` : `${formData.itemPath}${team2[4].equip_list[i] || 0}.png`;
            }

            // //P6item
            // responseData.p5Item1=team1[4].equip_list==null?formData.itemPath+'0.png':formData.itemPath+(team1[4].equip_list[0]||0)+'.png'
            // responseData.p5Item2=team1[4].equip_list==null?formData.itemPath+'0.png':formData.itemPath+(team1[4].equip_list[1]||0)+'.png'

            //team1GoldDiff
            for (let i = 0; i < 5; i++) {
                const goldDiff = team1[i].gold - team2[i].gold;
                responseData[`team1GoldDiff${i + 1}`] = goldDiff > 0
                    ? (goldDiff >= 1000
                        ? (goldDiff / 1000).toFixed(1) + 'k'
                        : goldDiff.toString())
                    : '';
            }                    

            //team2GoldDiff
            for (let i = 0; i < 5; i++) {
                const goldDiff = team2[i].gold - team1[i].gold;
                responseData[`team2GoldDiff${i + 1}`] = goldDiff > 0
                    ? (goldDiff >= 1000
                        ? (goldDiff / 1000).toFixed(1) + 'k'
                        : goldDiff.toString())
                    : '';
            }            
            
            //goldDiffPng
            for (let i = 0; i < 5; i++) {
                const team1Gold = team1[i].gold;
                const team2Gold = team2[i].gold;
                
                const goldDiffPct = (team2Gold / (team1Gold + team2Gold)) * 100;
                const goldDiffPng = `${goldDiffPct.toFixed(0)}.png`;
            
                responseData[`goldDiffPng${i + 1}`] = formData.goldIconPngPath + goldDiffPng;
            }            


            let jsonData = { data : [responseData]} 
            res.send(jsonData)
        } catch (e) {
            console.error('Error processing data:', e);
            res.status(500).send('Error processing data');
        }
        
        
    })
})

app.listen(3000, () => {
  console.log('Server Running on localhost:3000');
});
