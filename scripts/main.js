const hiText = document.querySelector('#name-wrap')
const theName = params.name || window.localStorage.sg_name
if (hiText) {
    if (theName) {
        window.localStorage.setItem('sg_name', theName)
    }
    
    if (document.getElementById('name')) {
        document.getElementById('name').innerText = theName
    }

    hiText.removeAttribute('data-pg-ia-hide')

    const hiSplit = new SplitText(hiText, {type: 'words'})
    gsap.set(hiText, {
        overflow: 'hidden'
    })
    gsap.from(hiSplit.words, {
        y: '100%',
        autoAlpha: 0,
        stagger: 0.05
    })
}

const heading = document.querySelector('.page-heading')
if (heading) {
    const splitHeading = new SplitText(heading, {type: 'chars'})
    gsap.to(heading, {
        autoAlpha: 1
    })
    gsap.from(splitHeading.chars, {
        scale: 1.2,
        autoAlpha: 0,
        filter: 'blur(10px)',
        delay: "random(0, 1)"
    })
}


/* PAGE FADE TRANSITIONS */
const homeLinks = Array.from(document.querySelectorAll('[href="/"]'))
const teamLinks = Array.from(document.querySelectorAll('[href*="team"]'))

if (homeLinks.length) {
    homeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault()

            document.getElementsByTagName("html")[0].classList.remove('dark')

            gsap.to(document.getElementsByTagName('main')[0], {
                opacity: 0,
                duration: .3
            })

            setTimeout(() => {
                window.location.href = e.target.href
            }, 300)
        })
    })
}

if (teamLinks.length) {
    teamLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault()

            document.getElementsByTagName("html")[0].classList.add('dark')

            gsap.to(document.getElementsByTagName('main')[0], {
                opacity: 0,
                duration: .3
            })

            setTimeout(() => {
                window.location.href = e.target.href
            }, 300)
        })
    })
}

/* PROJECT FLIP ANIMATION */
const projects = document.getElementById('projects')
if (projects) {
    projects.addEventListener('mouseover', (e) => {
        if (e.target.nodeName === 'A') {
            e.target.classList.add('active')
        }
    })
    projects.addEventListener('mouseout', (e) => {
        if (e.target.nodeName === 'A') {
            e.target.classList.remove('active')
        }
    })
}


/* HEADER JUMP LINKS */
const jumpLinks = Array.from(document.querySelectorAll('[href^="#"]'))
if (jumpLinks.length) {
    jumpLinks.forEach(link => {
        if (link.href.split('#')[1]) {
            const target = document.getElementById(link.href.split('#')[1])

            link.addEventListener('click', (e) => {
                e.preventDefault()

                window.scrollTo({
                    top: target.offsetTop,
                    left: 0,
                    behavior: "smooth",
                })
            })
        }
    })
}
