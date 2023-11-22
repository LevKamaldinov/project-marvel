import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinners';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

// функциональный подход
const RandomChar = () => {
    // поля классов позволяют прописывать такой лаконичный код для стэйтов
    const [char, setChar] = useState({});
    // эти два состояния теперь будут приходить из useMarvelService, так что их можно не прописывать
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(false);
    // выше мы импортировали наш хук с запросом на сервер, здесь его будем использовать
    const {loading, error, getCharacter, clearError} = useMarvelService(); // вытаскиваем из вызова хука два состояния и метод, кт будет использоваться в этом компоненте

    // пропишем метод, который правильным образом при первой загрузке страницы будет запускать наш компонент, не выдавая багов, как это было при запуске метода через Constructor
    useEffect(() => {
        updateChar();
        // timerId = setInterval(this.updateChar, 300000); // сделаем, чтобы обновление компонента шло через интервалы времени
        // return () => {
        //     clearInterval(timerId);
        // }
    }, [])


    // пропишем метод, который будет обновлять стэйт char
    const onCharLoaded = (char) => {
        setChar(char);
        // код ниже убираем, потому что его работу будет выполнять useHttp - хук, который, по сути, придёт и сработает от useMarvelService
        // setLoading(false); // если данные от сервера вернулись (стэйту char присвоилось какое-то значение), то loading переходит в состояние false, чтобы в вёрстке отобразились загруженные данные, а не спиннер загрузки
    }
    
    // методы onCharLoading и onError мы убираем, потому что их функционал прописан в useHttp - хуке, который, по сути, придёт и сработает из useMarvelService
    // пропишем метод, который будет запускать спиннер загрузки
    // const onCharLoading = () => {
    //     setLoading(true);
    // }
    
    // пропишем метод, который будет отображать ошибку, если от сервера не пришёл ответ
    // const onError = () => {
    //     setLoading(false); // статус загрузки меняется на false, потому что она завершилась неудачно
    //     setError(true);
    // }

    // пропишем метод, который будет обращаться к серверу, получать от него данные и их использовать для обновления state
    const updateChar = () => {
        clearError(); // после каждого обновления персонажа предусмотрим эту функцию, кт очищает ошибку. В противном случае, если вылезет ошибка, то кнопка с вызовом случайного персонажа перестанет работать
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); // получаем id рандомного персонажа
        // onCharLoading(); // убираем, потому что это сработает из метода getCharacter, который мы получили из useMarvelService
        // useMarvelService // делаем запрос на сервер
        getCharacter(id) // получаем только нужные и уже преобразованные данные о персонаже
            .then(onCharLoaded) // обновляем стэйт char данными о персонаже
            // код ниже можно убрать, потому что обработка ошибок предусмотрена ещё в useHttp, кт является основой для useMarvelService и его методов
            // .catch(onError) // если будет ошибка, высветится соответствующее сообщение
    }

    // чтобы не расписывать сложные выражения в вёрстке ниже, пропишем их тут, это хорошая практика
    const errorMessage = error ? <ErrorMessage></ErrorMessage> : null; // если получена ошибка, этой переменной будет присвоен в качестве значения компонент с ошибкой, иначе null
    const spinner = loading ? <Spinner></Spinner> : null; // если идёт загрузка, этой переменной будет присвоен в качестве значения компонент со спинером загрузки, иначе null
    const content = (!error && !loading) ? <View char={char}></View> : null; // если нет загрузки и нет ошибки, будет показан контент с данными о персонаже, иначе null

    return (
        // если идёт загрузка, то в левой части будет крутиться спиннер, если закрузка завершена, то будут показываться данные о персонаже
        <div className="randomchar">
            {errorMessage}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main" onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

// классовый подход
// class RandomChar extends Component{
//     // чтобы при загрузке страницы в этом компоненте отобразились данные, то через конструктор мы вызываем метод, который получает данные от сервера
//     // это работает, но может вызвать баги, т.к. метод срабатывает раньше, чем отрисовалась страница
//     // позже этот приём будет заменён на корректный код
//     // constructor(props) {
//     //     super(props);
//     //     this.updateChar();
//     // }
//     // поля классов позволяют прописывать такой лаконичный код для стэйтов
//     state = { // стэйтов может быть много, не только с данными о персонаже, поэтому данные о персонаже вынесем в отдельный стэйт с объектом, внутри которого и будут эти данные о персонаже
//         char: {},
//         loading: true,
//         error: false
//     }
    
//     // пропишем метод, который правильным образом при первой загрузке страницы будет запускать наш компонент, не выдавая багов, как это было при запуске метода через Constructor
//     componentDidMount() {
//         this.updateChar();
//         // this.timerId = setInterval(this.updateChar, 300000); // сделаем, чтобы обновление компонента шло через интервалы времени
//     }

//     componentWillUnmount() {
//         clearInterval(this.timerId); // чтобы запросы бесконечно не направлялись на сервер, нужно предусматривать при удалении компонента ещё и удаление интервального срабатывания обновления
//     }

//     marvelService = new MarvelService(); // выше мы импортировали наш метод с запросом на сервер, здесь его будем использовать

//     // пропишем метод, который будет обновлять стэйт char
//     onCharLoaded = (char) => {
//         this.setState({
//             char, 
//             loading: false}) // если данные от сервера вернулись (стэйту char присвоилось какое-то значение), то loading переходит в состояние false, чтобы в вёрстке отобразились загруженные данные, а не спиннер загрузки
//     }
    
//     // пропишем метод, который будет запускать спиннер загрузки
//     onCharLoading = () => {
//         this.setState({
//             loading: true
//         })
//     }
    
//     // создаём метод, который будет отображать ошибку, если от сервера не пришёл ответ
//     onError = () => {
//         this.setState({
//             loading: false, // статус загрузки меняется на false, потому что она завершилась неудачно
//             error: true})
//     }

//     // пропишем метод, который будет обращаться к серверу, получать от него данные и их использовать для обновления state
//     updateChar = () => {
//         const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); // получаем id рандомного персонажа
//         this.onCharLoading();
//         this.marvelService // делаем запрос на сервер
//             .getCharacter(id) // получаем только нужные и уже преобразованные данные о персонаже
//             .then(this.onCharLoaded) // обновляем стэйт char данными о персонаже
//             .catch(this.onError) // если будет ошибка, высветится соответствующее сообщение
//     }

//     render() {
//         const {char, loading, error} = this.state; // тут двойная деструктуризация, потому что данные лежат не просто в стэйте, а в объекте, кт внутри стэйта
//         // чтобы не расписывать сложные выражения в вёрстке ниже, пропишем их тут, это хорошая практика
//         const errorMessage = error ? <ErrorMessage></ErrorMessage> : null; // если получена ошибка, этой переменной будет присвоен в качестве значения компонент с ошибкой, иначе null
//         const spinner = loading ? <Spinner></Spinner> : null; // если идёт загрузка, этой переменной будет присвоен в качестве значения компонент со спинером загрузки, иначе null
//         const content = (!error && !loading) ? <View char={char}></View> : null; // если нет загрузки и нет ошибки, будет показан контент с данными о персонаже, иначе null

//         return (
//             // если идёт загрузка, то в левой части будет крутиться спиннер, если закрузка завершена, то будут показываться данные о персонаже
//             <div className="randomchar">
//                 {errorMessage}
//                 {spinner}
//                 {content}
//                 <div className="randomchar__static">
//                     <p className="randomchar__title">
//                         Random character for today!<br/>
//                         Do you want to get to know him better?
//                     </p>
//                     <p className="randomchar__title">
//                         Or choose another one
//                     </p>
//                     <button className="button button__main" onClick={this.updateChar}>
//                         <div className="inner">try it</div>
//                     </button>
//                     <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
//                 </div>
//             </div>
//         )
//     }
// }

// создадим отдельный компонент, который будет просто создавать вёрстку
const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    let thumnailUrl = thumbnail === `http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg`;
    let thumbnailStyle = thumnailUrl ? {objectFit: 'contain'} : null;

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={thumbnailStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;