import {Link} from 'react-router-dom';
import MyButton from '../components/UI/button/MyButton';
import '../Styles/ErrorStyle.css';

export default function NotFound404() {
    return (

            <div class="container text">
                <div class="error_window">
                    <p class="text_404">404</p>
                    <p class="text_error">Страница не найдена</p>
                    <MyButton>
                        <Link class='text' to='/'>На главную</Link>
                    </MyButton>
                </div>
            </div>
    );
}