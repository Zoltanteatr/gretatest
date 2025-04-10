/* Общие стили */
body {
    margin: 0;
    font-family: 'Montserrat', Arial, sans-serif;
    overflow-x: hidden;
}

/* Прелоадер */
#preloader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 1s ease;
}
#preloader.hide {
    opacity: 0;
    pointer-events: none;
}
#preloader video {
    min-width: 100%;
    min-height: 100%;
    object-fit: cover;
}
#skip-button {
    position: absolute;
    bottom: 30px;
    right: 30px;
    padding: 10px 20px;
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    border: 1px solid #fff;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
#skip-button:hover {
    background-color: rgba(255, 255, 255, 0.25);
}

/* Секция 1: Геро-блок */
.hero {
    position: relative;
    height: 559px;
    background-color: #000;
    background-image: url('../images/tild3037-6530-4636-b439-363964306232__photo.png');
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 30px;
}
.hero__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3));
}
.hero__content {
    position: relative;
    text-align: center;
    z-index: 1;
}
.hero__title {
    font-family: 'Playfair Display', serif;
    font-size: 84px;
    font-weight: 400;
    background: linear-gradient(70deg, #ddc169 17%, #635344 85%);
    -webkit-background-clip: text;
    color: transparent;
    margin: 0;
}
.hero__subtitle {
    color: #fff;
    font-size: 17px;
    font-weight: 600;
    text-transform: uppercase;
    opacity: 0.75;
    margin: 20px 0;
}
.hero__subtitle em {
    font-weight: 200;
    font-style: normal;
}
.hero__button {
    display: inline-block;
    padding: 15px 30px;
    color: #fff;
    font-size: 16px;
    font-weight: 300;
    text-decoration: none;
    border: 1px solid #ddc169;
    transition: background-color 0.2s ease;
}
.hero__button:hover {
    background-color: rgba(0, 0, 0, 0.59);
}

/* Секция 2: Инфо-блок */
.info {
    position: relative;
    height: 550px;
    background-color: #000;
    background-image: url('../images/tild3762-3135-4535-b630-636663623136__photo.png');
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
}
.info__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
}
.info__content {
    position: relative;
    text-align: center;
    z-index: 1;
}
.info__title {
    font-family: 'Playfair Display', serif;
    font-size: 50px;
    font-weight: 700;
    background: linear-gradient(70deg, #ddc169 17%, #635344 85%);
    -webkit-background-clip: text;
    color: transparent;
    margin: 0;
}
.info__text {
    color: #fff;
    font-size: 17px;
    font-weight: 100;
    margin: 20px 0;
}

/* Адаптивность */
@media (max-width: 959px) {
    .hero__title { font-size: 60px; }
    .hero__subtitle { font-size: 16px; }
    .hero__button { padding: 12px 25px; }
    .info__title { font-size: 40px; }
}

@media (max-width: 639px) {
    .hero__title { font-size: 35px; }
    .hero__subtitle { font-size: 14px; }
    .info { height: 600px; }
}
