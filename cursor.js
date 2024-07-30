const cursor = doge('cursor')
const realCursor = doge('realCursor')
const cursorText = doge('cursorText')
let mouse = [0, 0]
let cursorX = 0
let cursorY = 0
let cursorHovering = undefined
let customContextMenu = true

const speed = 0.15
let mouseTarget = () => {return [mouse[0], mouse[1]]}

function updateCursor() {
    const dx = mouseTarget()[0] - cursorX
    const dy = mouseTarget()[1] - cursorY
    cursorX += dx * speed
    cursorY += dy * speed
    cursor.style.translate = `${cursorX - cursor.offsetWidth / 2}px ${cursorY - cursor.offsetHeight / 2}px`
    realCursor.style.translate = `${mouse[0] - realCursor.offsetWidth / 2}px ${mouse[1] - realCursor.offsetHeight / 2}px`
    cursorText.style.translate = `${cursorX - cursorText.offsetWidth / 2}px ${(cursorY - cursor.offsetHeight / 2) - cursorText.offsetHeight - 2}px`

    requestAnimationFrame(updateCursor)
}

document.addEventListener('mousemove', (e) => {
    mouse[0] = e.pageX
    mouse[1] = e.pageY
})
updateCursor()

document.addEventListener('mousedown', () => {
    if(cursorHovering === undefined) {
        cursor.style.scale = 0.75
    }
})
document.addEventListener('mouseup', () => {cursor.style.scale = 1})

document.querySelectorAll('span, em').forEach(text => {
    if(!text.getAttribute('ignoreCursor')) {
        text.onmouseenter = () => {
            if(!contextMenuOpen && !selectedTool) {
                mouseTarget = () => {return [mouse[0], text.getBoundingClientRect().top + text.offsetHeight / 2]}
                cursor.style.height = text.offsetHeight + 'px'
                cursor.style.width = '5px'
                cursor.style.borderRadius = '0'
                cursorHovering = text
            }
        }
        text.onmouseleave = () => {
            if(!contextMenuOpen && !selectedTool) {
                mouseTarget = () => {return [mouse[0], mouse[1]]}
                cursor.style.height = '15px'
                cursor.style.width = '15px'
                cursor.style.borderRadius = '50%'
                cursorHovering = undefined
            }
        }
    }
})

document.querySelectorAll('button').forEach(button => {
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
})

document.querySelectorAll('img').forEach(img => {
    if(!img.getAttribute('ignoreCursor')) {
        img.onmouseenter = () => {
            if(!contextMenuOpen && !img.getAttribute('ignore') && !selectedTool) {
                const rect = img.getBoundingClientRect()
                mouseTarget = () => {return [rect.left + img.offsetWidth / 2, rect.top + img.offsetHeight / 2]}
                cursor.style.borderRadius = '0'
                cursor.style.width = img.offsetWidth + 'px'
                cursor.style.height = img.offsetHeight + 'px'
                cursor.style.outline = '2px solid white'
                cursor.style.backdropFilter = 'none'
                cursorHovering = img
            }
        }
        img.onmouseleave = () => {
            if(!contextMenuOpen && !img.getAttribute('ignore') && !selectedTool) {
                mouseTarget = () => {return [mouse[0], mouse[1]]}
                cursor.style.borderRadius = '50%'
                cursor.style.width = '15px'
                cursor.style.height = '15px'
                cursor.style.outline = 'none'
                cursor.style.backdropFilter = 'invert()'
                cursorHovering = undefined
            }
        }
    }
})

document.querySelectorAll('.game').forEach(game => {
    game.onmouseenter = () => {
        if(!contextMenuOpen && !game.getAttribute('ignore') && !selectedTool) {
            const rect = game.getBoundingClientRect()
            mouseTarget = () => {return [rect.left + game.offsetWidth / 2, rect.top + game.offsetHeight / 2]}
            cursor.style.borderRadius = '0'
            cursor.style.width = game.offsetWidth + 'px'
            cursor.style.height = game.offsetHeight + 'px'
            cursor.style.outline = '4px solid white'
            cursor.style.backdropFilter = 'none'
            cursorHovering = game
        }
    }
    game.onmouseleave = () => {
        if(!contextMenuOpen && !game.getAttribute('ignore') && !selectedTool) {
            mouseTarget = () => {return [mouse[0], mouse[1]]}
            cursor.style.borderRadius = '50%'
            cursor.style.width = '15px'
            cursor.style.height = '15px'
            cursor.style.outline = 'none'
            cursor.style.backdropFilter = 'invert()'
            cursorHovering = undefined
        }
    }
    game.onclick = () => {
        if(game.getAttribute('game') && !selectedTool) {
            window.open(`https://debread.space/${game.getAttribute('game')}`, '_blank')
        }
    }
})

