import './ErrorStyle.css';

export default function NotFound404() {
    return (

        <div>
            <div class="fixed-overlay__modal">
                <div class="error_window">
                    <p class="text_404">404</p>
                    <p class="text_error">Страница не найдена</p>
                    <a class="error_button" href="/">На главную</a>
                </div>
            </div>
        </div>
    );
}