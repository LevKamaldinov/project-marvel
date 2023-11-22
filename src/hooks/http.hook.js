import { useState, useCallback } from "react";

// это будет хук, который объединит несколько методов, связанными с изменением статусов загрузки и ошибки во время направления запросов на серврер, т.к. они повторяются в разных элементах
// кроме того, в этом хуке мы пропишем функцию по направлению запроса, которая будет выступать основой для похожей функции из MarvelService
export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // это будет мемоизированная функция по направлению запроса, в ней также укажем параметры по умолчанию
    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {

        setLoading(true); // так как пошёл запрос на сервер, у загрузки статус меняется на true

        try { // направляем запрос
            const response = await fetch(url, {method, body, headers}); // в эту переменную придёт ответ запроса
            if (!response.ok) { // в случае ошибки будет выводиться сообщение об этом
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }
            const data = await response.json(); // сюда помещается ответ от сервера, преобразованный в json

            setLoading(false); // т.к. это ветка по успешному получению ответа от запроса, значит, в конце успеха статус загрузки прекращается
            return data; // это не то же самое, что в MarvelService, потому что там возвращается трансформированные данные, а у нас изначальные от API
        } catch(e) { // этот код на случай ошибки
            setLoading(false); // загрузка завершилась неудачей, но завершилась, поэтому статус меняем на false
            setError(e.message); // вернётся текст ошибки
            throw e; // выкидываем ошибку
        }

    }, [])

    // эта функция будет очищать ошибку, если она была
    const clearError = useCallback(() => setError(null), []);

    return {loading, request, error, clearError};
}