// import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import AppHeader from "../appHeader/AppHeader";
import Spinner from "../spinner/Spinners";
// можно так:
// import MainPage from "../pages/MainPage";
// import ComicsList from "../comicsList/comicsList";
// а можно и так, это сокращает код в файле App, когда много страниц + позволяет не указывать название конкретного файла, откуда идёт эскпорт 
// (по умолчанию webpack, когда видит путь до папки, ищет там файла index.js, если он есть, то будет только путь до папки, без него надо будет указывать путь до файла):
// import { MainPage, ComicsPage, SingleComicPage } from "../pages";

const Page404 = lazy(() => import("../pages/Page404"));
const MainPage = lazy(() => import("../pages/MainPage"));
const ComicsPage = lazy(() => import("../pages/ComicsPage"));
const SingleComicPage = lazy(() => import("../pages/SingleComicPage"));
const CharPage = lazy(() => import("../charPage/CharPage"))

// это функциональный подход
const App = () => {

    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner/>}>
                        <Routes>
                            <Route path='/' element={<MainPage/>}/>
                            <Route path='comics' element={<ComicsPage/>}></Route>
                            <Route path='/comics/:id' element={<SingleComicPage/>}></Route>
                            <Route path='/char/:id' element={<CharPage/>}/>
                            <Route path='*' element={<Page404/>}/>
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
}

// это классовый подход
// class App extends Component{
//     state = {
//         // этот стэйт будет говорить, какой персонаж из списка выбран (на кого пользователь кликнул)
//         selectedChar: null // его будем передавать как свойство в CharInfo, чтобы туда уходило для работы в этом компоненте
//     }

//     // пропишем метод, кт будет устанавливать значение для selectedChar
//     onCharSelected = (id) => {
//         this.setState({
//             selectedChar: id
//         })
//     } // этот метод передадим как свойство в CharList, чтобы оттуда приходило значение стэйта

//     render() {
//         return (
//             <div className="app">
//                 <AppHeader/>
//                 <main>
//                     <ErrorBoundary>
//                         <RandomChar/>
//                     </ErrorBoundary>
//                     <div className="char__content">
//                         <ErrorBoundary>
//                             <CharList onCharSelected={this.onCharSelected}/>
//                         </ErrorBoundary>
//                         <ErrorBoundary>
//                             <CharInfo charId={this.state.selectedChar}/>
//                         </ErrorBoundary>
//                     </div>
//                     <img className="bg-decoration" src={decoration} alt="vision"/>
//                 </main>
//             </div>
//         )
//     }
// }

// App.propTypes = {
//     onCharSelected: PropTypes.func
// }

export default App;