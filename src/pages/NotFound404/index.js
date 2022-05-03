import './ErrorStyle.css';

export default function NotFound404() {
    return (

        <div>
            <div className="fixed-overlay__modal">
                <div className="error_window">
                    <p className="text_404">404</p>
                    <p className="text_error">Страница не найдена</p>
                    <a className="error_button" href="/">На главную</a>
                </div>
            </div>
        </div>
    );
}