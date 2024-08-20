const titleText = 'DeBread\'s Space'
let i = 0
for(const char in titleText) {
    const div = document.createElement('div')
    div.innerText = titleText[char]
    div.style.animation = `titleChar 3s ease-in-out -${i * 100}ms infinite forwards`
    if(titleText[char] === ' ') div.style.width = '10px'
    doge('titleTextContainer').append(div)

    i++
}

const art = {
    goober: [
        {
            url: 'checkThisOut.png',
            date: 'April 28th, 2024'
        },
        {
            url: 'Nyan.png',
            date: 'May 16th, 2024'
        },
        {
            url: 'AntiAliasing.png',
            date: 'June 21st, 2024'
        }
    ],
    misc: [
        {
            url: 'Floaty.png',
            date: 'June 18th, 2024'
        }
    ],
    pixel: [
        {
            url: 'desert.png',
            date: 'March 16th, 2024'
        },
        {
            url: 'donut.png',
            date: 'March 16th, 2024'
        },
        {
            url: 'guy.png',
            date: 'March 15th, 2024'
        },
        {
            url: 'helloBro.png',
            date: 'March 16th, 2024'
        },
        {
            url: 'Tree.png',
            date: 'March 15th, 2024'
        }
    ],
    vector: [
        {
            url: 'BlackHole.png',
            date: 'August 19th, 2023'
        },
        {
            url: 'butter.png',
            date: 'December 20th, 2022'
        },
        {
            url: 'GDIcon.png',
            date: 'December 1st, 2022'
        },
        {
            url: 'ruinseekerballing.png',
            date: 'March 17th, 2024'
        },
        {
            url: 'Tower.png',
            date: 'February 7th, 2023'
        },
        {
            url: 'Tower2.png',
            date: 'March 3rd, 2023'
        },
        {
            url: 'Tower3.png',
            date: 'August 10th, 2023'
        },
        {
            url: 'Triangles.png',
            date: 'August 19th, 2023'
        }
    ],
}

const artTitles = {
    goober: 'Goober Art',
    notebook: 'Notebook Doodles',
    misc: 'Misc Art',
    pixel: 'Pixel Art',
    vector: 'Vector Art',
}

const textures = [
    'guy.png',
    'breadGame/bg.png',
    'breadGame/bread.gif',
    'breadGame/breadDead.png',
    'breadGame/breadSlide.png',
    'breadGame/breadSlideFall.png',
    'breadGame/breadSlideFall2.png',
    'breadGame/cloud0.png',
    'breadGame/cloud1.png',
    'breadGame/cloud2.png',
    'breadGame/cloud3.png',
    'breadGame/cloud4.png',
    'breadGame/cloud5.png',
    'breadGame/floor.png',
    'breadGame/obstacleA0.png',
    'breadGame/obstacleF0.png',
]

for(const group in art) {
    for(const peice in art[group]) {
        if(!art[group][peice].folder) {
            textures.push(`art/${group}/${art[group][peice].url}`)
        }
    }
}


const gallery = doge('gallery')
const innerGallery = doge('innerGallery')
const galleryContainer = doge('galleryContainer')
function openGallery(group) { if(!selectedTool) {
    innerGallery.innerHTML = ''
    closeMediaView()
    gallery.style.animation = 'galleryOpen 250ms cubic-bezier(0,1,.5,1) 1 forwards'
    setTimeout(() => {
        galleryContainer.style.pointerEvents = 'unset'
    }, 250);

    doge('galleryHeaderText').innerText = '// ' + artTitles[group]
    doge('galleryFooterText').innerText = art[group].length + ' Items'

    //Clear images
    
    innerGallery.innerHTML = ''

    //Add images

    for(const image in art[group]) {
        if(!art[group][image].folder) {
            const img = document.createElement('img')
            img.src = `media/art/${group}/${art[group][image].url}`
            innerGallery.append(img)
    
            img.onmouseenter = () => {
                if(!contextMenuOpen) {
                    const rect = img.getBoundingClientRect()
                    mouseTarget = () => {return [rect.left + img.offsetWidth / 2, rect.top + img.offsetHeight / 2]}
                    cursor.style.borderRadius = '0'
                    cursor.style.width = img.offsetWidth + 'px'
                    cursor.style.height = img.offsetHeight + 'px'
                    cursor.style.outline = '2px solid white'
                    cursor.style.backdropFilter = 'none'
                    cursorHovering = img
                    cursorText.innerText = art[group][image].url
                }
            }
            img.onmouseleave = () => {
                if(!contextMenuOpen) {
                    mouseTarget = () => {return [mouse[0], mouse[1]]}
                    cursor.style.borderRadius = '50%'
                    cursor.style.width = '15px'
                    cursor.style.height = '15px'
                    cursor.style.outline = 'none'
                    cursor.style.backdropFilter = 'invert()'
                    cursorHovering = undefined
                    cursorText.innerText = ''
                }
            }
            img.onclick = () => {
                openMediaView(group, art[group][image])
            }
        } else {
            const folder = document.createElement('button')
            folder.style.height = '200px'
            folder.style.width = '200px'
            folder.style.fontSize = '1.5em'
            folder.style.fontWeight = '700'
            folder.innerText = art[group][image].name

            folder.onmouseenter = () => {
                if(!contextMenuOpen) {
                    const rect = folder.getBoundingClientRect()
                    mouseTarget = () => {return [rect.left + folder.offsetWidth / 2, rect.top + folder.offsetHeight / 2]}
                    cursor.style.borderRadius = '0'
                    cursor.style.width = folder.offsetWidth + 'px'
                    cursor.style.height = folder.offsetHeight + 'px'
                    cursorHovering = folder
                }
            }
            folder.onmouseleave = () => {
                if(!contextMenuOpen) {
                    mouseTarget = () => {return [mouse[0], mouse[1]]}
                    cursor.style.borderRadius = '50%'
                    cursor.style.width = '15px'
                    cursor.style.height = '15px'
                    cursorHovering = undefined
                }
            }

            folder.onclick = () => {
                openGallery(art[group][image].open)
            }

            innerGallery.append(folder)
        }
    }
}}

