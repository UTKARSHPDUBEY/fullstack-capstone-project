import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {urlConfig} from '../../config';

function SearchPage() {

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("");
    const [ageRange, setAgeRange] = useState(10);
    const [searchResults, setSearchResults] = useState([]);
    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    useEffect(() => {
        // fetch all products
        const fetchProducts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`
                console.log(url)
                const response = await fetch(url);
                if (!response.ok) {
                    //something went wrong
                    throw new Error(`HTTP error; ${response.status}`)
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);


    const handleSearch = async () => {
        try {

            let url =
                `${urlConfig.backendUrl}/api/search?` +
                `name=${searchQuery}` +
                `&category=${selectedCategory}` +
                `&condition=${selectedCondition}` +
                `&age_years=${ageRange}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Search failed");
            }

            const data = await response.json();
            setSearchResults(data);

        } catch (error) {
            console.log(error);
        }
    };
    const navigate = useNavigate();

    const goToDetailsPage = (productId) => {
        navigate(`/gift/${productId}`);
    };




    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column">
                            <select
                                className="form-control dropdown-filter mb-2"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="form-control dropdown-filter mb-2"
                                value={selectedCondition}
                                onChange={(e) => setSelectedCondition(e.target.value)}
                            >
                                <option value="">All Conditions</option>
                                {conditions.map((condition) => (
                                    <option key={condition} value={condition}>
                                        {condition}
                                    </option>
                                ))}
                            </select>
                            <label>Maximum Age: {ageRange} years</label>

                            <input
                                type="range"
                                min="0"
                                max="20"
                                value={ageRange}
                                onChange={(e) => setAgeRange(e.target.value)}
                                className="form-range age-range-slider"
                            />
                        </div>
                    </div>
                    <input
                        type="text"
                        className="form-control search-input mb-3"
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        className="btn btn-primary search-button mb-3"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                    <>
                        {searchResults.length === 0 ? (
                            <div className="alert alert-warning">
                                No products found.
                            </div>
                        ) : (
                            searchResults.map((gift) => (
                                <div
                                    key={gift.id}
                                    className="card search-results-card mb-3"
                                >
                                    {gift.image && (
                                        <img
                                            src={gift.image}
                                            className="card-img-top"
                                            alt={gift.name}
                                        />
                                    )}

                                    <div className="card-body">
                                        <h5>{gift.name}</h5>

                                        <p>{gift.description}</p>

                                        <button
                                            className="btn btn-primary"
                                            onClick={() => goToDetailsPage(gift.id)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
