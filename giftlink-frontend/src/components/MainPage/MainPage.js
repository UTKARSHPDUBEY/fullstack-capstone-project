import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {urlConfig} from '../../config';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGifts = async () => {
            try{
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts`);
                const data = await response.json();
                setGifts(data);
            }
            catch (error){
                console.error('Error fetching gifts:', error);
            }
        };
        fetchGifts();
    }, []);

    // Task 2: Navigate to details page
    const goToDetailsPage = (productId) => {
        navigate(`/gift/${productId}`);
      };

    // Task 3: Format timestamp
    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString();
      };

    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning";
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift.id} className="col-md-4 mb-4">
                        <div className="card product-card">

                            <img
                                src={gift.image || "/static/presents.svg"}
                                className="card-img-top"
                                alt={gift.name}
                            />

                            <div className="card-body">

                                <h5 className="card-title">{gift.name}</h5>

                                <p className={`card-text ${getConditionClass(gift.condition)}`}>
                                {gift.condition}
                                </p>

                                <p className="card-text">
                                    {formatDate(gift.date_added)}
                                </p>
                                

                                <button onClick={() => goToDetailsPage(gift.id)} className="btn btn-primary">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
