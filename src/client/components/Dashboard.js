import React from 'react';
import axios from 'axios';
import LoadingForm from './LoadingForm';

class Dashboard extends React.Component {

    state = {
        prices: [],
        id: ''
    };

    handleSearch = () => {
        const { id } = this.state;

        if (!id) {
            return;
        }

        axios.post(`https://api.evemarketer.com/ec/marketstat/json?typeid=${id}`)
            .then(response => {
                this.setState({
                    prices: response.data
                })
            })
    };

    handleChangeId = e => {
        this.setState({
            id: e.target.value
        })
    };

    render() {

        const {
            prices,
            id
        } = this.state;

        return (
            <div>
                <LoadingForm onLoad={this.handleSearch} id={id} onChange={this.handleChangeId}/>
                {prices.map(el =>
                    <div>
                        {el.buy && el.buy.max}
                    </div>
                )}
            </div>
        )
    }
}

export default Dashboard;
