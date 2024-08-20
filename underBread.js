const soul = doge('soul')
soul.pos = [0, 0]
const underContainer = doge('underBreadContainer')
const underPlayArea = doge('underPlayArea')
const enemyContainer = doge('underEnemyContainer')

const underPlayer = {
    health: 32,
    maxHealth: 32,
    pos: [0, 0],
    speed: 3,
    dmgMultiplier: 1,
    alive: true,
    deathScreenActive: false,
    lastHitDate: 0,
    movementIntervals: {
        up: undefined,
        left: undefined,
        down: undefined,
        right: undefined,
    }
}

const underEnemy = {
    health: 1000,
    maxHealth: 1000,
    pissedLevel: 0,
    currentDialogue: '* DeBread appears!'
}

let inventory = [
    {
        name: 'Normal Loaf',
        desc: 'Heals for 10HP',
        action: () => {
            damagePlayer(-10)
            actionSequence(exampleAction, '* You healed 10HP!')
        },
    },
    {
        name: 'Loaf',
        desc: 'DEV: Heals for 10HP',
        action: () => {damagePlayer(-10)},
    },
    {
        name: 'Sharpener',
        desc: '+0.1 DMG multiplier',
        action: () => {underPlayer.dmgMultiplier += 0.1},
    },
    {
        name: 'Evil Loaf',
        desc: 'Damage 1HP',
        action: () => {damagePlayer(1)},
    },
    {
        name: 'Super Evil Loaf',
        desc: 'Damage 10HP',
        action: () => {damagePlayer(10)},
    },
    {
        name: 'Piss him off',
        desc: '+1 Pissed Level',
        action: () => {
            if(underEnemy.pissedLevel < 15) {
                underEnemy.pissedLevel++
            }
        },
    },
]

function startFight() {
    //Reset stuff
    underPlayArea.innerHTML = ''
    underPlayArea.style.width = '570px'
    underPlayArea.style.height = '150px'
    selectedButton = 0
    selectButton(selectedButton)
    buttonSelected = false
    attackActive = false
    attackInProgress = false
    innerSelectedButton = 0
    playerControls = false
    damagePlayer(-20, true)
    underEnemy.health = 1000
    underEnemy.currentDialogue = '* DeBread appears!'
    
    doge('funnyThing')?.remove()
    funnyLittleThingActive = false

    moveSoul([mouse[0] - soul.offsetWidth / 2, mouse[1] - soul.offsetWidth / 2])

    for(let i = 0; i < 6; i++) {
        setTimeout(() => {            
            if(i % 2 === 0) {
                soul.style.opacity = 0
                underContainer.style.opacity = 0
                cursor.style.opacity = 1
                realCursor.style.opacity = 1
                underContainer.style.cursor = 'unset'
                doge('underBreadContainer').style.pointerEvents = 'none'

            } else {
                soul.style.opacity = 1
                underContainer.style.opacity = 1
                cursor.style.opacity = 0
                realCursor.style.opacity = 0
                underContainer.style.cursor = 'none'
                doge('underBreadContainer').style.pointerEvents = 'unset'
                DeBread.playSound('media/underBread/sfx/noise.wav', 0.3)
            }

            if(i === 5) {
                DeBread.playSound('media/underBread/sfx/battle.wav', 0.2)
                moveSoul([doge('underButton0').getBoundingClientRect().left + 15, doge('underButton0').getBoundingClientRect().top + doge('underButton0').offsetHeight / 2], true, true)
                setTimeout(() => {
                    doge('underPlayArea').style.opacity = 1
                    doge('underStats').style.opacity = 1
                    doge('underButtons').style.opacity = 1
                    doge('underEnemyContainer').style.opacity = 1
                    doge('underBreadContainer').style.pointerEvents = 'unset'
                    createText('* DeBread appears!')

                    setMusicActivity(0)
                }, 400);
            }
        }, i * 75);
    }
}

function moveSoul(pos, center, ease) {
    let offset = 0
    if(center) {offset = soul.offsetWidth / 2}

    if(!ease) {
        soul.pos[0] = pos[0] - offset
        soul.pos[1] = pos[1] - offset
        updateSoulPos()
    } else {
        for(let i = 0; i < 25; i++) {
            setTimeout(() => {            
                soul.pos[0] -= ((soul.pos[0] - pos[0] + offset) / 25) * i
                soul.pos[1] -= ((soul.pos[1] - pos[1] + offset) / 25) * i
                
                if(i === 24) {
                    soul.pos[0] = pos[0] - offset
                    soul.pos[1] = pos[1] - offset
                }
                
                updateSoulPos()
            }, 25 * i);
        }
    }
}

function updateSoulPos() {
    soul.style.left = soul.pos[0]+'px'
    soul.style.top = soul.pos[1]+'px'

    if(doge('controlSoul')) {
        doge('controlSoul').style.left = underPlayer.pos[0] + 'px'
        doge('controlSoul').style.top = underPlayer.pos[1] + 'px'

        underPlayArea.querySelectorAll('.underAttackObject').forEach(obj => {
            if(isColliding(obj, doge('controlSoul'))) {
                damagePlayer(5)
            }
        })
    }
} setInterval(updateSoulPos, 15)

