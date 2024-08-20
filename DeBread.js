const soundPool = {}
let audios = 0
let audioLimit = 25
const intervals = {}

const DeBread = {
    /**
    * Rounds a number to the specified decimal place.
    * @param num The number to round.
    * @param decimalPlaces The decimal place to round to.
    */
    round(num, decimalPlaces = 0) {
        return Math.round(num * (Math.pow(10, decimalPlaces))) / (Math.pow(10, decimalPlaces))
    },

    /**
    * Returns a random color.
    */
    randomColor() {
        return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
    },

    /**
    * Returns a random number.
    * @param min The minimum amount the number can be.
    * @param max The maximum amount amount the number can be.
    * @param decimalPlaces The amount of decimal places.
    */
    randomNum(min = 0, max = 1, decimalPlaces = 0) {
        return DeBread.round((Math.random() * (max - min)) + min, decimalPlaces)
    },

    /**
    * Applies a shake effect to an element.
    * (This uses the CSS transform property so it will override an y current CSS transformations.)
    * @param element The element to shake.
    * @param interval The interval of the shake.
    * @param intensity The intensity of the shake.
    * @param time How long the shake lasts (ms).
    * @param rotate If to involve rotation in the shake.
    * @param rotateIntensity The intensity of the rotation in the shake.
    */
    shake(element, interval, intensityX, intensityY, time, rotate = false, rotateIntensity = 0) {
        let shakeInterval = setInterval(() => {
            if(rotate) {
                element.style.setProperty('transform',`translateX(${DeBread.randomNum(-intensityX, intensityX)}px) translateY(${DeBread.randomNum(-intensityY, intensityY)}px) rotate(${DeBread.randomNum(-rotateIntensity, rotateIntensity)}deg)`)
            } else {
                element.style.setProperty('transform',`translateX(${DeBread.randomNum(-intensityX, intensityX)}px) translateY(${DeBread.randomNum(-intensityY, intensityY)}px)`)
            }
        }, interval * gameSpeed);
        setTimeout(() => {
            clearInterval(shakeInterval)
            element.style.setProperty('transform',`none`)
        }, time * gameSpeed);
    },

    easeShake(element, interval, startIntensity, intensityDecrease) {
        let intensity = startIntensity
        let shakeInterval = setInterval(() => {
            if(intensity < 0) {
                clearInterval(shakeInterval)
                element.style.translate = 'none'
            } else {
                element.style.translate = `${DeBread.randomNum(-intensity, intensity)}px ${DeBread.randomNum(-intensity, intensity)}px`
                intensity -= intensityDecrease
            }
        }, interval);
    },

    /**
    * Creates particles.
    * @param destination The ID of the HTML element to append the particles to.
    * @param count The number of particles to create.
    * @param interval The time between particles spawning (ms).
    * @param lifespan How long the particle lasts intill it's destroyed.
    * @param timingFunction The timing function of the particle animation.
    * @param positionRange The position range of the particles. [[minX, maxX], [minY, maxY]]
    * @param sizeRange The size range of the particles. [[[startingWidthMin, startingWidthMax], [startingHeightMin, startingHeightMax]], [[endingScaleXMin, endingScaleXMax], [endingScaleYMin, endingScaleYMax]]]
    * @param rotateRange The rotation range of the particles. [[startingMinDeg, startingMaxDeg], [endingMinDeg, endingMaxDeg]]
    * @param velocityRange The range of the particle's movement. [[minX, maxX], [minY, maxY]]
    * @param primaryColorRange The range of the particle's starting color. [[minR, minG, minB], [maxR, maxG, maxB]]
    * @param secondaryColorRange The range of the particle's ending color. [[minR, minG, minB], [maxR, maxG, maxB]]
    */
    createParticles(
        destination,
        count = 0, 
        interval = 0,
        lifespan = 0,
        timingFunction = 'cubic-bezier(.5,1.5,.5,-0.5)',
        positionRange = [[0, 0], [0, 0]], 
        sizeRange = [[[0, 0], [0, 0]], [[0, 0], [0, 0]]],
        rotateRange = [[0, 0], [0, 0]],
        velocityRange = [[0, 0], [0, 0]], 
        primaryColorRange = [[0, 0, 0], [0, 0, 0]],
        secondaryColorRange = [[0, 0, 0], [0, 0, 0]],
        ) {
            if(true) { //ignore this
                for(let i = 0; i < count; i++) {
                    setTimeout(() => {       
                        if(true) {
                            const particle = document.createElement('div')
                            particle.classList.add('particle')
                
                            const randomWidth = DeBread.randomNum(sizeRange[0][0][0], sizeRange[0][0][1])
                            particle.style.width = randomWidth + 'px'
            
                            const randomHeight = DeBread.randomNum(sizeRange[0][1][0], sizeRange[0][1][1])
                            particle.style.height = randomHeight + 'px'
            
                            particle.style.backgroundColor = `rgb(
                                ${DeBread.randomNum(primaryColorRange[0][0], primaryColorRange[1][0])}
                                ${DeBread.randomNum(primaryColorRange[0][1], primaryColorRange[1][1])}
                                ${DeBread.randomNum(primaryColorRange[0][2], primaryColorRange[1][2])}
                            )`
            
                            particle.style.rotate = DeBread.randomNum(rotateRange[0][0], rotateRange[0][1]) + 'deg'
                
                            destination.appendChild(particle)                
                            particle.style.left = DeBread.randomNum(positionRange[0][0], positionRange[0][1]) - particle.offsetWidth / 2 + 'px'
                            particle.style.top = DeBread.randomNum(positionRange[1][0], positionRange[1][1]) - particle.offsetHeight / 2 + 'px'
        
                            // console.log(`
                            //     XPOS: ${DeBread.randomNum(positionRange[0][0], positionRange[0][1]) - (particle.offsetWidth / 2) + 'px'}
                            //     YPOS: ${DeBread.randomNum(positionRange[1][0], positionRange[1][1]) - (particle.offsetHeight / 2) + 'px'}
        
                            //     MINX: ${positionRange[0][0]}
                            //     MAXX: ${positionRange[0][1]}
                            //     WIDTH: ${particle.offsetWidth}
        
                            //     MINY: ${positionRange[1][0]}
                            //     MAXY: ${positionRange[1][1]}
                            //     HEIGHT: ${particle.offsetHeight}
                            // `)
            
                            particle.style.setProperty('--particleLifespan', lifespan * gameSpeed + 'ms')
                            particle.style.setProperty('--particleTimingFunction', timingFunction)
                            particle.style.setProperty('--particleX', DeBread.randomNum(velocityRange[0][0], velocityRange[0][1]) + 'px')
                            particle.style.setProperty('--particleY', DeBread.randomNum(velocityRange[1][0], velocityRange[1][1]) + 'px')
                            particle.style.setProperty('--particleSizeX', DeBread.randomNum(sizeRange[1][0][0], sizeRange[1][0][1]) + '%')
                            particle.style.setProperty('--particleSizeY', DeBread.randomNum(sizeRange[1][1][0], sizeRange[1][1][1]) + '%')
                            particle.style.setProperty('--particleRotate', DeBread.randomNum(rotateRange[1][0], rotateRange[1][1]) + 'deg')
                            particle.style.setProperty('--particleColor', 
                                `rgb(
                                    ${DeBread.randomNum(secondaryColorRange[0][0], secondaryColorRange[1][0])}
                                    ${DeBread.randomNum(secondaryColorRange[0][1], secondaryColorRange[1][1])}
                                    ${DeBread.randomNum(secondaryColorRange[0][2], secondaryColorRange[1][2])}
                                )`
                            )
            
                            setTimeout(() => {
                                destination.removeChild(particle)
                            }, lifespan);
                        }       
                    }, i * interval );
                }
            }
        },


    // /**
    //  * 
    //  * @param obj Contains all of the attributes of the particles.
    //  * @param obj.destination *Where in the DOM to spawn the particles.
    //  * @param obj.count *How many particles, in total, to spawn.
    //  * @param obj.lifespan *How long each particles lasts before despawning in milliseconds.
    //  * @param obj.interval How long in milliseconds between each particle spawning.
    //  * @param obj.styles *The CSS styles of each particle, specify width, height, and color here.
    //  * @param obj.pos *The position range where the particles can spawn.
    //  * @param obj.timingFunction The timing function of the particle animation.
    //  */
    // coolCreateParticles(obj) {
    //     const particle = document.createElement('div')
    //     particle.style.position = 'absolute'
    //     let randomPositionValues = [[DeBread.randomNum(obj.pos[0][0], obj.pos[0][1])], [DeBread.randomNum(obj.pos[1][0], obj.pos[1][1])]]
    //     particle.style.left = randomPositionValues[0]+'px'
    //     particle.style.top = randomPositionValues[1]+'px'

    //     for (const CSSStyle in obj.styles) {
    //         let cssValue
    //         try {
    //             cssValue = eval(obj.styles[CSSStyle])
    //             cssValue = cssValue.toString()
    //         } catch (error) {
    //             cssValue = obj.styles[CSSStyle]
    //         }
    
    //         particle.style[CSSStyle] = cssValue
    //     }
    //     obj.destination.append(particle)
    // },

    /**
    * Plays a sound.
    * @param sound The file path of the audio.
    * @param volume The volume to play the sound at.
    * @param speed The speed to play the sound at.
    */
    playSound(sound, volume = 1, speed = 1) {
        if(audios < audioLimit) {
            if(!soundPool[sound]) {
                soundPool[sound] = new Audio(sound)
            }
            const audio = soundPool[sound]
            audio.volume = volume
            audio.playbackRate = speed

            if(audio.paused) {
                audio.play()
                audios++
                doge('underAudioCounter').innerText = `Sounds: ${audios}/${audioLimit}`
                doge('underAudioCounter').style.color = `hsl(0deg, 100%, ${100 - ((audios - (audioLimit / 2)) / audioLimit) * 100}%)`
            } else{
                const audioClone = audio.cloneNode()
                audioClone.volume = volume
                audioClone.playbackRate = speed
                audioClone.play()
                audios++
                doge('underAudioCounter').innerText = `Sounds: ${audios}/${audioLimit}`
                doge('underAudioCounter').style.color = `hsl(0deg, 100%, ${100 - ((audios - (audioLimit / 2)) / audioLimit) * 100}%)`
            }

            setTimeout(() => {
                audios--
                doge('underAudioCounter').innerText = `Sounds: ${audios}/${audioLimit}`
                doge('underAudioCounter').style.color = `hsl(0deg, 100%, ${100 - ((audios - (audioLimit / 2)) / audioLimit) * 100}%)`
            }, audio.duration * 1000);
        }
    },

    rgbStringToArray(rgbString) {
        const regex = /(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})/
        const match = rgbString.match(regex)
    
        if (match) {
            const [, r, g, b] = match
            return [parseInt(r), parseInt(g), parseInt(b)]
        } else {
            return null;
        }
    },

    dialogue: {

        /**
        * Creates the elements needed for the dialogue to work properly.
        * @param destination The ID of the HTML element to append the dialogue container to.
        * @param type Wether to use custom styles or preset styles, preset = Preset stles; custom = Custom styles.
        * @param containerClassName The name of the class used for styling the dialogue container.
        * @param boxClassName The name of the class used for styling the dialogue box.
        */

        create(destination, type, containerClassName, boxClassName) {
            if(!dialogueCreated) {
                dialogueCreated = true

                const dialogueContainer = document.createElement('div')
                const dialogueBox = document.createElement('div')

                if(type === 'preset') {
                    //DIALOGUE CONTAINER PRESET STYLES
    
                    dialogueContainer.style.width = '100vw'
                    dialogueContainer.style.top = '25px'
                    dialogueContainer.style.display = 'none'
                    dialogueContainer.style.position = 'absolute'
                    dialogueContainer.style.justifyContent = 'center'
                    
                    doge(destination).appendChild(dialogueContainer)
                    console.log('Dialogue container has been created.')
                    
                    //DIALOGUE CONTAINER ATTRIBUTES
                    
                    dialogueContainer.setAttribute('id','DeBreadDialogueContainer')
                    
                    //DIALOGUE BOX PRESET STYLES
                    
                    dialogueBox.style.height = '125px'
                    dialogueBox.style.width = '750px'
                    dialogueBox.style.padding = '10px'
                    dialogueBox.style.backgroundColor = 'rgb(50, 50, 50)'
                    dialogueBox.style.display = 'flex'
                    dialogueBox.style.gap = '10px'
                    dialogueBox.style.cursor = 'pointer'
                    dialogueBox.style.userSelect = 'none'
                    dialogueBox.style.position = 'relative'
                    dialogueBox.innerHTML = 
                    `
                        <div style="width: 125px; height: 125px; display: flex; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 40%);">
                            <img id="DeBreadDialogueImg" width="115px" height="115px" style="background-color: rgba(0, 0, 0, 50%);">
                        </div>
                        <div style="height: 100%; width: calc(100% - 160px); display: flex; flex-direction: column; gap: 5px; line-height: 1">
                            <span id="DeBreadDialogueName" style="font-size: 1.25em; font-weight: 700; width: 100%; background-color: rgba(0, 0, 0, 40%); padding: 5px;">Character Name</span><br>
                            <span id="DeBreadDialogueText" style="width: 100%; height: 100%; background-color: rgba(0, 0, 0, 40%); padding: 5px;">This is some words</span>
                            <div style="position: absolute; bottom: 15px; right: 30px; display: flex; justify-content: center;">
                                <img id="DeBreadDialogueProgressionIcon" src="media/arrow.png" width="20">
                            </div>
                        </div>
                    `

                    dialogueBox.setAttribute('id','DeBreadDialogueBox')
                    doge('DeBreadDialogueContainer').appendChild(dialogueBox)
                    console.log('Dialogue box has been created.')

                } else if(type === 'custom') {
                    dialogueContainer.classList.add(containerClassName)
                    dialogueBox.classList.add(boxClassName)

                    dialogueBox.innerHTML = 
                    `
                        <div style="width: 125px; height: 125px; display: flex; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 40%);">
                            <img id="DeBreadDialogueImg" width="115px" height="115px" style="background-color: rgba(0, 0, 0, 50%);">
                        </div>
                        <div style="height: 100%; width: calc(100% - 160px); display: flex; flex-direction: column; gap: 5px; line-height: 1">
                            <span id="DeBreadDialogueName" style="font-size: 1.25em; font-weight: 700; width: 100%; background-color: rgba(0, 0, 0, 40%); padding: 5px;">Character Name</span><br>
                            <span id="DeBreadDialogueText" style="width: 100%; height: 100%; background-color: rgba(0, 0, 0, 40%); padding: 5px;">This is some words</span>
                            <div style="position: absolute; bottom: 15px; right: 30px; display: flex; justify-content: center;">
                                <img id="DeBreadDialogueProgressionIcon" src="media/arrow.png" width="20">
                            </div>
                        </div>
                    `
                } else {
                    console.error('Please provide a valid dialogue type.')
                    console.log('Syntax: create(destination, type, containerClassName?, boxClassName?)')
                    console.log('preset: Uses preset styles')
                    console.log('custom: Uses custom styles based on the class provided.')

                    dialogueCreated = false
                }
            } else {
                console.error('Dialogue has already been created.')
                console.log('Use DeBread.dialogue.display(id) to display dialogue.')
            }
        },

        /**
        * Displays the dialogue.
        * @param id The ID of the dialogue object.
        * @param progressionKey The key used to progress the dialogue.
        */

        display(id, progressionKey = ' ') {
            if(dialogueFilePath === '') {
                console.error('Please set a dialogue file path using DeBread.dialogue.setFilePath(path)')
                console.log(`Current path: '${dialogueFilePath}'`)
            } else {
                doge('DeBreadDialogueContainer').style.display = 'flex'
                let progression = 0
                updateDialogue(progression)
                document.body.addEventListener('keydown', progressDialogue)
                doge('DeBreadDialogueBox').addEventListener('mousedown', progressDialogue)

                function progressDialogue() {
                    if(event.key === progressionKey) {
                        doge('DeBreadDialogueProgressionIcon').style.opacity = 0
                        if(progression < id.length - 1) {
                            progression++
                            updateDialogue(progression)
                        } else {
                            doge('DeBreadDialogueContainer').style.display = 'none'
                            document.body.removeEventListener('keydown', progressDialogue)
                            doge('DeBreadDialogueBox').removeEventListener('mousedown', progressDialogue)
                            progression = 0
                        }
                    }
                }
    
                function updateDialogue(progress) {
                    doge('DeBreadDialogueImg').src = `${dialogueFilePath}/${id[progress].character}/${id[progress].mood}.gif`
                    doge('DeBreadDialogueName').innerText = id[progress].name                    
                    doge('DeBreadDialogueName').style.color = nameColors[id[progress].character]
                    doge('DeBreadDialogueBox').style.background = `url(${dialogueFilePath}/${id[progress].character}/bg.png)`
                    doge('DeBreadDialogueBox').style.backgroundSize = '770px'
                    
                    if(id[progress].run) {
                        id[progress].run()
                    }
                    
                    let currentText = ''
                    for(let i = 0; i < id[progress].text.length; i++) {
                        setTimeout(() => {
                            if(progress === progression) {
                                currentText += id[progress].text[i]
                                doge('DeBreadDialogueText').innerHTML = currentText
                            }
                            if(i === id[progress].text.length - 1) {
                                if(progress === id.length - 1) {
                                    doge('DeBreadDialogueProgressionIcon').src = 'media/x.png'
                                } else {
                                    doge('DeBreadDialogueProgressionIcon').src = 'media/arrow.png'
                                }
                                doge('DeBreadDialogueProgressionIcon').style.opacity = 1
                            }
                        }, 20 * i);
                    }
                }
            }
        },

        /**
         * Sets the file path for the character portraits.
         * @param path The file path. 
         */

        setFilePath(path) {
            dialogueFilePath = path
            console.log(`Dialogue file path has been set to '${path}'`)
        }
    },

        /**
     * Creates an interval.
     * @param id A unique string for naming the interval.
     * @param run What to run in each callback.
     * @param delay The delay in milliseconds between each callback. Can also be a string for changing variables.
     * @param repeat How many times the interval runs before being deleted.
     */
    createInterval(id, run, delay, repeat = Infinity) {
        if(!intervals[id]) {
            intervals[id] = {
                lastRan: performance.now(),
                timePaused: undefined,
                timesRepeated: 0,
                paused: false,
                fun: () => {run()},
                delay: delay.toString(),
                callback: () => {
                    intervals[id].timeout = setTimeout(() => {
                        run()
                        intervals[id].lastRan = performance.now()
                        intervals[id].timesRepeated++
                        if(intervals[id].timesRepeated < repeat) {
                            intervals[id].callback()
                        } else {
                            DeBread.deleteInterval(id)
                        }
                    }, eval(delay.toString()));
                }
            }

            intervals[id].callback()
        } else {
            throw new Error(`Interval ${id} is already created. Use DeBread.deleteInterval(${id}) to remove it.`)
        }

        return intervals[id]
    },

    /**
     * Pause/Resumes an interval using its ID.
     * @param id The ID of an existing interval.
     */
    pauseInterval(id) {
        if(intervals[id]) {
            let interval = intervals[id]
            if(interval.paused) {
                setTimeout(() => {
                    interval.fun()
                    interval.callback()
                }, interval.delay - (interval.timePaused - interval.lastRan));
            } else {
                clearTimeout(interval.timeout)
                interval.timePaused = performance.now()
                console.log(interval.timePaused)
            }
            interval.paused = !interval.paused
        } else {
            throw new Error(`Couldn't find an interval using the ID of ${id}, try creating one using DeBread.createInterval()`)
        }
    },

    /**
     * Deletes an interval using its ID.
     * @param id The ID of an existing interval.
     */
    deleteInterval(id) {
        if(intervals[id]) {
            intervals[id] = undefined
            clearTimeout(intervals[id].timout)
        } else {
            throw new Error(`Couldn't find an interval using the ID of ${id}, try creating one using DeBread.createInterval()`)
        }
    }
}