function closeGallery() {
    gallery.style.animation = 'galleryClose 250ms ease-in 1 forwards'
    galleryContainer.style.pointerEvents = 'none'
}

const mediaView = doge('mediaView')
function openMediaView(group, img) {
    mediaView.style.animation = 'galleryOpen 250ms cubic-bezier(0,1,.5,1) 1 forwards'
    doge('mediaViewImg').src = `media/art/${group}/${img.url}`
    doge('mediaViewTitle').innerText = img.url
    doge('mediaViewDate').innerText = img.date
    
    setTimeout(() => {
        mediaView.style.pointerEvents = 'unset'
    }, 250);
}

function closeMediaView() {
    mediaView.style.animation = 'galleryClose 250ms ease-in 1 forwards'
    mediaView.style.pointerEvents = 'none'
}


let allTexturesLoaded = false
const imageCache = {}

function loadTexures(path) {
    let loaded = 0
    let total = textures.length
    for(const image in path) {
        const img = new Image()
        img.onload = () => {
            loaded++
            imageCache[img.src] = img

            doge('texturesLoaded').innerText = `${loaded}/${total}`
            doge('loadingBar').style.width = (loaded / total) * 100 + '%'

            if(loaded === total) {
                allTexturesLoaded = true
                if(allTexturesLoaded && allVideosLoaded) {
                    doge('texturesLoaded').innerText = 'All media loaded!'
                    doge('loadingScreen').style.opacity = 0
                    document.body.style.overflow = 'unset'
                    setTimeout(() => {
                        doge('loadingScreen').style.display = 'none'
                    }, 500);
                }
            }
        }
        img.src = `media/${path[image]}`
    }
}
loadTexures(textures)

function getTexture(url) {
    for(const img in imageCache) { 
        if(img.endsWith(url)) {
            return imageCache[img]
        }
    }
}

const videos = [
    'headerBG'
]
let allVideosLoaded = false

function loadVideos(path) {
    let loadCheckInterval = setInterval(() => {
        let loaded = true
        for(const video in path) {
            if(doge(path[video]).readyState !== 4) {
                loaded = false
            }
        }

        if(loaded) {
            clearInterval(loadCheckInterval)
            allVideosLoaded = true

            if(allTexturesLoaded && allVideosLoaded) {
                doge('texturesLoaded').innerText = 'All media loaded!'
                doge('loadingScreen').style.opacity = 0
                document.body.style.overflow = 'unset'
                setTimeout(() => {
                    doge('loadingScreen').style.display = 'none'
                }, 500);
            }
        }
    }, 500);
}

loadVideos(videos)



function guyClick() {
    doge('guyCounter').innerText++
    doge('guyCounter').style.opacity = 1

    doge('guyCounter').style.animation = 'none'
    requestAnimationFrame(() => {
        doge('guyCounter').style.animation = 'pulse 500ms cubic-bezier(0,1,.5,1) 1 forwards'
    })

    if(doge('guyCounter').innerText === '1') {
        // startFight()
    }

    if(doge('guyCounter').innerText === '10') {
        const explosion = new Image()
        explosion.src = 'media/explosion.gif'
        explosion.style.position = 'absolute'
        explosion.style.left = '25px'
        explosion.style.top = '0'
        explosion.style.zIndex = '6'
        document.body.append(explosion)

        explosion.onload = () => {
            setTimeout(() => {
                explosion.remove()
            }, 750);
    
            DeBread.playSound('media/explosion.mp3', 0.05)
    
            const button = document.createElement('button')
            button.innerText = 'Bread Game'
            button.style.position = 'absolute'
            button.style.left = '75px'
            button.style.top = '75px'
            button.style.zIndex = '5'
            setTimeout(() => {
                document.body.append(button)
            }, 10);
    
            button.onmouseenter = () => {
                if(!contextMenuOpen && !selectedTool) {
                    const rect = button.getBoundingClientRect()
                    mouseTarget = () => {return [rect.left + button.offsetWidth / 2, rect.top + button.offsetHeight / 2]}
                    cursor.style.borderRadius = '0'
                    cursor.style.width = button.offsetWidth + 'px'
                    cursor.style.height = button.offsetHeight + 'px'
                    cursorHovering = button
                }
            }
            button.onmouseleave = () => {
                if(!contextMenuOpen && !selectedTool) {
                    mouseTarget = () => {return [mouse[0], mouse[1]]}
                    cursor.style.borderRadius = '50%'
                    cursor.style.width = '15px'
                    cursor.style.height = '15px'
                    cursorHovering = undefined
                }
            }
            button.onclick = () => {
                if(!selectedTool) {
                    doge('breadGameContainer').style.pointerEvents = 'unset'
                    doge('breadGameContainer').style.opacity = 1
        
                    doge('breadGameOverlay').style.pointerEvents = 'unset'
                    doge('breadGameOverlay').style.scale = 1
    
                    document.body.style.maxHeight = '100dvh'
                    document.body.style.overflow = 'hidden'
                }
            }
        }

    }
}

doge('guy').onmouseenter = () => {
    if(!selectedTool) {
        cursor.style.width = 0
        cursor.style.height = 0
        realCursor.style.opacity = 0
    }
}

doge('guy').onmouseleave = () => {
    if(!selectedTool) {
        cursor.style.width = '15px'
        cursor.style.height = '15px'
        realCursor.style.opacity = 1
    }
}