import { useState } from "react";
import axios from "axios";

export default function Form({ goReport }) {
    const [data, setData] = useState({
        assets: "",
        liabilities: "",
        capital: "",
        V17: "",
        V18: "",
        V19: "",
        V20: "",
        V21: "",
        V22: ""
    });

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const save = async () => {
        await axios.post("http://localhost:5000/save", data);
        alert("Збережено");
    };

    return (
        <div>
            <h2>Баланс</h2>

            <input name="assets" placeholder="Активи" onChange={handleChange} />
            <input name="liabilities" placeholder="Зобов'язання" onChange={handleChange} />
            <input name="capital" placeholder="Капітал" onChange={handleChange} />

            <h3>Додаткові дані</h3>

            <input name="V17" placeholder="Кількість років" onChange={handleChange} />
            <input name="V18" placeholder="Градація (0-5)" onChange={handleChange} />
            <input name="V19" placeholder="Макс кредит" onChange={handleChange} />
            <input name="V20" placeholder="Запитуваний кредит" onChange={handleChange} />
            <input name="V21" placeholder="Власні кошти" onChange={handleChange} />
            <input name="V22" placeholder="Майно" onChange={handleChange} />

            <br /><br />

            <button onClick={save}>Зберегти</button>
            <button onClick={goReport}>Звіт</button>
        </div>
    );
}