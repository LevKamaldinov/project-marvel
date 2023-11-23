import { Helmet } from 'react-helmet';

import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";

// эти два импорта больше не нужны, т.к. они вшиты в setContent
// import Spinner from '../spinner/Spinners';
// import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from "../../services/MarvelService";
import setContent from '../../utils/setContent';

import './charPage.scss'

const CharPage = () => {

    const {id} = useParams();
    const [char, setChar] = useState([]);
    const {loading, error, clearError, getCharacter, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [id])

    const updateChar = () => {
        clearError();
        getCharacter(id)
            .then(data => setChar(data))
            .then(() => setProcess('confirmed'))
    }

    // const errorMessage = error ? <ErrorMessage/> : null; 
    // const spinner = loading ? <Spinner/> : null; 
    // const content = (!error && !loading && char) ? <View char={char}></View> : null;

    return (
        <>
            {setContent(process, View, char)}
        </>
    )
}

export default CharPage;

const View = ({data}) => {
    const {thumbnail, description, name} = data;
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