let windowFocused = true
window.onfocus = () => {windowFocused = true}
window.onblur = () => {windowFocused = false}

/**
* Shortened document.getElementById.
* (From library "DeBread")
* @param id The ID of the element.
*/
function doge(id) {
    return document.getElementById(id)
}

function isColliding(div1, div2) {
    const rect1 = div1.getBoundingClientRect()
    const rect2 = div2.getBoundingClientRect()
  
    return !(
      rect1.right <= rect2.left ||
      rect1.left >= rect2.right ||
      rect1.bottom <= rect2.top ||
      rect1.top >= rect2.bottom
    )
}

//-----Credit: @zeanzarzin-----//

// less horrible number formatter (in my opinion)
const startingNumber = 1000000;
const numberStep = 1000;
const numberNames = [
    " Million",
    " Billion",
    " Trillion",
    " Quadrillion",
    " Quintillion",
    " Sextillion",
    " Septillion",
    " Octillion",
    " Nonillion",
    " Decillion",
    " Undecillion",
    " Duodecillion",
    " Tredecillion",
    " Quattuordecillion",
    " Quindecillion",
    " Sexdecillion",
    " Septemdecillion",
    " Octodecillion",
    " Novemdecillion",
    " Vigintillion",
    " Unvigintillion",
    " Duovigintillion",
    " Trevigintillion",
    " Quattuorvigintillion",
    " Quinvigintillion",
    " Sexvigintillion",
    " Septvigintillion",
    " Octovigintillion",
    " Nonvigintillion",
    " Trigintillion",
    " Untrigintillion",
    " Duotrigintillion",
];
const googol = Math.pow(10, 100); // googol is annoying to work with >:(

const numberNameCount = numberNames.length;

function formatNumber(number) {
    if(number >= startingNumber) {
        let i; // unfortunately i has to be defined in this scope
        let currentNumber = startingNumber;
        for(i = 0; i <= numberNameCount && number >= currentNumber*numberStep; i++) {
            currentNumber *= numberStep;
        }

        if(i == numberNameCount) {
            return (Math.round(number / googol * 1000) / 1000) + " Googol";
        }

        return (Math.round(number / currentNumber * 1000) / 1000) + numberNames[i];
    }
    return (Math.round(number*10)/10).toLocaleString();
}