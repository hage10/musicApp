const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'Trung'
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist =$('.playlist')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    songs: [
        {
            name: 'Waiting For You',
            singer: 'Mono',
            path: './music/song1.mp3',
            image: './img/song1.jpg'
        },
        {
            name: 'Em là',
            singer: 'Mono',
            path: './music/song2.mp3',
            image: './img/song2.jpg'
        },
        {
            name: 'Ngủ một mình',
            singer: 'Hieuthuhai',
            path: './music/song3.mp3',
            image: './img/song3.jpg'
        },
        {
            name: 'Bài này không để đi diễn',
            singer: 'Anh Tú',
            path: './music/song4.mp3',
            image: './img/song4.jpg'
        },
        {
            name: 'Waiting For You1',
            singer: 'Mono',
            path: './music/song1.mp3',
            image: './img/song1.jpg'
        },
        {
            name: 'Waiting For You2',
            singer: 'Mono',
            path: './music/song1.mp3',
            image: './img/song1.jpg'
        },
        {
            name: 'Waiting For You3',
            singer: 'Mono',
            path: './music/song1.mp3',
            image: './img/song1.jpg'
        },
    ],
    render() {
        const htmls = this.songs.map((song, index) => {
            return `
                              <div class="song ${index === this.currentIndex ? "active" : ""
                }" data-index="${index}">
                                  <div class="thumb"
                                      style="background-image: url('${song.image}')">
                                  </div>
                                  <div class="body">
                                      <h3 class="title">${song.name}</h3>
                                      <p class="author">${song.singer}</p>
                                  </div>
                                  <div class="option">
                                      <i class="fas fa-ellipsis-h"></i>
                                  </div>
                              </div>
                          `;
        });
        $('.playlist').innerHTML = htmls.join('');

    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents() {
        const _this = this
        const cdWidth = cd.offsetWidth
        //xử lý CD quay và dưng
        const cdThumbAnimate = cdThumb.animate([
            { transform: "rotate(360deg)" }
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        });
        cdThumbAnimate.pause();
        //xử lý phóng to thu nhỏ cd
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdWidth - scrollTop
            console.log(scrollTop);
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth
        }
        //xử lí khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        },
            //khi song được play
            audio.onplay = function () {
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play();

            },
            //khi song đang ngừng
            audio.onpause = function () {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause();

            }
        //thanh thời gian thay đổi theo bài hát
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        //tua bài hát
        progress.onchange = function (e) {
            const seekTime = e.target.value / 100 * audio.duration
            audio.currentTime = seekTime;
        }
        //next bài hát
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandom()
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();

        }
        //prev bài hát
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandom()
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();

        }
        //random bài hát
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)

            randomBtn.classList.toggle('active', _this.isRandom)
        },

            //xử lý phát lại nhạc
            repeatBtn.onclick = function (e) {
                _this.isRepeat = !_this.isRepeat
                _this.setConfig('isRepeat',_this.isRepeat)
                repeatBtn.classList.toggle('active', _this.isRepeat)
            },
            //xử lý next song sau khi bài hát kết thúc
            audio.onended = function () {
                if (_this.isRepeat) {
                    audio.play();
                } else {
                    nextBtn.click();
                }
            },
            playlist.onclick = function(e){
                const songNode = e.target.closest('.song:not(.active)')
                if( songNode|| e.target.closest('.option')){
                    if(songNode){
                        const indexSong = Number(songNode.dataset.index)
                        _this.currentIndex = indexSong
                        _this.loadCurrentSong()
                        _this.render()
                        audio.play();
                    }
                }

            }
    },
    scrollToActiveSong() {
        setTimeout(() => {
          $(".song.active").scrollIntoView({
            behavior: "smooth",
            block: "nearest"
          });
        }, 300);
      },
    loadCurrentSong() {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandom() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while (newIndex == this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong()
    },
    start() {
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render()
    }
}
app.start();