import { Helmet } from 'react-helmet';

import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";

import Spinner from '../spinner/Spinners';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from "../../services/MarvelService";
import './charPage.scss'

const CharPage = () => {

    const {id} = useParams();
    const [char, setChar] = useState([]);
    const {loading, error, clearError, getCharacter} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [id])

    const updateChar = () => {
        clearError();
        getCharacter(id)
            .then(data => setChar(data))
    }

    const errorMessage = error ? <ErrorMessage/> : null; 
    const spinner = loading ? <Spinner/> : null; 
    const content = (!error && !loading && char) ? <View char={char}></View> : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

export default CharPage;

const View = ({char}) => {
    const {thumbnail, description, name} = char;
    return (
        <div className="char-page">
            <Helmet>
                <meta
                    name="description"
                    content={`Page about ${name}`}
                />
                <title>{`${name} page`}</title>
            </Helmet>
            <img src={thumbnail} alt={name} className="char-page__img"/>
            <div className="char-page__info">
                <h2 className="char-page__name">{name}</h2>
                <p className="char-page__descr">{description}</p>
            </div>
        </div>
    )
}