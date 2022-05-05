import {Link} from 'react-router-dom';
import MyButton from '../components/UI/button/MyButton';
import '../Styles/ErrorStyle.css';

export default function NotFound404() {
    return (

            <div className="container text">
                <div className="error_window">
                    <p className="text_404">404</p>
                    <p className="text_error">Страница не найдена</p>
                    <MyButton>
                        <Link className='text' to='/'>На главную</Link>
                    </MyButton>
                </div>
            </div>
    );
}