document.querySelectorAll('a').forEach(link => {
    link.target = '_blank'
    link.onmouseenter = () => {
        if(!contextMenuOpen && !selectedTool) {
            const rect = link.getBoundingClientRect()
            mouseTarget = () => {return [rect.left + link.offsetWidth / 2, rect.top + link.offsetHeight / 2]}
            cursor.style.borderRadius = '0'
            cursor.style.width = link.offsetWidth + 'px'
            cursor.style.height = link.offsetHeight + 'px'
            cursor.style.outline = '2px solid white'
            cursor.style.backdropFilter = 'none'
            cursorHovering = link
            cursorText.innerText = link.href.replace('https://','')
        }
    }
    link.onmouseleave = () => {
        if(!contextMenuOpen && !selectedTool) {
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
})

let contextMenuOpen = false
document.addEventListener('contextmenu', ev => {
    if(customContextMenu && !selectedTool) {
        ev.preventDefault()
        cursor.innerHTML = ''
        if(contextMenuOpen) {
            closeContextMenu()
        } else {
            openContextMenu()
        }
    }
})

cursor.onmouseleave = () => {
    closeContextMenu(true)
}

function openContextMenu() {
    const buttons = []

    const selectedText = window.getSelection().toString()
    
    if(cursorHovering) {
        if(cursorHovering.src) {
            buttons.push({
                text: 'Dowload image',
                action: () => {
                    const link = document.createElement('a')
                    link.href = cursorHovering.src
                    link.download = cursorHovering.src.substring(cursorHovering.src.lastIndexOf('/') + 1)
                    document.body.append(link)
                    link.click()
                    link.remove()
                }
            })
            buttons.push({
                text: 'Copy image url',
                action: () => {
                    navigator.clipboard.writeText(cursorHovering.src)
                }
            })
            buttons.push({
                text: 'Open image',
                action: () => {
                    window.open(cursorHovering.src)
                }
            })
        }
        if(cursorHovering.href) {
            buttons.push({
                text: 'Open in new tab',
                action: () => {
                    window.open(cursorHovering.href, '_blank')
                }
            })
            buttons.push({
                text: 'Open here',
                action: () => {
                    window.open(cursorHovering.href, '_self')
                }
            })
            buttons.push({
                text: 'Copy link',
                action: () => {
                    navigator.clipboard.writeText(cursorHovering.href)
                }
            })
        }

        if(cursorHovering.classList.contains('game')) {
            buttons.push({
                text: 'Open game in new tab',
                action: () => {
                    window.open(`https://debread.space/${cursorHovering.getAttribute('game')}`, '_blank')
                }
            })
            buttons.push({
                text: 'Open game here',
                action: () => {
                    window.open(`https://debread.space/${cursorHovering.getAttribute('game')}`, '_self')
                }
            })
        }

    }

    if(window.getSelection().toString().length > 0) {
        buttons.push({
            text: 'Copy',
            action: () => {
                navigator.clipboard.writeText(selectedText)
            }
        })
    }

    buttons.push({
        text: 'Disable context menu',
        action: () => {
            customContextMenu = false
        }
    })

    buttons.push({
        text: 'Copy page link',
        action: () => {navigator.clipboard.writeText('https://debread.space')}
    })

    buttons.push({
        text: 'Reload page',
        action: () => {window.location.reload()}
    })

    if(buttons.length === 0) {
        closeContextMenu(false)
        contextMenuOpen = false
    } else {
        contextMenuOpen = true
    }

    if(contextMenuOpen) {
        const currentMousePos = [mouse[0], mouse[1]]
        mouseTarget = () => {return [currentMousePos[0], currentMousePos[1]]}
        cursor.style.width = '200px'
        cursor.style.borderRadius = '10px'
        cursor.style.pointerEvents = 'unset'
        cursor.style.backgroundColor = 'white'
        cursor.style.outline = '2px solid black'
    
    
    
        cursor.style.height = `${(buttons.length * 25) + (2 * buttons.length - 1)}px`
    
        for(const key in buttons) {
            const div = document.createElement('div')
            div.classList.add('contextMenuButton')
            div.innerText = buttons[key].text
            div.onclick = () => {
                buttons[key].action()
                closeContextMenu()
            }
            cursor.append(div)
        }
    
        contextMenuOpen = true
    }
}

function closeContextMenu(fix = true) {
    if(fix) {
        mouseTarget = () => {return [mouse[0], mouse[1]]}
        cursor.style.borderRadius = '50%'
        cursor.style.width = '15px'
        cursor.style.height = '15px'
        cursor.style.pointerEvents = 'none'
        cursor.innerHTML = ''
        cursor.style.backgroundColor = 'transparent'
        cursor.style.outline = 'none'
        cursor.style.cursor = 'none'
        cursor.style.outline = 'none'
        cursor.style.backdropFilter = 'invert()'
        cursorText.innerText = ''
        cursor.innerText = ''
        cursor.style.color = 'white'
    }
    contextMenuOpen = false
}