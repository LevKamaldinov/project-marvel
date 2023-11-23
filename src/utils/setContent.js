import Spinner from '../components/spinner/Spinners';
import ErrorMessage from '../components/errorMessage/ErrorMessage';
import Skeleton from '../components/skeleton/Skeleton'

// поскольку подобный блок логики повторяется в нескольких компонентах, мы его выделили в отдельную функцию в отдельном файле
const setContent = (process, Component, data) => {
    switch(process) {
        case 'waiting':
            return <Skeleton/>; // если у состояния процесса значение ожидания, значит, ещё не был отправлен запрос на сервер и пока на сайте у компонента стоит заглушка
        case 'loading':
            return <Spinner/>; // если у состояния процесса значение загрузки, значит, запрос отправлен на сервер, но нет никакого ответа, поэтому будет показываться компонент загрузки
        case 'confirmed':
            return <Component data={data}/>; // если у состояния процесса значение подтверждено, значит, от сервера пришли данные, а не ошибка, тогда загружается полученный контент
        case 'error':
            return <ErrorMessage/>; // если у состония процесса значение ошибки, значит, от сервера не пришли данные, а возникла ошибка, тогда показывается компонент с ошибкой
        default:
            throw new Error('Unexpected process state');
    }
}

export default setContent;