const buttons = [
    'fight',
    'act',
    'item',
    'mercy'
]

let selectedButton = 0
let innerSelectedButton = 0
let buttonSelected = false
function selectButton(index) {
    for(let i = 0; i < 4; i++) {
        doge(`underButton${i}`).src = `media/underBread/img/${buttons[i]}.png`
    }
    if(index !== undefined) {
        doge(`underButton${index}`).src = `media/underBread/img/${buttons[index]}S.png`
        moveSoul([doge(`underButton${index}`).getBoundingClientRect().left + 16, doge(`underButton${index}`).getBoundingClientRect().top + doge(`underButton${index}`).offsetHeight / 2], true)
    }
    DeBread.playSound('media/underBread/sfx/squeak.wav', 0.25)
}

document.addEventListener('keydown', ev => {
    if(ev.key === 'ArrowLeft') {
        if(!playerControls) {
            if(!buttonSelected) {
                if(selectedButton === 0) {
                    selectedButton = 3
                } else {
                    selectedButton--
                }
                selectButton(selectedButton)
            } else {
                if(doge(`playAreaButton${innerSelectedButton - 1}`)) {
                    innerSelectedButton--
                    updateInfoText(doge(`playAreaButton${innerSelectedButton}`).desc)
                    DeBread.playSound('media/underBread/sfx/squeak.wav', 0.25)
                    moveSoul([doge(`playAreaButton${innerSelectedButton}`).getBoundingClientRect().left + 7, doge(`playAreaButton${innerSelectedButton}`).getBoundingClientRect().top + doge(`playAreaButton${innerSelectedButton}`).offsetHeight / 2], true)
                    
                }
            }
        } else {
            if(underPlayer.movementIntervals.left === undefined) {
                underPlayer.movementIntervals.left = setInterval(() => {
                    if(underPlayer.pos[0] > 0) {
                        underPlayer.pos[0] -= underPlayer.speed
                    } else {
                        underPlayer.pos[0] = 0
                    }
                    updateSoulPos()
                }, 15);
            }
        }
    }

    if(ev.key === 'ArrowRight') {
        if(!playerControls) {
            if(!buttonSelected) {
                if(selectedButton === 3) {
                    selectedButton = 0
                } else {
                    selectedButton++
                }
                selectButton(selectedButton)
    
            } else {
                if(doge(`playAreaButton${innerSelectedButton + 1}`)) {
                    innerSelectedButton++
                    updateInfoText(doge(`playAreaButton${innerSelectedButton}`).desc)
                    DeBread.playSound('media/underBread/sfx/squeak.wav', 0.25)
                    moveSoul([doge(`playAreaButton${innerSelectedButton}`).getBoundingClientRect().left + 7, doge(`playAreaButton${innerSelectedButton}`).getBoundingClientRect().top + doge(`playAreaButton${innerSelectedButton}`).offsetHeight / 2], true)
                }
            }
        } else {
            if(underPlayer.movementIntervals.right === undefined) {
                underPlayer.movementIntervals.right = setInterval(() => {
                    if(underPlayer.pos[0] < underPlayArea.offsetWidth - doge('controlSoul').offsetWidth) {
                        underPlayer.pos[0] += underPlayer.speed
                    } else {
                        underPlayer.pos[0] = underPlayArea.offsetWidth - doge('controlSoul').offsetWidth
                    }
                    updateSoulPos()
                }, 15);
            }
        }
    }

    if(ev.key === 'ArrowDown') {
        if(!playerControls) {
            if(buttonSelected) {
                if(doge(`playAreaButton${innerSelectedButton + 2}`)) {
                    innerSelectedButton += 2
                    updateInfoText(doge(`playAreaButton${innerSelectedButton}`).desc)
                    DeBread.playSound('media/underBread/sfx/squeak.wav', 0.25)
                    moveSoul([doge(`playAreaButton${innerSelectedButton}`).getBoundingClientRect().left + 7, doge(`playAreaButton${innerSelectedButton}`).getBoundingClientRect().top + doge(`playAreaButton${innerSelectedButton}`).offsetHeight / 2], true)
                }
            }
        } else {
            if(underPlayer.movementIntervals.down === undefined) {
                underPlayer.movementIntervals.down = setInterval(() => {
                    if(underPlayer.pos[1] < underPlayArea.offsetHeight - doge('controlSoul').offsetHeight) {
                        underPlayer.pos[1] += underPlayer.speed
                    } else {
                        underPlayer.pos[1] = underPlayArea.offsetHeight - doge('controlSoul').offsetHeight
                    }
                    updateSoulPos()
                }, 15);
            }
        }
    }

    if(ev.key === 'ArrowUp') {
        if(!playerControls) {
            if(buttonSelected) {
                if(doge(`playAreaButton${innerSelectedButton - 2}`)) {
                    innerSelectedButton -= 2
                    updateInfoText(doge(`playAreaButton${innerSelectedButton}`).desc)
                    DeBread.playSound('media/underBread/sfx/squeak.wav', 0.25)
                    moveSoul([doge(`playAreaButton${innerSelectedButton}`).getBoundingClientRect().left + 7, doge(`playAreaButton${innerSelectedButton}`).getBoundingClientRect().top + doge(`playAreaButton${innerSelectedButton}`).offsetHeight / 2], true)
                }
            }
        } else {
            if(underPlayer.movementIntervals.up === undefined) {
                underPlayer.movementIntervals.up = setInterval(() => {
                    if(underPlayer.pos[1] > 0) {
                        underPlayer.pos[1] -= underPlayer.speed
                    } else {
                        underPlayer.pos[1] = 0
                    }
                    updateSoulPos()
                }, 15);
            }
        }
    }

    if(ev.key.toLowerCase() === 'z') {
        if(!underPlayer.deathScreenActive) {
            if(!playerControls) {
                if(!attackActive) {
                    DeBread.playSound('media/underBread/sfx/select.wav', 0.25)
                    if(!buttonSelected) {
                        if(selectedButton === 0) {
                            createButtons(
                                [
                                    [['* DeBread', () => {startAttack()}]],
                                ]
                            )
                        }
                        if(selectedButton === 1) {
                            createButtons(
                                [
                                    [['* Check', () => {createText(`DeBread \n ${underEnemy.health}HP \n ${underEnemy.pissedLevel} Pissed LVL`)}], ['* Mention ULTRAKILL', () => {createSpeechBubble('That\'s actually my favorite game! Recently I\'ve been trying to beat P-2 (The hardest level in the game so far) on the hardest difficulty, BRUTAL. It\'s been a real struggle but I\'m getting there.'); actionSequence(exampleAction)}]],
                                    [['* Insult Annie', () => {createSpeechBubble('The fuck did you just say?'); underEnemy.currentDialogue = '* DeBread is noticeably pissed.'; actionSequence(dogCannonAction, '* You shouldn\'t\'ve done that...')}], ['* Winnie', () => {actionSequence(winnieAction)}]],
                                    [['* Goober', () => {actionSequence(gooberAction)}]]
                                ]
                            )
                        }
                        if(selectedButton === 2) {
                            let buttons = [[],[],[]]
                            let i = 0
                            for(const item in inventory) {
                                buttons[Math.floor(i / 2)].push([inventory[item].name, inventory[item].action, inventory[item].desc])
                                i++
                            }
                            createButtons(buttons)
                        }
                        if(selectedButton === 3) {
                            createButtons(
                                [
                                    [['* Spare', () => {
                                        actionSequence(exampleAction)
                                        createSpeechBubble('That\'s not gonna work lmao')
                                    }], ['* Flee', () => {
                                        underContainer.style.opacity = 0
                                        soul.style.opacity = 0
                                        cursor.style.opacity = 1
                                        underContainer.style.pointerEvents = 'none'
                                    }, 'Leave the fight.']],
                                ]
                            )
                        }
                    } else {
                        doge(`playAreaButton${innerSelectedButton}`)?.action()
                    }
                } else {
                    if(!attackInProgress) {
                        clearInterval(attackMoveInterval)
                        attackInProgress = true
                        let damage = 0
                        let damageMultiplier = 1
                        
                        if(doge('underAttackBar').pos === 380 + doge('underAttackBar').offset) {
                            damageMultiplier = 1.25
                            doge('underAttackBar').style.animation = 'goodAttack 500ms ease-out 1 forwards'
                            DeBread.playSound('media/underBread/sfx/bell.wav', 0.25)
                        }
    
                        let attackBarAnimInterval = setInterval(() => {
                            doge('underAttackBar').style.backgroundColor = 'black'
                            doge('underAttackBar').style.outline = 'inset 0px 0px 0px 2px white'
                            setTimeout(() => {
                                doge('underAttackBar').style.backgroundColor = 'white'
                                doge('underAttackBar').style.outline = 'inset 0px 0px 0px 2px black'
                            }, 50);
                        }, 100);
            
                        setTimeout(() => {
                            clearInterval(attackBarAnimInterval)
                            DeBread.playSound('media/underBRead/sfx/damage.wav', 0.2)
                            DeBread.shake(enemyContainer, 50, 25, 0, 500)
                            damage = Math.abs(750 - ((750 / 2) - doge('underAttackBar').pos)) / 10
                            damage *= damageMultiplier
                            damageEnemy(damage + DeBread.randomNum(-5, 5))
            
                            setTimeout(() => {                                
                                underPlayArea.innerHTML = ''
                                underPlayArea.style.width = '570px'
                                setTimeout(() => {
                                    attackInProgress = false
                                    buttonSelected = false
                                    attackActive = false
                                    innerSelectedButton = undefined
                                    actionSequence(gooberAction)
                                    setTimeout(() => {
                                        attackInProgress = false
                                    }, 250);
                                }, 100);
                            }, 2000);
                        }, 1000);
            
                        DeBread.playSound('media/underBRead/sfx/swing.wav', 0.2)
                    }
                }
            }
        } else {
            underContainer.style.filter = 'brightness(1)'
            doge('soul').src = 'media/underBread/img/soul.png'
            soul.style.opacity = 1
            underPlayer.alive = true
            underPlayer.deathScreenActive = false

            doge('underBreadGameOver').style.animation = 'none'
            deathMusic.pause()
            deathMusic.currentTime = 0

            startFight()
        }

        selectButton(undefined)
        buttonSelected = true
        updateInfoText(doge(`playAreaButton${innerSelectedButton}`).desc)
    }

    if(ev.key === 'x') {
        if(!underPlayer.deathScreenActive && underPlayer.alive) {
            if(!playerControls) {
                if(!attackActive) {
                    createText(underEnemy.currentDialogue)
                    buttonSelected = false
                    innerSelectedButton = undefined
                    selectButton(selectedButton)
                    doge('underInfo').innerText = ''
                }
            }
        } else {
            underContainer.style.display = 'none'
        }
    }
})

