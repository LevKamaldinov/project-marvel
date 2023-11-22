import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinners';

import './comicsList.scss';

const ComicsList = (props) => {

    const [comicsList, setComicsList] = useState([]);

    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [comicsEnded, setCharEnded] = useState(false);
    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => { // мы можем написать useEffect здесь, до объявления стрелочной функции, потому что useEffect запускается после рендеринга, а к этому времени функция уже будет объявлена
        onRequest(offset, true);
    }, []) // поставили пустой массив, чтобы сработало один раз при первом рендеринге

    // метод по запросу на сервер
    const onRequest = (offset, initial) => {
        // если initial стоит в true, т.е. идёт первая загрузка, то спиннер загрузки дополнительных персонажей не появляется, в ином случае будет появляться
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset) // получаем только нужные и уже преобразованные данные о персонажах
            .then(onCharListLoaded) // обновляем стэйт char данными о персонажах
    }

    // этот метод, в целом, отвечает за процесс загрузки списка персонажей
    const onCharListLoaded = (newComicsList) => { // как параметр получает новый массив (это массив, кт будет приходить от сервера, состоящий всегда из 9 персонажей)
        let ended = false; // эта переменная будет использоваться как значение для стэйта charEnded
        if (newComicsList.length < 8) { // если от сервера пришло меньше 8 комиксов, значит, мы дошли до конца списка комиксов
            ended = true;
        }
        // там, где важно предыдущее значение состояния, используем коллбэк-фукнции, в остальных местах можно просто присваивать новые значения
        setComicsList(comicsList => [...comicsList, ...newComicsList]); // обновляем стэйт charList, перезаписывая в качестве его значения прежнее значение плюс новый массив, пришедший от сервера
        setNewItemLoading(false); 
        setOffset(offset => offset + 8); // при каждом срабатывании метода будет меняться значение этого стэйта
        setCharEnded(ended); // если сюда попадёт true, значит, мы дошли до конца списка персонажей, это будет ниже вызывать код, убирающий кнопку дозагрузки со страницы
    }

    const itemRefs = useRef([]); // пока что это пустой массив, в будущем в него будут помещаться карточки персонажей

    // const focusOnItem = (id) => {
    //     itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
    //     itemRefs.current[id].classList.add('char__item_selected');
    //     itemRefs.current[id].focus();
    // }

    // Этот метод создан для оптимизации, чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            // А эта конструкция вынесена для центровки спиннера/ошибки
            return (
                // при переборе каждый элемент будет заполнять массив itemRefs с карточками персонажей
                <div>
                    <li 
                        className="comics__item"
                        tabIndex={0}
                        key={i}
                        ref={el => itemRefs.current[i] = el}> 
                        <Link to={`/comics/${item.id}`}>
                            <img src={item.thumbnail} alt={item.title} className='comics__item-img'/>
                            <div className="comics__item-name">{item.title}</div>
                            <div className="comics__item-price">{item.price}</div>
                        </Link>
                    </li>
                </div>


            )
        });

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(comicsList);

    const errorMessage = error ? <ErrorMessage></ErrorMessage> : null; 
    const spinner = loading && !newItemLoading ? <Spinner></Spinner> : null; 
    
    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;

