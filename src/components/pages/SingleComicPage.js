import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Spinner from '../spinner/Spinners';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import './singleComicPage.scss';

const SingleComicPage = () => {
    // хук useParams позволяет получить объект со значением того уникального куска пути, который есть у страницы, в нашем случае это id комикса
    const {id} = useParams();
    const [comic, setComic ] = useState(null);
    const {loading, error, getComics, clearError} = useMarvelService();

    // этот метод здесь нужен для того, чтобы, если пользователь вручную поменяет адрес на другой комикс, ему отрисовалась новая страница с этим комиксом
    useEffect(() => {
        updateComics();
    }, [id]);

    // этот метод будет направлять запрос серверу и возвращать данные или ошибку
    const updateComics = () => {
        clearError();
        getComics(id)
            .then(comic => setComic(comic))
    }

    const errorMessage = error ? <ErrorMessage/> : null; 
    const spinner = loading ? <Spinner/> : null; 
    const content = (!error && !loading && comic) ? <View comic={comic}></View> : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({comic}) => {
    const {thumbnail, description, title, price, language, pageCount} = comic;
    return (
        <div className="single-comic">
            <Helmet>
                <meta
                    name="description"
                    content={`${title} comics book`}
                />
                <title>{title} comic page</title>
            </Helmet>
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to='/comics' className="single-comic__back">Back to all</Link>
        </div>
    )
}


export default SingleComicPage;