document.addEventListener('keyup', ev => {
    if(ev.key === 'ArrowLeft') {
        clearInterval(underPlayer.movementIntervals.left)
        underPlayer.movementIntervals.left = undefined
    }
    if(ev.key === 'ArrowRight') {
        clearInterval(underPlayer.movementIntervals.right)
        underPlayer.movementIntervals.right = undefined
    }
    if(ev.key === 'ArrowUp') {
        clearInterval(underPlayer.movementIntervals.up)
        underPlayer.movementIntervals.up = undefined
    }
    if(ev.key === 'ArrowDown') {
        clearInterval(underPlayer.movementIntervals.down)
        underPlayer.movementIntervals.down = undefined
    }
})

let exampleButtonArray = [
    [['testButton', () => {console.log('wow!')}], ['anotherTestButton', () => {}]],
    [['testButton', () => {console.log('wow!')}], ['anotherTestButton', () => {}]],
]

function createButtons(array) {
    underPlayArea.innerHTML = ''
    let i = 0
    for(const column in array) {
        const columnDiv = document.createElement('div')
        columnDiv.style.display = 'flex'
        columnDiv.style.justifyContent = 'space-between'
        for(const row in array[column]) {
            const rowDiv = document.createElement('div')
            rowDiv.action = array[column][row][1]
            if(array[column][row][2]) {
                rowDiv.desc = array[column][row][2]
            } else {
                rowDiv.desc = ''
            }
            rowDiv.innerText = array[column][row][0]
            rowDiv.style.whiteSpace = 'nowrap'
            rowDiv.style.paddingLeft = '25px'
            rowDiv.setAttribute('id', `playAreaButton${i}`)
            columnDiv.append(rowDiv)

            i++
        }
        underPlayArea.append(columnDiv)
    }

    moveSoul([doge('playAreaButton0').getBoundingClientRect().left + 7, doge('playAreaButton0').getBoundingClientRect().top + doge('playAreaButton0').offsetHeight / 2], true)
    innerSelectedButton = 0
}

