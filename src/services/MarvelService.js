import { useHttp } from "../hooks/http.hook";

// это код новый, с переделкой под хуки и функциональный подход
const useMarvelService = () => {
    // через деструктуризацию вытащим интересующие нас части useHttp
    const {loading, request, error, clearError, process, setProcess} = useHttp();
    // т.к. запрос на сайт имеет одинаковые части, можно сократить url, введя переменные
    const _apiBase ='https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=677f4f151277ce2120c892cebbe0e1ba';
    const _baseOffset = 200; // эта переменная означает отступ в количестве персонажей, начиная с первого, в запросе на сервер

    // создадим несколько методов, которые будут упрощать работу
    // метод по получению данных о всех персонажах
    const getAllCharacters = async (offset = _baseOffset) => { // предусматриваем переменную и значение по умолчанию, потому что эта переменная может меняться
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }
    // метод по получению данных о конкретном персонаже
    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`); // получили данные от сервера
        return _transformCharacter(res.data.results[0]); // возвращаем их уже в преобразованном виде
    }
    // метод по трансформации данных о персонажах, он будет полученные данные от сервера превращать в объект, кт мы используем в компонентах (там этот объект является объектом state)
    const _transformCharacter = (char) => {
        let description = char.description;
        description = description ? `${description.slice(0, 200)}...` : `Описание данного персонажа отсутствует`;

        return {
            id: char.id,
            name: char.name,
            description: description,
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items.slice(0, 10),
            title: char.title,
        }
    }

    // метод по трансформации данных о комиксах, он будет полученные данные от сервера превращать в объект, кт мы используем в компонентах (там этот объект является объектом state)
    const _transformComics = (comics) => {
        let price = comics.prices[0].price;
        price = price ? `${comics.prices[0].price}$` : `Комикс отсутствует в продаже`;

        return {
            id: comics.id,
            description: comics.description || 'Описание комикса отсутствует',
            thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
            title: comics.title.length > 50
                ? `${comics.title.slice(0, 50)}...`
                : comics.title,
            price: price,
            language: comics.textObjects[0]?.language || "en-us",
            pageCount: comics.pageCount
				? `${comics.pageCount} p.`
				: "Информация о количестве листов в комиксе отсутствует",
        }
    }

    // метод по получению списка комиксов
    const getAllComics = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }
    // метод по получению конкретного комикса
    const getComics = async (id) => {
		const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
		return _transformComics(res.data.results[0]);
	};

    // метод по получению данных о конкретном персонаже
    const getChar = async () => {
        const res = await request(`${_apiBase}characters?${_apiKey}`); // получили данные от сервера
        return res.data.results.map(_transformCharacter);
    }

    // этот хук будет возвращать состояния загрузки и ошибки, а также два метода по получению всех персонажей и только одного персонажа
    // благодаря process удаляем loading и error
    return {
            // loading, 
            // error, 
            clearError, 
            process,
            setProcess,
            getAllCharacters, 
            getCharacter, 
            getAllComics, 
            getComics, 
            getChar
        }
}

// этот код старый, до переделки его в хуки
// мы не импортируем Components и не наследуем от него, потому что это отдельный класс, в котором не будет ничего от React
// class MarvelService {
//     // т.к. запрос на сайт имеет одинаковые части, можно сократить url, введя переменные
//     _apiBase ='https://gateway.marvel.com:443/v1/public/';
//     _apiKey = 'apikey=677f4f151277ce2120c892cebbe0e1ba';
//     _baseOffset = 200; // эта переменная означает отступ в количестве персонажей, начиная с первого, в запросе на сервер
    
//     // создали функцию (метод), которая будет делать запрос
//     getResource = async (url) => {
//         let res = await fetch(url);

//         if (!res.ok) { // в случае ошибки будет выводиться сообщение об этом
//             throw new Error(`Could not fetch ${url}, status: ${res.status}`);
//         }

//         return await res.json(); // если всё хорошо, будут возвращаться данные в формате json
//     };

//     // создадим несколько методов, которые будут упрощать работу с классом
//     // метод по получению данных о всех персонажах
//     getAllCharacters = async (offset = this._baseOffset) => { // предусматриваем переменную и значение по умолчанию, потому что эта переменная может меняться
//         const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
//         return res.data.results.map(this._transformCharacter);
//     }
//     // метод по получению данных о конкретном персонаже
//     getCharacter = async (id) => {
//         const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`); // получили данные от сервера
//         return this._transformCharacter(res.data.results[0]); // возвращаем их уже в преобразованном виде
//     }
//     // метод по трансформации данных, он будет полученные данные от сервера превращать в объект, кт мы используем в компонентах (там этот объект является объектом state)
//     _transformCharacter = (char) => {
//         let description = char.description;
//         description = description ? `${description.slice(0, 200)}...` : `Описание данного персонажа отсутствует`;

//         return {
//             id: char.id,
//             name: char.name,
//             description: description,
//             thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
//             homepage: char.urls[0].url,
//             wiki: char.urls[1].url,
//             comics: char.comics.items.slice(0, 10)
//         }
//     }
// }

export default useMarvelService;
