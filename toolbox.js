let screwsClicked = 0
document.querySelectorAll('.screw').forEach(screw => {
    screw.onclick = () => {
        screw.style.pointerEvents = 'none'
        screw.style.opacity = 0

        screwsClicked++
        if(screwsClicked === 4) {
            doge('toolboxBox').style.backgroundImage = 'url(media/tools/metalThing-open.png)'
            setTimeout(() => {                
                doge('toolboxBox').onclick = () => {
                    doge('toolboxBox').style.backgroundImage = 'url(media/tools/metalThing-empty.png)'
                    doge('toolboxContainer').style.display = 'flex'
                }
            }, 100);
        }
    }
})

let selectedTool = undefined

function changeTool(tool) {
    selectedTool = tool
    cursor.style.backgroundImage = `url(media/tools/${tool}.png)`

    if(selectedTool) {
        cursor.style.width = '32px'
        cursor.style.height = '32px'
        cursor.style.borderRadius = '0px'
        cursor.style.backdropFilter = 'none'
    }
}
// changeTool('magnet')

document.querySelectorAll('.chunk, .contentBox').forEach(chunk => {
    chunk.addEventListener('click', () => {
        if(selectedTool === 'magnet') {
            console.log(chunk.offsetHeight)
            const clone = chunk.cloneNode(true)

            const padding = getComputedStyle(chunk).getPropertyValue('padding')

            clone.grav = 0
            clone.pos = [chunk.getBoundingClientRect().left, chunk.getBoundingClientRect().top]
            clone.style.width = chunk.offsetWidth + 'px'
            clone.style.height = chunk.offsetHeight + 'px'
            clone.style.left = clone.pos[0] + 'px'
            clone.style.top = clone.pos[1] + 'px'
            clone.style.position = 'absolute'

            document.body.append(clone)

            chunk.style.opacity = 0
            chunk.style.pointerEvents = 'none'

            const movementInterval = setInterval(() => {
                if(clone.pos[1] < window.innerHeight - clone.offsetHeight) {
                    clone.grav++
                    clone.pos[1] += clone.grav
                } else {
                    clone.pos[1] = window.innerHeight - clone.offsetHeight - 2
                    clearInterval(movementInterval)
                }
                clone.style.left = clone.pos[0] + 'px'
                clone.style.top = clone.pos[1] + 'px'    
            }, 10);
        }
    })

    chunk.addEventListener('mouseenter', () => {
        if(selectedTool === 'magnet') {
            cursor.style.backgroundImage = 'url(media/tools/magnetActive.png)'
        }
    })

    chunk.addEventListener('mouseleave', () => {
        if(selectedTool === 'magnet') {
            cursor.style.backgroundImage = 'url(media/tools/magnet.png)'
        }
    })
})