function createText(text) {
    underPlayArea.innerHTML = ''
    const span = document.createElement('span')
    for(let i = 0; i < text.length; i++) {
        setTimeout(() => {
            if(text[i] === ' ') {
                span.innerHTML += '&nbsp'
            } else {
                span.innerText += text[i]
            }

            if(i % 33 === 0 && i !== 0) {
                span.innerText += '\n'
            }

            if(i % 2 === 0) {
                DeBread.playSound('media/underBread/sfx/text.wav', 0.1)
            }
        }, 25 * i);
    }
    underPlayArea.append(span)
}

function updateInfoText(text) {
    if(text) {
        doge('underInfo').innerText = text
    }
}

let deathMusic
function damagePlayer(amount, silent) {
    if(underPlayer.alive && performance.now() - underPlayer.lastHitDate > 500 || amount < 0) {
        underPlayer.lastHitDate = performance.now()

        underPlayer.health -= amount
    
        if(!silent) {
            if(amount > 0) {
                if(underPlayer.health !== 0) {
                    DeBread.playSound('media/underBread/sfx/hurt.wav', 0.2)
                }
            } else {
                DeBread.playSound('media/underBread/sfx/heal.wav', 0.2)
            }
        }
    
        if(underPlayer.health < 0) {
            underPlayer.health = 0
    
        }
        
        if(underPlayer.health > underPlayer.maxHealth) {
            underPlayer.health = underPlayer.maxHealth
        }
        
        if(underPlayer.health === 0) {
            soul.src = 'media/underBread/img/soulHurt.png'
            soul.style.opacity = 1
            underPlayer.alive = false
            if(doge('controlSoul')) {
                moveSoul([doge('controlSoul').getBoundingClientRect().left, doge('controlSoul').getBoundingClientRect().top], false, false)
            }
            underContainer.style.filter = 'brightness(0)'
            DeBread.playSound('media/underBread/sfx/break1.wav', 0.2)
            setTimeout(() => {
                DeBread.playSound('media/underBread/sfx/break2.wav', 0.2)
                soul.style.opacity = 0
                DeBread.createParticles(
                    document.body,
                    25,
                    0,
                    2500,
                    'ease-out',
                    [[soul.getBoundingClientRect().left + soul.offsetWidth / 2, soul.getBoundingClientRect().left + soul.offsetWidth / 2], [soul.getBoundingClientRect().top + soul.offsetHeight / 2, soul.getBoundingClientRect().top + soul.offsetHeight / 2]],
                    [[[4, 4], [4, 4]], [[0, 0], [0, 0]]],
                    [[0, 0], [0, 0]],
                    [[-250, 250], [-250, 250]],
                    [[255, 0, 0], [255, 0, 0]],
                    [[255, 0, 0], [255, 0, 0]],
                )
                setTimeout(() => {
                    deathMusic = new Audio('media/underBread/sfx/death.mp3')
                    deathMusic.volume = 0.05
                    deathMusic.play()
                    doge('underBreadGameOver').style.animation = 'fadeIn 3s linear 1 forwards'
                    underPlayer.deathScreenActive = true
                }, 2000);
            }, 1500);
        }
    
        doge('underHP').innerText = `${DeBread.round(underPlayer.health)} / ${underPlayer.maxHealth}`
        doge('underInnerHealthBar').style.width = `${underPlayer.health / underPlayer.maxHealth * 100}%`
    }
}

