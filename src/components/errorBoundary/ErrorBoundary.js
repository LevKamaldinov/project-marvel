// этот компонент будет отвечать за создание предохранителя,т.е. компонента, кт будет показываться в случае возникновения ошибки на странице
import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

class ErrorBoundary extends Component{
    state = {
        error: false
    }

    // этот хук будет срабатывать при возникновении ошибки в компоненте
    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
        this.setState({
            error: true
        });
    }

    render() {
        if (this.state.error) {
            return <ErrorMessage></ErrorMessage>
        }
        
        return this.props.children;
    }
}

export default ErrorBoundary;