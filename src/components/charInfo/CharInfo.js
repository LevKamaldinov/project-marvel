import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// эти три импорта больше не нужны, т.к. они вшиты в setContent
// import Spinner from '../spinner/Spinners';
// import ErrorMessage from '../errorMessage/ErrorMessage';
// import Skeleton from '../skeleton/Skeleton'
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';

// это функциональный подход
const CharInfo = (props) => {
    const [char, setChar] = useState(null); // по умолчанию ставим null, чтобы подгрузился компонент Skeleton
    // убираем состояния ниже, они будут приходить из useMarvelService (подробнее, почему - в компоненте RandomChar)
    // const [loading, setLoading] = useState(false); // изначально ставим false, потому что при загрузке страницы компонент будет заполнен данными по умолчанию (из компонента Skeleton)
    // а уже когда пользователь будет кликать по списку героев, будет срабатывать обновление (или ошибка)
    // const [error, setError] = useState(false); 

    const {loading, error, clearError, process, setProcess, getCharacter} = useMarvelService();
    
    // этот хук срабатывает при первой загрузке страницы, чтобы загрузились данные по умолчанию
    useEffect(() => {
        updateChar();
    }, [])

    const charId = props.charId;

    // этот хук будет срабатывать при обновлении пропсов (а они будут меняться при каждом клике пользователя по списку героев)
    useEffect(() => {
        updateChar();
    }, [charId]);

    // создадим метод, который будет направлять запрос серверу и возвращать данные или ошибку
    const updateChar = () => {
        // const charId = props.charId;
        if (!charId) {
            return
        }

        clearError();
        // onCharLoading(); // убираем благодаря useMarvelService
        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed')) // процесс переходит в состояние подтверждённого (потому что получение данных от сервера сработало успешно)
            // .catch(onError); // убираем благодаря useMarvelService
    }

    // пропишем метод, который будет обновлять стэйт char
    const onCharLoaded = (char) => {
        setChar(char);
        // код ниже убираем благодаря useMarvelService
        // setLoading(false); // если данные от сервера вернулись (стэйту char присвоилось какое-то значение), то loading переходит в состояние false, чтобы в вёрстке отобразились загруженные данные, а не спиннер загрузки
    }

    // пропишем метод, который будет запускать спиннер загрузки
    // убираем благодаря useMarvelService
    // const onCharLoading = () => {
    //     setLoading(true);
    // }

    // создаём метод, который будет отображать ошибку, если от сервера не пришёл ответ
    // убираем благодаря useMarvelService
    // const onError = () => {
    //     setLoading(false); // статус загрузки меняется на false, потому что она завершилась неудачно
    //     setError(true);
    // }

    // т.к. мы используем setContent, это больше не нужно
    // const skeleton = char || loading || error ? null : <Skeleton></Skeleton>; // если нет ошибки, загрузки или полученных данных о персонаже, т.е. при первой загрузке страницы, будет подгружен скелетон
    // const errorMessage = error ? <ErrorMessage></ErrorMessage> : null; 
    // const spinner = loading ? <Spinner></Spinner> : null; 
    // const content = (!error && !loading && char) ? <View char={char}></View> : null;

    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
}

// это классовый подход
// class CharInfo extends Component{
//     state = {
//         char: null, // по умолчанию ставим null, чтобы подгрузился компонент Skeleton
//         loading: false, // изначально ставим false, потому что при загрузке страницы компонент будет заполнен данными по умолчанию (из компонента Skeleton)
//         // а уже когда пользователь будет кликать по списку героев, будет срабатывать обновление (или ошибка)
//         error: false
//     }

//     marvelService = new MarvelService();
    
//     // этот хук срабатывает при первой загрузке страницы, чтобы загрузились данные по умолчанию
//     componentDidMount() {
//         this.updateChar();
//     }

//     // этот хук будет срабатывать при обновлении пропсов (а они будут меняться при каждом клике пользователя по списку героев)
//     componentDidUpdate(prevProps) {
//         // если не предусмотреть условия и просто прописать метод работы с сервером, он может срабатывать бесконечно
//         if (this.props.charId !== prevProps.charId) { // если новые значения свойств отличаются от предыдущих, тогда будет срабатывать метод работы с сервером
//             this.updateChar();
//         }
//     }

//     // создадим метод, который будет направлять запрос серверу и возвращать данные или ошибку
//     updateChar = () => {
//         const {charId} = this.props;
//         if (!charId) {
//             return
//         }

//         this.onCharLoading();
//         this.marvelService
//             .getCharacter(charId)
//             .then(this.onCharLoaded)
//             .catch(this.onError);
//     }

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


//     render() {
//         const {char, loading, error} = this.state; 

//         const skeleton = char || loading || error ? null : <Skeleton></Skeleton>; // если нет ошибки, загрузки или полученных данных о персонаже, т.е. при первой загрузке страницы, будет подгружен скелетон
//         const errorMessage = error ? <ErrorMessage></ErrorMessage> : null; 
//         const spinner = loading ? <Spinner></Spinner> : null; 
//         const content = (!error && !loading && char) ? <View char={char}></View> : null;

//         return (
//             <div className="char__info">
//                 {skeleton}
//                 {errorMessage}
//                 {spinner}
//                 {content}
//             </div>
//         )
//     } 
// }

// создадим компонент, кт будет отвечать только за вёрстку
const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;
    let comicsList = comics.map((item, i) => {
        return (
            <li key={i} className="char__comics-item">
                {item.name}
            </li>
        )
    }) 
    const defaultComicsList = `Комиксы с участием выбранного персонажа отсутствуют`;

    let thumnailUrl = thumbnail === `http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg`;
    let thumbnailStyle = thumnailUrl ? {objectFit: 'contain'} : null;

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={thumbnailStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comicsList.length === 0 ? defaultComicsList : comicsList}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}
export default CharInfo;