let funnyLittleThingActive = false
function damageEnemy(base) {
    amount = base * underPlayer.dmgMultiplier
    const enemyHealth = underEnemy.health

    let damageNumberText = 0
    let damageNumberCol = 'red'
    if(enemyHealth - amount < 0) {
        damageNumberText = DeBread.round(enemyHealth)
        underEnemy.health = 0
    } else if(amount === 0) {
        damageNumberText = 'MISS'
        damageNumberCol = 'grey'
    } else {
        damageNumberText = DeBread.round(amount)
        underEnemy.health -= amount
    }

    const damageNumber = document.createElement('span')
    damageNumber.classList.add('underDamageNumber')
    underContainer.append(damageNumber)
    damageNumber.innerText = damageNumberText
    damageNumber.style.color = damageNumberCol
    damageNumber.style.left = enemyContainer.getBoundingClientRect().left + enemyContainer.offsetWidth / 2 - damageNumber.offsetWidth / 2 + 'px'
    damageNumber.style.top = enemyContainer.getBoundingClientRect().top + enemyContainer.offsetHeight / 2 - damageNumber.offsetHeight / 2 + 'px'
    damageNumber.style.opacity = 1
    
    doge('underInnerEnemyBar').style.width =  underEnemy.health / underEnemy.maxHealth * 100 + '%'
    doge('underEnemyBarContainer').style.opacity = 1

    setTimeout(() => {
        damageNumber.remove()
        doge('underEnemyBarContainer').style.opacity = 0
    }, 2000);

    if(underEnemy.health <= 500 && !funnyLittleThingActive) {
        const funnyThing = document.createElement('div')
        funnyThing.setAttribute('id', 'funnyThing')
        funnyThing.style.position = 'absolute'
        funnyThing.style.left = doge('underButton0').getBoundingClientRect().left + 'px'
        funnyThing.style.top = doge('underButton0').getBoundingClientRect().top + 'px'
        funnyThing.style.width = '10px'
        funnyThing.style.height = doge('underButton0').offsetHeight + 'px'
        funnyThing.style.backgroundColor = 'white'
        underContainer.append(funnyThing)
        
        funnyLittleThingActive = true

        let offsetX = 0
        let dir = 1
        setInterval(() => {
            if(offsetX === 0) {
                dir = 2
            } else if(offsetX === doge('underButton0').offsetWidth - 10) {
                dir = -2
            }
            offsetX += dir

            funnyThing.style.left = doge('underButton0').getBoundingClientRect().left + offsetX + 'px'
            funnyThing.style.top = doge('underButton0').getBoundingClientRect().top + 'px'
            
            if(isColliding(funnyThing, soul)) {
                damagePlayer(1)
            }
        }, 15);
    }
}

