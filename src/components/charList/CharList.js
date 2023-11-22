import { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from "react-transition-group";

import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinners';
import './charList.scss';

// это функциональный подход
const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    // эти два состояния убираем, они будут приходить из useMarvelService (подробные описания - почему - в компоненте RandomChar)
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => { // мы можем написать useEffect здесь, до объявления стрелочной функции, потому что useEffect запускается после рендеринга, а к этому времени функция уже будет объявлена
        onRequest(offset, true);
    }, []) // поставили пустой массив, чтобы сработало один раз при первом рендеринге

    // метод по запросу на сервер
    const onRequest = (offset, initial) => {
        // если initial стоит в true, т.е. идёт первая загрузка, то спиннер загрузки дополнительных персонажей не появляется, в ином случае будет появляться
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        // onCharListLoading(); // вместо него будет сразу установка нового значения этого состояния:
        getAllCharacters(offset) // получаем только нужные и уже преобразованные данные о персонажах
            .then(onCharListLoaded) // обновляем стэйт char данными о персонажах
            // .catch(onError) // это уже не надо благодаря useMarvelService
    }

    // этот метод, в целом, отвечает за процесс загрузки списка персонажей
    const onCharListLoaded = (newCharList) => { // как параметр получает новый массив (это массив, кт будет приходить от сервера, состоящий всегда из 9 персонажей)
        let ended = false; // эта переменная будет использоваться как значение для стэйта charEnded
        if (newCharList.length < 9) { // если от сервера пришло меньше 9 персонажей, значит, мы дошли до конца списка персонажей
            ended = true;
        }
        // там, где важно предыдущее значение состояния, используем коллбэк-фукнции, в остальных местах можно просто присваивать новые значения
        setCharList(charList => [...charList, ...newCharList]); // обновляем стэйт charList, перезаписывая в качестве его значения прежнее значение плюс новый массив, пришедший от сервера
        // убираем строку ниже благодаря useMarvelService
        // setLoading(false); // если данные от сервера вернулись (стэйту char присвоилось какое-то значение), то loading переходит в состояние false, чтобы в вёрстке отобразились загруженные данные, а не спиннер загрузки
        setNewItemLoading(newItemLoading => false); 
        setOffset(offset => offset + 9); // при каждом срабатывании метода будет меняться значение этого стэйта
        setCharEnded(charEnded => ended); // если сюда попадёт true, значит, мы дошли до конца списка персонажей, это будет ниже вызывать код, убирающий кнопку дозагрузки со страницы
    }

    // убираем благодаря useMarvelService
    // const onError = () => {
    //     setLoading(false); // статус загрузки меняется на false, потому что она завершилась неудачно
    //     setError(true);
    // }

    const itemRefs = useRef([]); // пока что это пустой массив, в будущем в него будут помещаться карточки персонажей

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }
    const duration = 300;
    // Этот метод создан для оптимизации, чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            let classStyle = "char__item";

            const duration = 300;
            // А эта конструкция вынесена для центровки спиннера/ошибки
            return (
                <CSSTransition 
                    in={!newItemLoading} 
                    timeout={duration}
                    classNames='charListItem'
                    >
                    <li 
                        className={classStyle}
                        tabIndex={0}
                        key={item.id}
                        ref={el => itemRefs.current[i] = el}
                        onClick={() => {
                            props.onCharSelected(item.id)
                            focusOnItem(i)
                            }}
                        onKeyPress={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                props.onCharSelected(item.id);
                                focusOnItem(i);
                            }
                        }}> 
                        {/* хоть в компоненте и не выделен пропс, React знает, что он тут есть и сам подтягивает из App переданный как свойство метод onCharSelected */}
                            <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                            <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
                // при переборе каждый элемент будет заполнять массив itemRefs с карточками персонажей
                // <li 
                //     className={classStyle}
                //     tabIndex={0}
                //     key={item.id}
                //     ref={el => itemRefs.current[i] = el}
                //     onClick={() => {
                //         props.onCharSelected(item.id)
                //         focusOnItem(i)
                //         }}
                //     onKeyPress={(e) => {
                //         if (e.key === ' ' || e.key === "Enter") {
                //             props.onCharSelected(item.id);
                //             focusOnItem(i);
                //         }
                //     }}> 
                //     {/* хоть в компоненте и не выделен пропс, React знает, что он тут есть и сам подтягивает из App переданный как свойство метод onCharSelected */}
                //         <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                //         <div className="char__name">{item.name}</div>
                // </li>
            )
        });

        return (
            <TransitionGroup component={null}>
                <ul className="char__grid">
                    {items}
                </ul>
            </TransitionGroup>
        )
    }

    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage></ErrorMessage> : null; 
    const spinner = loading && !newItemLoading ? <Spinner></Spinner> : null; 
    // убираем строку ниже, потому что она теперь при дозагрузке персонажей сперва удаляет всех персонажей со странице, а потом показывает полный новый список, такое поведение нам не нужно, пусть просто показывает что-то
    // такое поведение получилось из-за того, что мы внедрили useMarvelService
    // const content = (!error && !loading) ? items : null; // если нет загрузки и нет ошибки, будет показан контент с данными о персонаже, иначе null

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

