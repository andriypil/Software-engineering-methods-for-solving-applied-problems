import { useEffect, useState } from "react";
import axios from "axios";

export default function Report({ goBack }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/data")
            .then(res => setData(res.data));
    }, []);

    return (
        <div>
            <h2>Звіт</h2>

            {data.map((item, i) => (
                <div key={i} style={{ border: "1px solid black", margin: 10, padding: 10 }}>
                    <p>Активи: {item.assets}</p>
                    <p>Зобов'язання: {item.liabilities}</p>
                    <p>Капітал: {item.capital}</p>

                    <p>V17: {item.V17}</p>
                    <p>V18: {item.V18}</p>
                    <p>V19: {item.V19}</p>
                    <p>V20: {item.V20}</p>
                    <p>V21: {item.V21}</p>
                    <p>V22: {item.V22}</p>
                </div>
            ))}

            <button onClick={() => window.print()}>Друк</button>
            <button onClick={goBack}>Назад</button>
        </div>
    );
}