let attackActive = false
let attackInProgress = false
let attackMoveInterval
function startAttack() {
    underPlayArea.style.width = '750px'
    underPlayArea.innerHTML = ''
    soul.style.opacity = 0
    setTimeout(() => {        
        const img = document.createElement('img')
        img.src = 'media/underBread/img/attack.png'
        img.style.transition = 'translate ease-in-out 250ms'
        img.width = 750
        underPlayArea.append(img)

        let offset = 0
        if(underPlayer.health < 0) {
            offset = DeBread.randomNum(-250, 250, -1)
        }

        setTimeout(() => {
            img.style.translate = `${offset}px 0px`
        }, 250);

        setTimeout(() => {            
            attackActive = true
            const attackBar = document.createElement('div')
            attackBar.setAttribute('id', 'underAttackBar')
            underPlayArea.append(attackBar)

    
            let attackPos = 0
            attackMoveInterval = setInterval(() => {
                attackPos += 10
                attackBar.style.left = attackPos + 'px'
                attackBar.pos = attackPos
                attackBar.offset = offset
    
                if(attackPos > 750) {
                    clearInterval(attackMoveInterval)
                    attackInProgress = true
    
                    const damageNumber = document.createElement('span')
                    damageNumber.classList.add('underDamageNumber')
                    underContainer.append(damageNumber)
                    damageNumber.innerText = 'MISS'
                    damageNumber.style.color = 'grey'
                    damageNumber.style.left = enemyContainer.getBoundingClientRect().left + enemyContainer.offsetWidth / 2 - damageNumber.offsetWidth / 2 + 'px'
                    damageNumber.style.top = enemyContainer.getBoundingClientRect().top + enemyContainer.offsetHeight / 2 - damageNumber.offsetHeight / 2 + 'px'
                    damageNumber.style.opacity = 1
    
                    setTimeout(() => {
                        attackInProgress = false
                        damageNumber.remove()
    
                        underPlayArea.innerHTML = ''
                        underPlayArea.style.width = '570px'
                        setTimeout(() => {
                            createText(underEnemy.currentDialogue)
                            buttonSelected = false
                            innerSelectedButton = undefined
                            attackActive = false
                            setTimeout(() => {
                                attackInProgress = false
                            }, 250);
                        }, 100);
                    }, 2000);
                }
            }, 10);
        }, 500);
    }, 100);
}

function createSpeechBubble(text) {
    const bubble = document.createElement('div')
    bubble.classList.add('underSpeechBubble')
    bubble.style.left = enemyContainer.getBoundingClientRect().right + 10 + 'px'
    bubble.style.top = enemyContainer.getBoundingClientRect().top + 'px'
    bubble.innerText = text
    underContainer.append(bubble)

    setTimeout(() => {
        bubble.remove()
    }, 2500);
}

const exampleAction = {
    width: 300,
    height: 300,
    length: 5000,
    stuff: () => {
        const objs = [
            {
                pos: [0, 0],
                dim: [300, 50]   
            },
            {
                pos: [0, 0],
                dim: [50, 300]   
            },
            {
                pos: [0, 250],
                dim: [300, 50]    
            },
            {
                pos: [250, 0],
                dim: [50, 300]   
            },
            {
                pos: [125, 0],
                dim: [50, 300]   
            },
            {
                pos: [0, 125],
                dim: [300, 50]    
            },
        ]

        for(const index in objs) {
            setTimeout(() => {                
                const square = document.createElement('div')
                square.classList.add('underAttackObject')
                square.style.width = objs[index].dim[0]+'px'
                square.style.height = objs[index].dim[1]+'px'
                square.style.left = objs[index].pos[0]+'px'
                square.style.top = objs[index].pos[1]+'px'
                square.style.opacity = 0.5
        
                underPlayArea.append(square)

                setTimeout(() => {
                    square.style.opacity = 1
                    square.style.animation = 'pulse 500ms ease-out 1 forwards'
                    updateSoulPos()
                }, 1000);
                setTimeout(() => {
                    square.remove()
                }, 5000);
            }, 250 * index);
        }
    }
}

