const cats = [
    '1.jpg',
    '2.png',
    '3.png',
    '4.png',
    '5.webp',
    '6.png',
    '7.png',
    '8.png',
    '9.webp',
    '10.png'
]
document.getElementById('catImg').src = `media/cats/${cats[Math.floor(Math.random() * cats.length)]}`
const text = [
    'Oh shucks :(',
]
document.getElementById('title').innerText = text[Math.floor(Math.random() * text.length)]
