let gameSpeed = 1

setInterval(() => {
    const cloud = document.createElement('img')
    cloud.id = 'cloud'
    cloud.src = `media/breadGame/cloud${DeBread.randomNum(0, 5)}.png`
    cloud.style.position = 'absolute'

    cloud.pos = window.innerWidth
    cloud.style.left = `${window.innerWidth}px`
    cloud.style.top = DeBread.randomNum(200, doge('breadGameSky').offsetHeight - 200) + 'px'
    cloud.style.width = '32px'

    cloud.interval = setInterval(() => {
        cloud.pos -= 1 * gameSpeed
        cloud.style.left = `${cloud.pos}px`

        if(cloud.pos < -cloud.offsetWidth) {
            clearInterval(cloud.interval)
            cloud.remove()
        }
        if(!gameActive) {
            clearInterval(cloud.interval)
        }
    }, 10);
    
    doge('breadGameSky').append(cloud);
}, 1000);

const player = {
    grav: 0,
    pos: 0,
    sliding: false,
    alive: true,
    points: 0,
    currentTexture: undefined,
}

function changePlayerTexture(src, size) {
    if(player.currentTexture !== src) {
        if(doge('breadGameBreadTexture'))  {
            doge('breadGameBreadTexture').remove()
        }

        const img = getTexture(src)
        img.id = 'breadGameBreadTexture'
        playerD.append(img)

        player.currentTexture = src

        doge('breadGameBread').style.width = size[0]+'px'
        doge('breadGameBread').style.height = size[1]+'px'
        doge('breadGameBreadTexture').style.width = size[0]+'px'
        doge('breadGameBreadTexture').style.height = size[1]+'px'
    }
} 

const playerD = doge('breadGameBread')
let floorPos = 0
setInterval(() => {
    player.pos += player.grav
    playerD.style.bottom = player.pos + 'px'

    if(player.pos > 250) {
        player.pos = 250
    }

    if(player.pos > 0) {
        player.grav -= 0.4
    } else {
        player.pos = 0
    }
    if(player.pos === 0) {
        DeBread.shake(doge('breadGame'),10,0,player.grav / 5,100)
        player.grav = 0
    }

    if(player.alive) {
        if(player.grav < -4 && player.sliding) {
            changePlayerTexture('media/breadGame/breadSlideFall2.png', [64, 32])
        } else if(player.grav < -2 && player.sliding) {
            changePlayerTexture('media/breadGame/breadSlideFall.png', [64, 32])
        } else if(player.sliding) {
            changePlayerTexture('media/breadGame/breadSlide.png', [64, 32])
        }

        doge('breadGamePoints').innerText = player.points.toString().padStart(8, 0)
        player.points++
    }


    doge('breadGame').querySelectorAll('#obst').forEach(obst => {
        if(isColliding(playerD, obst) && player.alive) {
            player.alive = false
            for(let i = 0; i < 100; i++) {
                setTimeout(() => {
                    gameSpeed /= 1.03
                }, 10 * i);
            }
            setTimeout(() => {
                gameActive = false
                setTimeout(() => {
                    doge('breadGameDeath').style.opacity = 1
                    doge('breadGameDeath').style.pointerEvents = 'unset'
                }, 1000);
            }, 2000);

            player.pos += 10
            player.grav = 4
    
            changePlayerTexture('media/breadGame/breadDead.png', [64, 32])
  
        }
    })

    //floor movement
    if(gameActive) {
        floorPos -= 3.5 * gameSpeed
        doge('breadGameFloor').style.backgroundPosition = `${floorPos}px 0`
        doge('breadGameBG').style.backgroundPosition = `${floorPos / 4}px 0`
    }
}, 10);

document.addEventListener('keydown', ev => {
    if(player.alive) {
        if(ev.key === ' ' && player.pos === 0 && !player.sliding) {
            player.grav = 7
            player.pos = 1
        } 
        if(['s', 'arrowdown'].includes(ev.key.toLowerCase()) && !player.sliding && player.pos < 100) {
            player.sliding = true
            playerD.style.translate = '-50% 0'
            player.pos += 10
            player.grav += 3
    
            changePlayerTexture('media/breadGame/breadSlide.png', [64, 32])
        }
    }
})

document.addEventListener('keyup', ev => {
    if(player.alive) {
        if(['s', 'arrowdown'].includes(ev.key.toLowerCase())) {
            player.sliding = false
            playerD.style.translate = '0 0'
    
            changePlayerTexture('media/breadGame/bread.gif', [32, 64])
        }
    }
})

function createObstacle(speed) {
    const type = DeBread.randomNum(0, 2)
    const obstacle = document.createElement('img')
    obstacle.id = 'obst'
    obstacle.style.position = 'absolute'
    if(type === 2) {
        obstacle.style.bottom = '40px'
        obstacle.src = `media/breadGame/obstacleA${DeBread.randomNum(0, 0)}.png`
    } else {
        obstacle.style.bottom = 0
        obstacle.src = `media/breadGame/obstacleF${DeBread.randomNum(0, 0)}.png`
    }
    obstacle.pos = window.innerWidth
    obstacle.style.width = '40px'

    obstacle.inteval = setInterval(() => {
        if(gameActive) {
            obstacle.style.left = obstacle.pos + 'px'
            obstacle.pos -= speed * gameSpeed
        } else {
            clearInterval(obstacle.inteval)
        }
    }, 10);

    doge('breadGameSky').append(obstacle)

    if(obstacle.pos <= -obstacle.offsetWidth) {
        obstacle.remove()
        clearInterval(obstacle.inteval)
    }
}

let gameActive = false
function start() {
    if(!gameActive) {    
        doge('breadGameOverlay').blur()
    
        doge('breadGame').querySelectorAll('#obst').forEach(obstacle => {
            clearInterval(obstacle.inerval)
            obstacle.remove()
        })

        doge('breadGame').querySelectorAll('#cloud').forEach(cloud => {
            clearInterval(cloud.inerval)
            cloud.remove()
        })
        
        if(!player.alive) {
            player.pos += 10
            player.grav = 4
        }

        player.alive = true
        gameSpeed = 1
        gameActive = true
        player.sliding = false
        player.points = 0

        doge('breadGameBread').style.opacity = 1
        changePlayerTexture('media/breadGame/bread.gif', [32, 64])
    
        doge('breadGameOverlay').style.pointerEvents = 'none'
        doge('breadGameOverlay').style.scale = 0
    
        doge('breadGameDeath').style.pointerEvents = 'none'
        doge('breadGameDeath').style.opacity = 0
    
        doge('breadGame').style.scale = 1.5
        doge('breadGame').style.translate = '200px 0'
    
        DeBread.createInterval('obstacle', () => {createObstacle(3.5)}, 1000)
    }
}

function closeBG() {
    doge('breadGameContainer').style.pointerEvents = 'none'
    doge('breadGameContainer').style.opacity = 0

    doge('breadGameDeath').style.pointerEvents = 'none'
    doge('breadGameDeath').style.opacity = 0

    document.body.style.maxHeight = 'unset'
    document.body.style.overflow = 'unset'
}