const gooberAction = {
    width: 500,
    height: 250,
    length: 7500,
    stuff: () => {
        underPlayArea.style.overflow = 'hidden'
        const goober = document.createElement('img')
        const randomGooberIndex = DeBread.randomNum(0, 3)
        // const randomGooberIndex = 1
        goober.src = `media/underBread/img/goober${randomGooberIndex}.png`
        goober.style.position = 'absolute'
        let gooberPos = [550, 109]
        goober.style.left = gooberPos[0]+'px'
        goober.style.top = gooberPos[1]+'px'

        underPlayArea.append(goober)

        const gun = document.createElement('img')
        if(randomGooberIndex !== 1) {
            gun.src = `media/underBread/img/gun.png`
        } else {
            gun.src = 'media/underBread/img/wandMaybe.png'
        }
        gun.style.position = 'absolute'
        let gunPos = [530, 120]
        gun.style.left = gunPos[0]+'px'
        gun.style.top = gunPos[1]+'px'
        underPlayArea.append(gun)

        for(let i = 0; i < 50; i++) {
            setTimeout(() => {
                gooberPos[0] -= 2.8 - (i / 25)
                goober.style.left = gooberPos[0]+'px'

                gunPos[0] -= 2.8 - (i / 25)
                gun.style.left = gunPos[0]+'px'
            }, 15 * i);
        }

        let gunAimInterval
        let gunShootInterval
        setTimeout(() => {
            gunAimInterval = setInterval(() => {
                const dx = (underPlayer.pos[0] - gunPos[0])
                const dy = (underPlayer.pos[1] - gunPos[1])
                gun.style.rotate = Math.atan2(dy, dx) * 180.0 / Math.PI + 180 + 'deg'             
            },15);

            gunShootInterval = setInterval(() => {
                const bullet = document.createElement('div')
                bullet.classList.add('underAttackObject')
                bullet.style.left = gunPos[0] + 'px'
                bullet.style.top = gunPos[1] + 'px'
                bullet.style.width = '5px'
                bullet.style.height = '5px'
                bullet.scale = 1
                bullet.pos = [gunPos[0], gunPos[1]]
                underPlayArea.append(bullet)

                if(randomGooberIndex === 1) {
                    bullet.style.backgroundColor = 'transparent'
                    bullet.style.backgroundImage = 'url(media/underBread/img/swirl.gif)'
                }

                bullet.angle = Math.atan2(underPlayer.pos[1] - bullet.pos[1], underPlayer.pos[0] - bullet.pos[0])
                bullet.interval = setInterval(() => {
                    bullet.pos[0] += 5 * Math.cos(bullet.angle)
                    bullet.pos[1] += 5 * Math.sin(bullet.angle)

                    bullet.style.left = bullet.pos[0] + 'px'
                    bullet.style.top = bullet.pos[1] + 'px'

                    bullet.scale += 0.1
                    bullet.style.scale = bullet.scale

                    updateSoulPos()
                }, 15)

                setTimeout(() => {
                    bullet.remove()
                    clearInterval(bullet.interval)
                }, 2000);
            }, 300);

        }, 750);
        setTimeout(() => {
            clearInterval(gunShootInterval)
            clearInterval(gunAimInterval)
        }, 7500);
    },
}

const winnieAction = {
    width: 750,
    height: 100,
    length: 10000,

    stuff: () => {
        underPlayArea.style.overflow = 'hidden'

        const square = document.createElement('div')
        square.classList.add('underAttackObject')
        square.style.width = '750px'
        square.style.height = '10px'
        square.style.left = '0px'
        square.style.top = '90px'
        square.style.opacity = 0.5

        underPlayArea.append(square)

        setTimeout(() => {
            square.style.opacity = 1
            square.style.animation = 'pulse 500ms ease-out 1 forwards'
            updateSoulPos()
        }, 1000);
        setTimeout(() => {
            square.remove()
        }, 10000);

        const winnie = document.createElement('img')
        winnie.style.width = '50px'
        winnie.style.height = '25px'
        winnie.classList.add('underAttackObject')
        winnie.pos = [750, 75]
        winnie.vel = [0, 0]

        underPlayArea.append(winnie)

        let winnieInterval = setInterval(() => {
            if(underPlayer.pos[0] < winnie.pos[0] && winnie.vel[0] > -7.5) {
                winnie.vel[0] -= 0.1
            } else if(winnie.vel[0] < 7.5) {
                winnie.vel[0] += 0.1
            }


            if(winnie.pos[1] < 75) {
                winnie.vel[1] += 0.75
            } else {
                winnie.vel[1] = 0
                winnie.pos[1] = 75
            }

            if(Math.abs(winnie.pos[0] - underPlayer.pos[0]) < 100 && winnie.pos[1] === 75) {
                winnie.vel[1] = DeBread.randomNum((-Math.abs(winnie.pos[1] - underPlayer.pos[1]) / 6) - 5, (-Math.abs(winnie.pos[1] - underPlayer.pos[1]) / 6) + 5)
            }


            winnie.pos[0] += winnie.vel[0]
            winnie.pos[1] += winnie.vel[1]

            winnie.style.left = winnie.pos[0]+'px'
            winnie.style.top = winnie.pos[1]+'px'
        }, 15);

        setTimeout(() => {
            clearInterval(winnieInterval)
        }, 10000);
    }
}