// это классовый подход
// class CharList extends Component{
//     state = {
//         charList: [],
//         loading: true, // это статус любого процесса загрузки списка персонажей
//         newItemLoading: false, // это статус процесса дозагрузки списка персонажей
//         error: false,
//         offset: 210, // это размер отступа, кт будет передаваться в метод по работе с сервером, чтобы каждый раз мы получали новые 9 персонажей
//         charEnded: false // это состояние показывает, закончился ли список персонажей у сервера
//     }

//     marvelService = new MarvelService();

//     componentDidMount() {
//         this.onRequest();
//     }
//     // метод по запросу на сервер
//     onRequest = (offset) => {
//         this.onCharListLoading();
//         this.marvelService // делаем запрос на сервер
//             .getAllCharacters(offset) // получаем только нужные и уже преобразованные данные о персонажах
//             .then(this.onCharListLoaded) // обновляем стэйт char данными о персонажах
//             .catch(this.onError)
//     }

//     // этот метод отвечает за состояние дозагрузки списка персонажей: идёт она или нет, чтобы пользователю показать
//     onCharListLoading = () => {
//         this.setState({
//             newItemLoading: true
//         })
//     }

//     // этот метод, в целом, отвечает за процесс загрузки списка персонажей
//     onCharListLoaded = (newCharList) => { // как параметр получает новый массив (это массив, кт будет приходить от сервера, состоящий всегда из 9 персонажей)
//         let ended = false; // эта переменная будет использоваться как значение для стэйта charEnded
//         if (newCharList.length < 9) { // если от сервера пришло меньше 9 персонажей, значит, мы дошли до конца списка персонажей
//             ended = true;
//         }
//         this.setState(({offset, charList}) => ({ // тут как параметр состояние стэйта charList и offset
//             charList: [...charList, ...newCharList], // обновляем стэйт charList, перезаписывая в качестве его значения прежнее значение плюс новый массив, пришедший от сервера
//             loading: false, // если данные от сервера вернулись (стэйту char присвоилось какое-то значение), то loading переходит в состояние false, чтобы в вёрстке отобразились загруженные данные, а не спиннер загрузки
//             newItemLoading: false,
//             offset: offset + 9, // при каждом срабатывании метода будет меняться значение этого стэйта
//             charEnded: ended // если сюда попадёт true, значит, мы дошли до конца списка персонажей, это будет ниже вызывать код, убирающий кнопку дозагрузки со страницы
//         }))
//     }

//     onError = () => {
//         this.setState({
//             loading: false, // статус загрузки меняется на false, потому что она завершилась неудачно
//             error: true})
//     }

//     itemRefs = [];

//     setRef = (ref) => {
//         this.itemRefs.push(ref);
//     }

//     focusOnItem = (id) => {
//         this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
//         this.itemRefs[id].classList.add('char__item_selected');
//         this.itemRefs[id].focus();
//     }

//     // Этот метод создан для оптимизации, чтобы не помещать такую конструкцию в метод render
//     renderItems(arr) {
//         const items =  arr.map((item, i) => {
//             let imgStyle = {'objectFit' : 'cover'};
//             if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
//                 imgStyle = {'objectFit' : 'unset'};
//             }
//             let classStyle = "char__item";
//             // А эта конструкция вынесена для центровки спиннера/ошибки
//             return (
//                 <li 
//                     className={classStyle}
//                     key={item.id}
//                     ref={this.setRef}
//                     onClick={() => {
//                         this.props.onCharSelected(item.id)
//                         this.focusOnItem(i)
//                         }}
//                     onKeyPress={(e) => {
//                         if (e.key === ' ' || e.key === "Enter") {
//                             this.props.onCharSelected(item.id);
//                             this.focusOnItem(i);
//                         }
//                     }}> 
//                     {/* хоть в компоненте и не выделен пропс, React знает, что он тут есть и сам подтягивает из App переданный как свойство метод onCharSelected */}
//                         <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
//                         <div className="char__name">{item.name}</div>
//                 </li>
//             )
//         });

//         return (
//             <ul className="char__grid">
//                 {items}
//             </ul>
//         )
//     }

//     render() {
//         const {charList, loading, error, newItemLoading, offset, charEnded} = this.state; 
//         const items = this.renderItems(charList);

//         const errorMessage = error ? <ErrorMessage></ErrorMessage> : null; 
//         const spinner = loading ? <Spinner></Spinner> : null; 
//         const content = (!error && !loading) ? items : null; // если нет загрузки и нет ошибки, будет показан контент с данными о персонаже, иначе null

//         return (
//             <div className="char__list">
//                 {errorMessage}
//                 {spinner}
//                 {content}
//                 <button 
//                     className="button button__main button__long"
//                     disabled={newItemLoading}
//                     style={{'display': charEnded ? 'none' : 'block'}}
//                     onClick={() => this.onRequest(offset)}>
//                     <div className="inner">load more</div>
//                 </button>
//             </div>
//         )
//     }
// }

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;