const dogCannonAction = {
    width: 200,
    height: 200,
    length: 7500,
    stuff: () => {
        underPlayArea.style.overflow = 'unset'

        for(let i = 0; i < 14 + underEnemy.pissedLevel; i++) {
            setTimeout(() => {
                if(underPlayer.alive) {
                    const dog = document.createElement('img')
                    dog.style.position = 'absolute'
                    const randomDogIndex = DeBread.randomNum(0, 0)
                    dog.src = `media/underBread/img/dog${randomDogIndex}-0.png`
                    underPlayArea.append(dog)
                    DeBread.playSound('media/underBread/sfx/dogIn.wav', 0.05)
    
                    const randomDir = DeBread.randomNum(0, 1)
    
                    if(randomDir === 0) {
                        dog.pos = [
                            -dog.offsetWidth, 
                            underPlayer.pos[1] - dog.offsetHeight / 2
                        ]
                        dog.style.left = dog.pos[0] + 'px'
                        dog.style.top = dog.pos[1] + 'px'
                        dog.style.animation = 'dogLeft 500ms ease-out 1 forwards'
                    } else {
                        dog.pos = [
                            -50 - dog.offsetHeight, 
                            underPlayer.pos[0] - dog.offsetHeight - soul.offsetWidth
                        ]
                        dog.style.top = dog.pos[0] + 'px'
                        dog.style.left = dog.pos[1] + 'px'
                        dog.style.rotate = '90deg'
                        dog.style.animation = 'dogTop 500ms ease-out 1 forwards'
                    }
    
                    setTimeout(() => {
                        dog.src = `media/underBread/img/dog${randomDogIndex}-1.png`
                        DeBread.shake(underPlayArea, 10, 2, 2, 250)
                        DeBread.shake(dog, 10, 5, 5, 250)
    
                        const obj = document.createElement('div')
                        obj.classList.add('underAttackObject')
                        if(randomDir === 0) {
                            obj.style.left = dog.pos[0] + dog.offsetWidth+'px'
                            obj.style.top = dog.pos[1]+'px'
                            obj.style.height = dog.offsetHeight + 'px'
                            obj.style.width = '250px'
                            obj.style.animation = 'dogBeamX 250ms ease-in 1 forwards'
                        } else {
                            obj.style.top = dog.pos[0] + dog.offsetWidth / 2 + 10 +'px'
                            obj.style.left = dog.pos[1] + dog.offsetHeight +'px'
                            obj.style.height = '250px'
                            obj.style.width = dog.offsetHeight + 'px'
                            obj.style.animation = 'dogBeamY 250ms ease-in 1 forwards'
    
                        }
                        underPlayArea.append(obj)
                        DeBread.playSound('media/underBread/sfx/dogShoot0.wav', 0.05)
                        DeBread.playSound('media/underBread/sfx/dogShoot1.wav', 0.05)
                        setTimeout(() => {
                            obj.remove()
                        }, 250);
                    }, 750);
                    
                    setTimeout(() => {
                        if(randomDir === 0) {
                            dog.style.animation = 'dogLeftOut 250ms ease-in 1 forwards'
                        } else {
                            dog.style.animation = 'dogTopOut 250ms ease-in 1 forwards'
                        }
                        setTimeout(() => {
                            dog.remove()
                        }, 250);
                    }, 1000);
                }
            }, (500 - (underEnemy.pissedLevel * 25)) * i);
        }
    }
}

let playerControls = false
function actionSequence(action, pretext) {
    let delay = 0
    if(pretext) {
        createText(pretext)
        delay = 2500
    }
    setTimeout(() => {        
        underPlayArea.innerHTML = '<img src="media/underbread/img/soul.png" id="controlSoul">'
        underPlayArea.style.width = action.width - 20 + 'px'
        underPlayArea.style.height = action.height - 20 + 'px'
        playerControls = true
        selectButton(undefined)
    
        setTimeout(() => {
            underPlayer.pos[0] = underPlayArea.offsetWidth / 2 - doge('controlSoul').offsetWidth / 2
            underPlayer.pos[1] = underPlayArea.offsetHeight / 2 - doge('controlSoul').offsetHeight / 2
            updateSoulPos()
    
            action.stuff()
    
            setTimeout(() => {
                if(underPlayer.alive) {
                    underPlayArea.innerHTML = ''
                    underPlayArea.style.width = '570px'
                    underPlayArea.style.height = '150px'
                    setTimeout(() => {
                        createText(underEnemy.currentDialogue)
                        selectButton(selectedButton)
                        playerControls = false
                        buttonSelected = false
                        soul.style.opacity = 1
                        setMusicActivity(0)
                    }, 100);
                }
            }, action.length);
        }, 100);

        setMusicActivity(1)
    }, delay);
}

//Music stuff

let currentProgress

const activeMusic = new Audio('media/underBread/sfx/musicActive.mp3')
const calmMusic = new Audio('media/underBread/sfx/musicCalm.mp3')
activeMusic.volume = 0.025
activeMusic.loop = true
calmMusic.volume = 0.025
calmMusic.loop = true

let currentMusicType = 0
function setMusicActivity(type) {
    // if(type === 0) {
    //     calmMusic.currentTime = activeMusic.currentTime
    //     calmMusic.play()
    //     for(let i = 0; i < 10; i++) {
    //         calmMusic.volume += 0.0025
    //     }
    //     for(let i = 0; i < 10; i++) {
    //         activeMusic.volume -= 0.0025
    //     }
    // } else {
    //     activeMusic.currentTime = calmMusic.currentTime
    //     activeMusic.play()
    //     for(let i = 0; i < 10; i++) {
    //         activeMusic.volume += 0.0025
    //     }
    //     for(let i = 0; i < 10; i++) {
    //         calmMusic.volume -= 0.0025
    //     }
    // }

    // currentMusicType = 0
}